// Verifica se `node_modules` corresponde ao `package-lock.json`.
//
// Por que isso existe: em 2026-09-29 a árvore local estava 16 dependências
// atrás do lockfile, duas delas em **major** errada — `@testing-library/
// jest-dom@6.9.1` com o manifesto pedindo `^7.0.1`, e `@types/node@22.20.1`
// pedindo `^26.1.1`. `npm ls` devolvia 1 e ninguém perguntou, porque nenhum
// passo do `check` olha. O resultado foi um `npm run check` verde que não
// dizia nada sobre o conjunto de dependências que a CI usa.
//
// A consequência mensurável: o mesmo commit produzia digests de precache
// diferentes local (`789b1254d138456b`) e na CI (`2605a2540eb4063a`), porque o
// `zod` instalado era o 4.4.3 e o do lockfile é o 4.5.4 — o code splitting
// muda e 16 nomes de chunk cascateiam. Depois de `npm ci`, o digest local
// passou a bater com o da CI.
//
// Isto é uma verificação de **integridade da árvore**, não de segurança: ele
// não diz o que uma dependência faz, só se ela é a que foi travada.
//
// Uso: npm run deps:check        (falha se a árvore divergir do lockfile)
//      import { resumoDependencias } from './deps-check.ts'

/* eslint-disable no-control-regex --
   As sequências ANSI são o formato das cores do relatório e do cabeçalho do
   `dev`; quem verifica formatação precisa casar a formatação. */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const raiz = resolve(import.meta.dirname, '..');

// ── Comparação de versões ───────────────────────────────────────────────────
// Um subconjunto deliberado de semver: o que este manifesto usa, e um pouco
// mais. O motivo de escrever em vez de importar `semver` é que `semver` aqui
// seria uma dependência **transitiva** — e este projeto tem `npm audit` como
// gate, o que torna "importar o semver de outra pessoa" uma decisão ruins.
//
// Falha para o lado fechado: uma faixa que o comparador não entende NÃO é
// aprovada em silêncio. Ela é reprovada, com o nome da faixa na mensagem. Um
// gate que passa no que não sabe medir é o verde falso que este arquivo existe
// para matar — então o desconhecido vira erro, e a correção é humana.
type Prefixo = '^' | '~' | '~>' | '=' | '>' | '>=' | '<' | '<=';

function comparar(a: string, b: string): number {
  const pa = a.split(/[-+]/)[0].split('.').map(Number);
  const pb = b.split(/[-+]/)[0].split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return Math.sign(d);
  }
  return 0;
}

/** `[minimo, maximo)` — o máximo é **exclusivo**. */
function intervalo(termo: string, prefixo: Prefixo): [string, string] {
  const segmentos = termo.split('.');
  if (segmentos.length > 3) {
    throw new Error(`faixa não suportada: "${termo}" (tem ${segmentos.length} segmentos)`);
  }

  const variavel = segmentos.findIndex((s) => s === '' || s === 'x' || s === 'X' || s === '*');
  const fixos = (variavel === -1 ? segmentos : segmentos.slice(0, variavel)).map(Number);
  if (fixos.some((n) => !Number.isFinite(n) || n < 0)) {
    throw new Error(`faixa não suportada: "${termo}" (versão não numérica)`);
  }

  const partes = fixos.length;
  if (partes === 0) throw new Error(`faixa não suportada: "${termo}" (versão ausente)`);

  const [a, b, c] = [fixos[0], fixos[1] ?? 0, fixos[2] ?? 0];
  const min = `${a}.${b}.${c}`;

  // Um termo com menos de três segmentos é parcial mesmo sem `x`: `1.2` no
  // semver é `>=1.2.0 <1.3.0`, não `1.2.0 exato`.
  const parcial = variavel !== -1 || partes < 3;

  if (prefixo === '^') {
    // `^0.2.3` trava o minor e `^0.0.3` trava o patch — é a regra do semver, e é
    // onde a conta ingênua erra: em 0.x é que a API muda de forma.
    if (a !== 0) return [min, `${a + 1}.0.0`];
    if (partes >= 2 && b !== 0) return [min, `0.${b + 1}.0`];
    if (partes >= 3) return [min, `0.0.${c + 1}`];
    return [min, `0.${b + 1}.0`];
  }
  if (prefixo === '~' || prefixo === '~>') {
    // `~` sobe o minor e nunca o major.
    return [min, partes >= 2 ? `${a}.${b + 1}.0` : `${a + 1}.0.0`];
  }
  if (parcial) {
    return [min, partes >= 2 ? `${a}.${b + 1}.0` : `${a + 1}.0.0`];
  }
  // Completamente fixado: o teto exclusivo é o próprio patch seguinte.
  return [min, `${a}.${b}.${c + 1}`];
}

