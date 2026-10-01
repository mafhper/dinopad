// Verificação do cabeçalho contra o PADRÃO, não contra a minha palavra.
// Cada asserção cita a seção do padrão que ela prova.
//
// Uso: npm run dev:check
//
// A primeira versão de um verificador assim já passou dezenas de asserções sem
// ter renderizado nada: o stub de TTY importava o alvo por caminho cru, e no
// Windows o loader ESM exige URL file://. Duas guardas existem para isso não
// voltar: `ok()` imprime o detalhe, e nenhuma asserção de conteúdo roda sem a
// guarda NÃO-VAZIO antes.

/* eslint-disable no-control-regex --
   As sequências ANSI (\x1b) são o próprio formato que o padrão §3 mede: quem
   verifica token de cor precisa casar o token, e ele é um caractere de
   controle. Tira-lo do padrão deixaria a verificação cega justamente no que
   ela existe para provar. */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ALVO = join(RAIZ, 'scripts', 'dev', 'header.ts');
const REGUA = '─';
const falhas: string[] = [];

// O loader é resolvido por caminho ABSOLUTO, e não pelo especificador `tsx`: a
// prova que roda com `cwd` fora do repositório é justamente a que precisa
// continuar funcionando, e com o especificador o Node resolveria o pacote a
// partir daquele cwd, não acharia `node_modules`, e a falha estaria na prova —
// não no cabeçalho. E é URL, não caminho cru: no Windows um `C:\...` passado ao
// `--import` é lido como especificador sem esquema, e o Node morre com
// ERR_UNSUPPORTED_ESM_URL_SCHEME antes de rodar a primeira linha.
const TSX = pathToFileURL(createRequire(pathToFileURL(join(RAIZ, 'package.json'))).resolve('tsx')).href;

function ok(cond: boolean, msg: string, detalhe?: string): void {
  if (cond) {
    console.log('  ok    ' + msg);
  } else {
    console.log('  FAIL  ' + msg + (detalhe ? '\n          ' + detalhe : ''));
    falhas.push(msg);
  }
}

const TOKENS_PERMITIDOS = ['\x1b[1m', '\x1b[90m', '\x1b[7m', '\x1b[0m', '\x1b[32m', '\x1b[33m', '\x1b[31m'];
const LARGURAS = [120, 100, 88, 84, 80, 66, 58, 48, 45, 39];
const ROTULOS = /^(DEV|DEPS|GIT|NODE)\b/gm;

