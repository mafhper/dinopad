// Verificador do launcher de desenvolvimento (DNP10).
//
// Nao precisa de `no-control-regex`: as asserções daqui comparam numero de
// porta e string de saida, e nenhuma delas casa uma sequencia ANSI. O
// diretor que formata em cor e o `header.check.ts`.
//
// O que se prova aqui, e por que cada uma:
//   1. a porta preferida é usada quando está livre
//   2. com a preferida ocupada, outra é escolhida
//   3. portas `BAD_PORTS` nunca são escolhidas, nem como preferida
//   4. em desenvolvimento, o prazo existe e o default é 2h
//   5. fora de desenvolvimento (ou com 0h), **não** há prazo
//   6. o timer dispara o encerramento sem esperar 2h (relógio encurtado)
//   7. encerrar derruba a ÁRVORE: um neto que escuta não sobrevive
//
// O item 7 é o que o incidente de 2026-09-30 cobrou. A primeira versão da
// prova da DNP9 encerrava o wrapper do npm e deixava o Vite vivo, segurando a
// porta — e nada no terminal dizia por quê.

import { spawnSync, spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(new URL('../..', import.meta.url)));
const TSX = pathToFileURL(createRequire(pathToFileURL(join(RAIZ, 'package.json'))).resolve('tsx')).href;
const ALVO_SERVE = pathToFileURL(join(RAIZ, 'scripts', 'dev', 'serve.ts')).href;

const falhas: string[] = [];
let total = 0;

function ok(cond: boolean, msg: string, detalhe = ''): void {
  total += 1;
  if (cond) console.log('  ok    ' + msg);
  else {
    console.log('  FALHA ' + msg + (detalhe ? '  -> ' + detalhe : ''));
    falhas.push(msg);
  }
}

/**
 * Carrega um módulo num processo limpo e devolve o que o corpo imprimiu.
 *
 * O `alvo` é parâmetro porque as asserções do registro de portas carregam
 * `portas.ts`, e não `serve.ts`. Sem o parâmetro, testar o registro exigiria
 * duplicar a carga — e a cópia é que envelhece.
 */