/** Casa um termo com a versão: `^1.2.3`, `>=2`, `1.x`, `2.0.0`. */
function casaTermo(versao: string, termo: string): boolean {
  const alvo = termo.trim();
  if (alvo === '' || alvo === '*' || alvo === 'x' || alvo === 'latest') return true;

  const partes = /^(\^|~>|~|>=|<=|>|<|=)?\s*(.+)$/.exec(alvo);
  if (!partes) throw new Error(`termo ilegível: "${termo}"`);
  const prefixo = (partes[1] ?? '=') as Prefixo;
  const corpo = partes[2].trim();
  if (corpo === '') throw new Error(`termo sem versão: "${termo}"`);

  const [min, max] = intervalo(corpo, prefixo);
  const abaixo = comparar(versao, min);

  switch (prefixo) {
    case '>':
      return abaixo > 0;
    case '>=':
      return abaixo >= 0;
    case '<':
      return abaixo < 0;
    case '<=':
      return abaixo <= 0;
    default:
      return abaixo >= 0 && comparar(versao, max) < 0;
  }
}

/**
 * Faixa completa, com alternativas separadas por `||`.
 *
 * A distinção que a primeira versão perdeu: **não casar** é `false`, e **não
 * entender** é erro. As duas coisas caíam no mesmo `throw`, o que fazia o gate
 * dizer "faixa não suportada" para toda versão simplesmente fora da faixa — e
 * o teste `satisfaz('5.0.0', '^4.4.3')` reprovou por exatamente isso.
 *
 * Todas as alternativas são avaliadas antes de qualquer comparação, para que
 * um `||` com termo inválido no fim seja erro mesmo quando o primeiro já
 * casou. Sem isso, a ordem dos termos decidiria se o erro aparece.
 */
export function satisfaz(versao: string, faixa: string): boolean {
  const alternativas = faixa
    .split('||')
    .map((a) => a.trim().split(/\s+/).filter(Boolean))
    .filter((termos) => termos.length > 0);

  if (alternativas.length === 0) throw new Error(`faixa não suportada: "${faixa}" (vazia)`);

  return alternativas.map((termos) => termos.map((t) => casaTermo(versao, t))).some((casa) => casa.every(Boolean));
}

// ── A leitura ───────────────────────────────────────────────────────────────

export type Estado = 'ok' | 'desatualizado' | 'quebrado';

export interface Divergencia {
  nome: string;
  instalada: string | null;
  travada: string | null;
  faixa: string;
  motivo: string;
}

export interface Resumo {
  estado: Estado;
  total: number;
  divergentes: Divergencia[];
}

function lerJson(caminho: string): unknown {
  return JSON.parse(readFileSync(caminho, 'utf8'));
}

function versaoInstalada(nome: string): string | null {
  const manifesto = join(raiz, 'node_modules', ...nome.split('/'), 'package.json');
  if (!existsSync(manifesto)) return null;
  try {
    return String((lerJson(manifesto) as { version?: string }).version ?? '') || null;
  } catch {
    return null;
  }
}