function rodar(args: string[], env: NodeJS.ProcessEnv, cwd = RAIZ) {
  return spawnSync(process.execPath, ['--import', TSX, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

console.log('cabeçalho de terminal — verificação contra o padrão\n');

// ── o módulo carrega sem erro e não imprime ao ser importado ───────────────
{
  const carrega = rodar([ALVO], { CI: '1' });
  ok(carrega.status === 0, 'o módulo carrega sem erro', (carrega.stderr || '').split('\n')[1]);
  ok((carrega.stdout || '') === '', 'importar o módulo não imprime nada (o desenho é explícito)');
}

// ── §7 silêncio: sem TTY / com CI / com NO_COLOR / com TERM=dumb, zero bytes ─
const SILENCIOS: Array<[string, NodeJS.ProcessEnv]> = [
  ['com CI', { CI: '1' }],
  ['com NO_COLOR', { NO_COLOR: '1' }],
  ['com TERM=dumb', { TERM: 'dumb' }],
];
for (const [nome, env] of SILENCIOS) {
  const r = rodar([ALVO], env);
  ok((r.stdout || '') === '', `§7  ${nome}, imprime ZERO bytes`, JSON.stringify((r.stdout || '').slice(0, 90)));
}
{
  const r = spawnSync(process.execPath, [ALVO], { cwd: RAIZ, encoding: 'utf8', env: { ...process.env } });
  ok((r.stdout || '') === '', '§7  sem TTY (pipe), imprime ZERO bytes', JSON.stringify((r.stdout || '').slice(0, 90)));
}

// ── §7 falha contida: entrada que não pôde ser lida não derruba o gancho ────
// Quebrar o `package.json` do repositório NÃO é uma prova válida: o loader ESM
// do Node recusa carregar qualquer arquivo num diretório com `package.json`
// inválido, e morre ANTES da primeira linha do cabeçalho. O defeito estaria na
// prova, não no cabeçalho. As duas provas abaixo exercitam o caminho que
// importa de verdade — subprocesso que não existe e diretório de trabalho que
// não é um repositório — e nenhum dos dois pode derrubar o `npm run dev`.
{
  const r = comTty(100, { PATH: '' });
  ok(r.status === 0, '§7  sem `git` no PATH: sai com código 0', 'status=' + r.status);
  ok(/DEV/.test(semCor(r.saida)), '§7  sem `git` no PATH: o cabeçalho AINDA desenha a seção que não depende dele');
}
{
  const vazio = mkdtempSync(join(tmpdir(), 'dinopad-header-'));
  try {
    const r = comTty(100, {}, vazio);
    ok(r.status === 0, '§7  cwd fora do repositório: sai com código 0', 'status=' + r.status);
    ok(/DEV/.test(semCor(r.saida)), '§7  cwd fora do repositório: ainda desenha');
  } finally {
    rmSync(vazio, { recursive: true, force: true });
  }
}

// ── §7 o caminho de render sai com 0 ───────────────────────────────────────
// O que este bloco mede mudou com a DNP9. Antes era `npm run predev`: um
// gancho à parte, executado antes do Vite, que portanto imprimia a porta
// *pedida*. Agora o cabeçalho é um plugin do Vite e imprime depois do
// `listening`, com a porta que o servidor *escutou* — e o `predev` saiu do
// manifesto (o `npm run dev` voltou a ser `npm → vite`, um processo a menos).
//
// O que este bloco mede agora é a mesma garantia: **o caminho de render não
// quebra o prompt de quem roda**. Ele importa `principal()` e chama com um
// terminal sem TTY, que é o caso em que ele decide não imprimir nada.
{
  const dir = mkdtempSync(join(tmpdir(), 'dinopad-header-'));
  const stub = join(dir, 'sem-tty.mjs');
  writeFileSync(
    stub,
    `const m = await import(${JSON.stringify(pathToFileURL(ALVO).href)});\n` + 'm.principal();\n',
    'utf8',
  );
  const r = spawnSync(process.execPath, ['--import', TSX, stub], {
    cwd: RAIZ,
    encoding: 'utf8',
    env: { ...process.env, CI: '1' },
  });
  rmSync(dir, { recursive: true, force: true });
  ok(r.status === 0, 'o caminho de render sai com código 0', 'status=' + r.status + ' err=' + String(r.error ?? ''));
}

// ── DNP9: a porta que sai é a que foi passada, não a declarada ────────────
// Esta é a prova de que o defeito da DNP9 está fechado. Ela falharia contra o
// `header.ts` de antes, que ignorava qualquer porta e imprimia a do
// `CONFIG` — porque 7311 e 9999 são portas que aquele arquivo nunca conhecia,
// e ele as imprimiria igualmente como 5173.
{
  const dir = mkdtempSync(join(tmpdir(), 'dinopad-header-'));
  const stub = join(dir, 'com-tty.mjs');
  writeFileSync(
    stub,
    'process.stdout.isTTY = true;\n' +
      'process.stderr.isTTY = true;\n' +
      'Object.defineProperty(process.stdout, "columns", { value: 100 });\n' +
      `const m = await import(${JSON.stringify(pathToFileURL(ALVO).href)});\n` +
      'm.principal(7311);\n',
    'utf8',
  );
  const r = spawnSync(process.execPath, ['--import', TSX, stub], {
    cwd: RAIZ,
    encoding: 'utf8',
    env: { ...process.env, CI: '', NO_COLOR: '', TERM: 'xterm-256color' },
  });
  rmSync(dir, { recursive: true, force: true });
  const saida = semCor(r.stdout || '');
  ok(
    /localhost:7311/.test(saida) && !/localhost:5173/.test(saida),
    'DNP9: a linha DEV mostra a porta EM ESCUTA, não a declarada',
    'saida=' + JSON.stringify(saida.split('\n').find((l) => l.includes('DEV')) ?? ''),
  );
}

// ── conteúdo, com TTY simulado ─────────────────────────────────────────────
function semCor(saida: string): string {
  return saida.replace(/\x1b\[[0-9;]*m/g, '');
}

function comTty(cols: number, extraEnv: NodeJS.ProcessEnv = {}, cwd = RAIZ): { saida: string; status: number | null } {
  const dir = mkdtempSync(join(tmpdir(), 'dinopad-header-'));
  const stub = join(dir, 'stub.mjs');
  writeFileSync(
    stub,
    'process.stdout.isTTY = true;\n' +
      'process.stderr.isTTY = true;\n' +
      `Object.defineProperty(process.stdout, "columns", { value: ${cols} });\n` +
      `const m = await import(${JSON.stringify(pathToFileURL(ALVO).href)});\n` +
      'm.principal();\n',
    'utf8',
  );
  const r = spawnSync(process.execPath, ['--import', TSX, stub], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: '', NO_COLOR: '', TERM: 'xterm-256color', ...extraEnv },
  });
  rmSync(dir, { recursive: true, force: true });
  if (r.status !== 0) {
    console.log('          (o stub saiu com ' + r.status + ': ' + (r.stderr || '').split('\n')[1] + ')');
  }
  return { saida: r.stdout || '', status: r.status };
}

const soRegua = new RegExp('^' + REGUA + '+$', 'm');

for (const cols of LARGURAS) {
  const { saida } = comTty(cols);
  const limpo = semCor(saida);
  console.log(`\n  ── ${cols} colunas ──`);
  for (const l of limpo.trimEnd().split('\n')) console.log('     ' + l);

  if (cols === 39) {
    ok(limpo.trim() === '', '§6  39 colunas: não imprime (abaixo do mínimo)', JSON.stringify(limpo.slice(0, 90)));
    continue;
  }

  // GUARDA: sem isso, todas as verificações abaixo passam por vacuidade.
  ok(limpo.trim().length > 0, `GUARDA ${cols}: renderizou algo`);

  ok((limpo.match(new RegExp('^' + REGUA + '+$', 'gm')) || []).length <= 1, `§5  ${cols}: no máximo 1 régua (divisória), não moldura`);
  ok(!/ready in|compiled|VITE v|Local:|Network:|modules transformed/.test(limpo), `§1  ${cols}: não repete output do comando`);
  ok(!/\[[a-z]{2,}\]/.test(limpo), `§2  ${cols}: sem etiquetas de categoria`);
  // §12 é "sem emoji e sem arte ASCII" — não é "sem acento". A descrição do
  // pacote é texto em português e legitimately tem acento; o que não entra é
  // pictograma. A régua é o único glifo não-ASCII que o padrão prescreve, e
  // ela não conta porque é estrutura.
  ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u.test(saida), `§12 ${cols}: sem emoji nem seta tipográfica`);
  ok(!/[A-Za-z]:\\|\/home\/|\/Users\//.test(limpo), `§12 ${cols}: sem caminho absoluto de filesystem`);

  const intrusos = [...new Set(saida.match(/\x1b\[[0-9;]*m/g) || [])].filter((c) => !TOKENS_PERMITIDOS.includes(c));
  ok(intrusos.length === 0, `§3  ${cols}: só os tokens do padrão`, JSON.stringify(intrusos));

  ok(/Dinopad/.test(limpo), `§6  ${cols}: identidade nunca cai`);
  ok(/http:\/\/localhost:\d+\/dinopad\//.test(limpo), `§6  ${cols}: URL principal nunca cai, e traz o base do Vite`);
  ok(!/…|\.\.\.$/.test(limpo.trimEnd()), `§6  ${cols}: sem truncamento`);

  // §6 NENHUMA linha passa da largura. Mede-se a largura VISÍVEL (sem ANSI):
  // a primeira versão media o comprimento bruto e, por sorte do código de
  // escape, não via a régua que estourava.
  const maisLonga = Math.max(...limpo.split('\n').map((l) => l.length));
  ok(maisLonga <= cols, `§6  ${cols}: nenhuma linha passa da largura`, 'mais longa=' + maisLonga);

  // §4 interface em caixa alta. O herói é dado; os rótulos de seção são interface.
  const rotulos = (limpo.match(ROTULOS) || []).length;
  ok(rotulos > 0, `§4  ${cols}: rótulos de seção em caixa alta`);
  ok(!/^Dinopad [a-z]/.test(limpo), `§4  ${cols}: o herói (dado) NÃO vai em caixa alta`);

  // §6 degradação nos limiares declarados
  ok(cols >= 60 ? soRegua.test(limpo) : !soRegua.test(limpo), `§5  ${cols}: régua no limiar de 60`);
  ok(cols >= 58 ? /DEPS/.test(limpo) : !/DEPS/.test(limpo), `§6  ${cols}: DEPS no limiar de 58`);
  ok(cols >= 48 ? /NODE/.test(limpo) : !/NODE/.test(limpo), `§6  ${cols}: NODE no limiar de 48`);
  ok(cols >= 66 ? /GIT/.test(limpo) : !/GIT/.test(limpo), `§6  ${cols}: GIT no limiar de 66`);
  ok(cols >= 88 ? /Atlas interativo/.test(limpo) : !/Atlas interativo/.test(limpo), `§6  ${cols}: descrição no limiar de 88`);

  ok(!/\x1b\[2J|\x1b\[3J|\x1b\[H/.test(saida), `§7  ${cols}: nunca limpa a tela nem move o cursor`);
  ok(!/\x1b\[\?1049h/.test(saida), `§7  ${cols}: nunca entra na tela alternativa`);
  ok(saida.endsWith('\n'), `§7  ${cols}: devolve o terminal com quebra de linha`);
}

// ── §3 status: a versão declarada contra a última tag, uma forma só ─────────
// A tríade de status é rara e tem de merecer. Aqui há um limiar de verdade, e
// a prova é que o estado cai em exatamente uma das quatro formas declaradas.
{
  const { saida } = comTty(120);
  const linha = semCor(saida).split('\n')[0];
  const formas: Array<[string, RegExp]> = [
    ['sem tag', / sem tag$/],
    ['publicada', / publicada como v\d+\.\d+\.\d+$/],
    ['à frente', / à frente de v\d+\.\d+\.\d+$/],
    ['atrás', / atrás de v\d+\.\d+\.\d+$/],
  ];
  const achada = formas.find(([, re]) => re.test(linha));
  ok(!!achada, '§3  a primeira linha diz, em uma das quatro formas, se a versão já foi publicada', JSON.stringify(linha));
}

// ── §3 status: a árvore instalada contra o lockfile ─────────────────────────
// A mesma tríade, o segundo limiar de verdade do cabeçalho. Aqui a prova é
// mais forte: a árvore é de fato quebrada, e a asserção não pode passar por
// vacuidade — ela exige ver o tom de erro no lugar certo.
{
  const { saida } = comTty(120);
  const linha = semCor(saida).split('\n').find((l) => l.startsWith('DEPS')) ?? '';
  ok(/em dia com o lockfile/.test(linha), '§3  DEPS diz em que estado a árvore está', JSON.stringify(linha));
  ok(/npm ci/.test(linha) === /fora da faixa|atrás/.test(linha), '§3  DEPS só sugere `npm ci` quando há o que corrigir');
  const comProblema = saida.split('\n').find((l) => l.includes('\x1b[31m') && l.includes('DEPS')) ?? '';
  ok(comProblema === '', '§3  com a árvore em dia, DEPS não usa o tom de erro');
}

// ── §3 status: `erro` é para o caso em que a verdade está invertida ─────────
// Um projeto por começar não é erro; uma árvore que viola o próprio manifesto é.
{
  const original = join(RAIZ, 'node_modules', 'zod', 'package.json');
  const bom = readFileSync(original, 'utf8');
  const falso = JSON.parse(bom) as { version: string };
  falso.version = '3.0.0'; // fora de `^4.4.3`: major errada, que é o caso medido
  writeFileSync(original, JSON.stringify(falso, null, 2), 'utf8');
  try {
    const { saida } = comTty(120);
    const linhaANSI = saida.split('\n').find((l) => l.includes('DEPS')) ?? '';
    const limpo = semCor(linhaANSI);
    ok(/fora da faixa do manifesto \| npm ci/.test(limpo), '§3  árvore violando o manifesto: DEPS diz o que houve', JSON.stringify(limpo));
    ok(linhaANSI.includes('\x1b[31m'), '§3  árvore violando o manifesto: DEPS usa o tom de erro');
    ok(/DEPS[\s\S]*\x1b\[31m/.test(saida), '§3  o tom de erro está na linha do DEPS, não em outra');
  } finally {
    writeFileSync(original, bom, 'utf8');
  }
}

// ── DNP9: o plugin passa a porta que o servidor ESCUTOU ───────────────────
// A prova de execução (subir o Vite e ler o terminal) exige um TTY de verdade,
// e no Windows não há TTY nativo sem dependência. O que está sob teste não é o
// terminal: é **a ligação**. O plugin lê `address().port` e passa para
// `principal()`. Isso é medido com um servidor falso que devolve uma porta
// conhecida — e reprova se o plugin ler qualquer outra coisa, ou se voltar a
// ler a declarada.
{
  const dir = mkdtempSync(join(tmpdir(), 'dinopad-header-'));
  const stub = join(dir, 'plugin.mjs');
  const alvoPlugin = pathToFileURL(join(RAIZ, 'scripts', 'dev', 'header-plugin.ts')).href;
  writeFileSync(
    stub,
    [
      'const { EventEmitter } = await import("node:events");',
      'const linhas = [];',
      'const escreve = process.stdout.write.bind(process.stdout);',
      'process.stdout.write = (t) => { linhas.push(String(t)); return true; };',
      'process.stdout.isTTY = true;',
      'process.stderr.isTTY = true;',
      'Object.defineProperty(process.stdout, "columns", { value: 100 });',
      `const { cabecalho } = await import(${JSON.stringify(alvoPlugin)});`,
      'const http = new EventEmitter();',
      'http.address = () => ({ port: 5187, address: "127.0.0.1", family: "IPv4" });',
      'cabecalho().configureServer({ httpServer: http });',
      'http.emit("listening");',
      'await new Promise((r) => setTimeout(r, 80));',
      'process.stdout.write = escreve;',
      'const txt = linhas.join("").replace(/\\x1b\\[[0-9;]*m/g, "");',
      'console.log(JSON.stringify({ temEscuta: /localhost:5187/.test(txt), temDeclarada: /localhost:5173/.test(txt) }));',
    ].join('\n'),
    'utf8',
  );
  const r = spawnSync(process.execPath, ['--import', TSX, stub], {
    cwd: RAIZ,
    encoding: 'utf8',
    env: { ...process.env, CI: '', NO_COLOR: '', TERM: 'xterm-256color' },
  });
  rmSync(dir, { recursive: true, force: true });
  let leitura: { temEscuta?: boolean; temDeclarada?: boolean };
  try {
    leitura = JSON.parse((r.stdout || '').trim().split('\n').filter(Boolean).pop() ?? '{}');
  } catch {
    leitura = {};
  }
  ok(
    leitura.temEscuta === true && leitura.temDeclarada !== true,
    'DNP9: o plugin passa ao cabecalho a porta que o servidor escutou',
    'saida=' + (r.stdout || '').slice(-140),
  );
}

console.log('\n' + (falhas.length ? `FALHOU (${falhas.length})` : 'TUDO VERDE'));
process.exit(falhas.length ? 1 : 0);