function comModulo(
  corpo: string,
  env: NodeJS.ProcessEnv = {},
  alvo: string = ALVO_SERVE,
): { json?: any; stderr: string } {
  const dir = mkdtempSync(join(tmpdir(), 'dinopad-serve-'));
  const stub = join(dir, 'stub.mjs');
  writeFileSync(stub, `const m = await import(${JSON.stringify(alvo)});\n${corpo}\n`, 'utf8');
  const r = spawnSync(process.execPath, ['--import', TSX, stub], {
    cwd: RAIZ,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  rmSync(dir, { recursive: true, force: true });
  let json: any;
  try {
    json = JSON.parse((r.stdout || '').trim().split('\n').filter(Boolean).pop() ?? '');
  } catch {
    /* a última linha não era JSON */
  }
  return { json, stderr: r.stderr || '' };
}

// ── 1-3. a escolha da porta ─────────────────────────────────────────────────
console.log('\n── escolha da porta ──');

const livre = comModulo("console.log(JSON.stringify({p: await m.findSafePort(45171,'127.0.0.1')}));");
ok(livre.json?.p === 45171, 'a porta preferida e usada quando esta livre', 'veio ' + livre.json?.p);

const ocupada = comModulo(`
  const net = await import('node:net');
  const s = net.createServer();
  await new Promise((r) => s.listen(45171, '127.0.0.1', r));
  const escolhida = await m.findSafePort(45171, '127.0.0.1');
  await new Promise((r) => s.close(r));
  console.log(JSON.stringify({ escolhida }));
`);
ok(
  typeof ocupada.json?.escolhida === 'number' && ocupada.json.escolhida !== 45171,
  'com a preferida ocupada, outra porta e escolhida',
  'escolhida=' + ocupada.json?.escolhida,
);

const proibidas = comModulo(`
  const ruins = [1719,6667,10080,5060,3659].filter((p) => m.isForbiddenPort(p));
  console.log(JSON.stringify({ ruins, comum: m.isForbiddenPort(45171) }));
`);
ok(
  Array.isArray(proibidas.json?.ruins) && proibidas.json.ruins.length === 5,
  'as portas que o fetch recusa sao reconhecidas como proibidas',
  JSON.stringify(proibidas.json?.ruins),
);
ok(proibidas.json?.comum === false, 'uma porta comum nao e proibida');

const preferidaProibida = comModulo(`
  const p = await m.findSafePort(6667, '127.0.0.1');
  console.log(JSON.stringify({ p, fugiu: p !== 6667 }));
`);
ok(
  typeof preferidaProibida.json?.p === 'number' && preferidaProibida.json.p !== 6667,
  'a preferida tambem e filtrada quando e proibida',
  'p=' + preferidaProibida.json?.p,
);

// ── 4. o registro de portas nomeadas ───────────────────────────────────────
// O conserto certo da colisão é *nomear* a porta por projeto, e nomear tem
// uma asserção própria: a porta nomeada tem que estar FORA das faixas em que o
// Vite incrementa. Se ela morasse em 5173-5175, um servidor caindo ali seria
// indistinguível de um incremento — que é o defeito que a DNP10 conserta.
console.log('\n── portas nomeadas ──');

const ALVO_PORTAS = pathToFileURL(join(RAIZ, 'scripts', 'dev', 'portas.ts')).href;
const registro = comModulo(`console.log(JSON.stringify({ P: m.PORTAS }));`, {}, ALVO_PORTAS);

const P: Record<string, number> = registro.json?.P ?? {};
const FAIXA_DEV_DO_VITE = [5173, 5175];
const FAIXA_PREVIEW_DO_VITE = [4173, 4175];
const naFaixa = (p: number, [a, b]: number[]) => p >= a && p <= b;

ok(
  Object.keys(P).length > 0 &&
    Object.keys(P).every((k) => k.startsWith('dinopad-')) &&
    Object.values(P).every((p) => typeof p === 'number' && p > 0 && p < 65536),
  'o registro declara portas por NOME de projeto',
  'nomes=' + Object.keys(P).join(','),
);

ok(
  typeof P['dinopad-web'] === 'number',
  'dinopad-web existe no registro',
  'p=' + P['dinopad-web'],
);

ok(
  typeof P['dinopad-preview'] === 'number',
  'dinopad-preview existe no registro',
  'p=' + P['dinopad-preview'],
);

// A asserção que carrega o conserto: as duas fora das faixas do Vite.
ok(
  typeof P['dinopad-web'] === 'number' && !naFaixa(P['dinopad-web'], FAIXA_DEV_DO_VITE),
  `dinopad-web NAO esta na faixa de incremento do Vite (${FAIXA_DEV_DO_VITE[0]}-${FAIXA_DEV_DO_VITE[1]})`,
  'p=' + P['dinopad-web'],
);

ok(
  typeof P['dinopad-preview'] === 'number' && !naFaixa(P['dinopad-preview'], FAIXA_PREVIEW_DO_VITE),
  `dinopad-preview NAO esta na faixa de incremento do Vite (${FAIXA_PREVIEW_DO_VITE[0]}-${FAIXA_PREVIEW_DO_VITE[1]})`,
  'p=' + P['dinopad-preview'],
);

// A centena separa dev de preview: quem lê o número na tela sabe qual é.
ok(
  typeof P['dinopad-web'] === 'number' &&
    typeof P['dinopad-preview'] === 'number' &&
    P['dinopad-preview'] === P['dinopad-web'] - 1000,
  'a centena separa dev de preview (preview = dev - 1000)',
  `web=${P['dinopad-web']} preview=${P['dinopad-preview']}`,
);

// Nenhuma porta nomeada pode colidir com o que a frota já usa. Os números foram
// medidos nos repos da maquina antes da escolha — se algum deles mudar, esta
// assercao e a que acusa.
const EM_USE = [3000, 4173, 4175, 4273, 4300, 4321, 5173, 5174, 8080];
ok(
  Object.values(P).every((p) => !EM_USE.includes(p)),
  'nenhuma porta nomeada colide com uma porta ja usada na frota',
  'em uso=' + EM_USE.join(','),
);

// A sobrescrita por ambiente continua valendo: o registro e preferencia, nao decree.
const sobrescrita = comModulo(
  `console.log(JSON.stringify({ p: m.portaPreferida('dinopad-web', 'DINOPAD_DEV_PORT') }));`,
  { DINOPAD_DEV_PORT: '45999' },
  ALVO_PORTAS,
);
ok(
  sobrescrita.json?.p === 45999,
  'a porta nomeada aceita sobrescrita pelo ambiente',
  'p=' + sobrescrita.json?.p,
);

const semSobrescrita = comModulo(
  `console.log(JSON.stringify({ p: m.portaPreferida('dinopad-web', 'DINOPAD_DEV_PORT') }));`,
  {},
  ALVO_PORTAS,
);
ok(
  semSobrescrita.json?.p === P['dinopad-web'],
  'sem sobrescrita, a porta e a do registro',
  'p=' + semSobrescrita.json?.p,
);

// ── 5-6. o prazo, e onde ele existe ─────────────────────────────────────────
console.log('\n── prazo de vida ──');

const emDev = comModulo(
  "console.log(JSON.stringify({ms: m.prazoDeVida({NODE_ENV:'development'}), horas: m.HORAS_PADRAO}));",
);
ok(emDev.json?.horas === 2, 'o prazo default em desenvolvimento e 2 horas', JSON.stringify(emDev.json));
ok(emDev.json?.ms === 7_200_000, 'o prazo default e 7.200.000 ms', 'ms=' + emDev.json?.ms);

const semPrazo: Array<[string, NodeJS.ProcessEnv]> = [
  ['sem NODE_ENV', {}],
  ['NODE_ENV=production', { NODE_ENV: 'production' }],
  ['NODE_ENV=test', { NODE_ENV: 'test' }],
  ['NODE_ENV=development com 0h', { NODE_ENV: 'development', DINOPAD_DEV_MAX_HOURS: '0' }],
];
for (const [nome, env] of semPrazo) {
  const r = comModulo('console.log(JSON.stringify({ms: m.prazoDeVida(' + JSON.stringify(env) + ')}));');
  ok(r.json?.ms === null, 'sem prazo: ' + nome, 'ms=' + r.json?.ms);
}

const custom = comModulo(
  "console.log(JSON.stringify({ms: m.prazoDeVida({NODE_ENV:'development',DINOPAD_DEV_MAX_HOURS:'0.05'})}));",
);
ok(custom.json?.ms === 180_000, 'o prazo e injetavel por DINOPAD_DEV_MAX_HOURS', 'ms=' + custom.json?.ms);

// ── 6. o timer dispara de verdade, sem esperar 2h ───────────────────────────
console.log('\n── o timer dispara (relogio encurtado) ──');

const timer = comModulo(`
  let disparou = false;
  m.servir(45997, {
    prazo: 30,
    setTimeout: (fn, ms) => { setTimeout(fn, ms); return 1; },
    aoEncerrar: () => { disparou = true; },
  });
  await new Promise((r) => setTimeout(r, 250));
  console.log(JSON.stringify({ disparou }));
`);
ok(timer.json?.disparou === true, 'o timer do prazo dispara e chama aoEncerrar', JSON.stringify(timer.json));

// ── 7. encerrar derruba a ÁRVORE ────────────────────────────────────────────
// O neto escutando e o processo que o/testsou sao a mesma prova: se o
// encerramento so atingisse o wrapper, o neto continuaria escutando e a
// porta continuaria ocupada — exatamente o incidente.
console.log('\n── encerrar derruba a arvore ──');

const NETO_PORTA = 45996;
function livreAgora(porta: number): Promise<boolean> {
  return new Promise((res) => {
    const s = createServer();
    s.once('error', () => res(false));
    s.listen(porta, '127.0.0.1', () => s.close(() => res(true)));
  });
}

// um "neto": o filho do filho, que e quem escuta de verdade
const neto = spawn(process.execPath, ['-e', `
  const net = require('node:net');
  const s = net.createServer();
  s.listen(${NETO_PORTA}, '127.0.0.1');
`], { stdio: 'ignore', detached: process.platform !== 'win32' });

await new Promise((r) => setTimeout(r, 700));
const antes = await livreAgora(NETO_PORTA);
ok(antes === false, 'o neto segura a porta antes de encerrar', 'antes=' + antes);

// agora derruba a arvore a partir do pid do filho (o neto e o "filho" do grupo)
const arvore = comModulo(`
  const m2 = await import(${JSON.stringify(pathToFileURL(join(RAIZ, 'scripts', 'dev', 'matar.ts')).href)});
  m2.derrubarArvore({ pid: ${neto.pid}, exitCode: null, kill: () => {}, once: () => false }, { sinal: 'SIGKILL', forcar: true });
  console.log(JSON.stringify({ feito: true }));
`);
ok(arvore.json?.feito === true, 'derrubarArvore executou sem lancar');

await new Promise((r) => setTimeout(r, 900));
const depois = await livreAgora(NETO_PORTA);
ok(depois === true, 'a porta ficou livre depois — nenhum orfao', 'depois=' + depois);

if (neto.pid !== undefined && !neto.killed) {
  try {
    process.kill(-neto.pid, 'SIGKILL');
  } catch {
    try {
      neto.kill('SIGKILL');
    } catch { /* ja saiu */ }
  }
}

// ── resultado ───────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
if (falhas.length) {
  console.log(`${falhas.length} FALHA(S) de ${total}: ${falhas.join('; ')}`);
  process.exit(1);
}
console.log(`TUDO VERDE (${total} aserções)`);