/**
 * Compara cada dependência direta com o lockfile.
 *
 * `quebrado`  — a instalada não satisfaz a faixa do manifesto. É o caso grave:
 *               major errada, e foi o que passou em silêncio.
 * `desatualizado` — difere do lockfile, mas ainda satisfaz a faixa. Menos grave,
 *               e ainda assim suficiente para o build não ser o que a CI mediu.
 */
export function resumoDependencias(): Resumo {
  const pkg = lerJson(join(raiz, 'package.json')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const lock = lerJson(join(raiz, 'package-lock.json')) as {
    packages?: Record<string, { version?: string }>;
  };

  const diretas: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };
  const divergentes: Divergencia[] = [];

  for (const [nome, faixa] of Object.entries(diretas).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    const travada = lock.packages?.[`node_modules/${nome}`]?.version ?? null;
    const instalada = versaoInstalada(nome);

    if (!instalada) {
      divergentes.push({ nome, instalada: null, travada, faixa, motivo: 'não instalada' });
      continue;
    }
    if (!travada) {
      divergentes.push({ nome, instalada, travada: null, faixa, motivo: 'ausente do package-lock.json' });
      continue;
    }
    if (instalada === travada) continue;

    let dentroDaFaixa: boolean;
    try {
      dentroDaFaixa = satisfaz(instalada, faixa);
    } catch {
      divergentes.push({
        nome,
        instalada,
        travada,
        faixa,
        motivo: `não verificável — o comparador não entende a faixa "${faixa}"`,
      });
      continue;
    }
    divergentes.push({
      nome,
      instalada,
      travada,
      faixa,
      motivo: dentroDaFaixa ? 'atrás do lockfile' : 'viola a faixa do package.json',
    });
  }

  const quebrado = divergentes.some((d) => d.motivo !== 'atrás do lockfile');
  return { estado: quebrado ? 'quebrado' : divergentes.length > 0 ? 'desatualizado' : 'ok', total: Object.keys(diretas).length, divergentes };
}

// ── Relatório ───────────────────────────────────────────────────────────────

// Os tons abaixo são os mesmos do cabeçalho do `dev` (`scripts/dev/header.ts`).
const TOM = { quebrado: '\x1b[31m', desatualizado: '\x1b[33m', ok: '\x1b[32m', estrutura: '\x1b[90m', reset: '\x1b[0m' };

export function relatorio(): string {
  const r = resumoDependencias();
  const linhas = [
    `${TOM.estrutura}dependências diretas${TOM.reset}  ${r.total}`,
    `${TOM.estrutura}node_modules${TOM.reset}         ${r.estado === 'ok' ? 'em dia com o package-lock.json' : `${r.divergentes.length} divergentes`}`,
  ];

  const largura = Math.max(0, ...r.divergentes.map((d) => d.nome.length));
  for (const d of r.divergentes) {
    const grave = d.motivo !== 'atrás do lockfile';
    linhas.push(
      `  ${grave ? TOM.quebrado : TOM.desatualizado}${d.nome.padEnd(largura)}${TOM.reset}  ` +
        `${d.instalada ?? '—'} → ${d.travada ?? '—'}  ${TOM.estrutura}${d.motivo}${TOM.reset}`,
    );
  }

  if (r.estado !== 'ok') {
    linhas.push('');
    linhas.push(`${TOM.estrutura}Rode${TOM.reset} npm ci ${TOM.estrutura}para reinstalar exatamente o que está travado.${TOM.reset}`);
    linhas.push(`${TOM.estrutura}npm install${TOM.reset} ${TOM.estrutura}atualiza o lockfile e não resolve a divergência.${TOM.reset}`);
  }

  return linhas.join('\n');
}

function principal(): void {
  const r = resumoDependencias();
  const colorido = process.stdout.isTTY && !process.env.NO_COLOR;
  console.log(colorido ? relatorio() : relatorio().replace(/\x1b\[[0-9;]*m/g, ''));
  process.exit(r.estado === 'ok' ? 0 : 1);
}

const eEntry = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (eEntry) principal();
