// ═══════════════════════════════════════════════════════════════════════════
//  Dinopad — cabeçalho de terminal
//
//  Implementação do padrão da frota para cabeçalho de terminal dentro deste
//  projeto. O padrão manda; aqui ele vira código. As seções citadas nos dois
//  arquivos (`§1`, `§3`, `§7`…) são as dele — o verificador é quem garante que
//  este arquivo continue obedecendo.
//
//  Três regras governam tudo abaixo, e as três vieram de defeito:
//
//   1. interface + dado, NUNCA output. Se a informação é "o que o comando
//      fez", ela sai do próprio comando. O Vite já imprime `ready in 912 ms`
//      em verde brilhante; repetir isso aqui seria o cabeçalho falando mais
//      baixo que a saída do comando — e perdendo.
//   2. um elemento que não nomeia a própria função não entra. Não existe
//      sistema de tags aqui, e nenhum deve ser inventado.
//   3. cor é semântica, não decorativa. Se um tom não é um dos tokens de
//      estrutura ou dos três de status, o elemento não recebe cor.
//
//  Não é uma TUI: não lê tecla, não redesenha, não toma a tela, não limpa o
//  scrollback. Imprime e devolve o terminal. O caminho não-interativo e o
//  caminho TUI não compartilham framework — é a regra que sai da retificação
//  do TUI, e vale para o banner tanto quanto para a tela.
//
//  ANSI puro e sem dependência: este script roda a cada `npm run dev` e é
//  sentido imediatamente.
// ═══════════════════════════════════════════════════════════════════════════

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
// A extensão é explícita porque o Vite carrega este arquivo como config, e o
// `configLoader: 'native'` — que é o default em breve — recusa import sem
// extensão. Sem ela, cada `npm run dev` imprime um aviso de depreciação.
import { resumoDependencias } from '../deps-check.ts';

// ─── Configuração ───────────────────────────────────────────────────────────
// Fica aqui, no topo, e não num arquivo separado: há um consumidor só, e um
// segundo lugar para manter em sincronia não compra nada.
const CONFIG = {
  // O nome que a pessoa diz em voz alta, que não é o `name` do npm.
  rotulo: 'Dinopad',
  // Dado declarado e estático: a porta vem do ambiente, com o padrão do
  // Vite. O `base` é lido do vite.config.ts porque é ele que decide a URL —
  // declarar ao lado do que serve é mais difícil de errar do que repetir.
  porta: Number(process.env.DINOPAD_DEV_PORT) || 5173,
};

const raiz = resolve(import.meta.dirname, '..', '..');

// ─── Tokens ─────────────────────────────────────────────────────────────────
// A hierarquia é escolha de MATIZ, não de intensidade.
const T = {
  identidade: '\x1b[1m', // o único elemento de maior destaque
  estrutura: '\x1b[90m', // rótulo, seção, régua
  dado: '', // valor: cor padrão do terminal
  foco: '\x1b[7m', // o mais importante do cabeçalho (a URL que se vai usar)
  reset: '\x1b[0m',
  ok: '\x1b[32m',
  aviso: '\x1b[33m',
  erro: '\x1b[31m',
};

const LARGURA_MINIMA = 40;
const LARGURA_MAXIMA = 100;

const largura = () => process.stdout.columns || 80;

// ─── Silêncio ───────────────────────────────────────────────────────────────
// Se não dá para desenhar, não desenha: zero bytes. Sem fallback em texto
// puro, sem degradação silenciosa para ASCII. O log de CI é lido por ferramenta
// e por olho humano, e nenhum dos dois precisa do cabeçalho.
function deveImprimir(): boolean {
  if (!process.stdout.isTTY || !process.stderr.isTTY) return false;
  if (process.env.CI) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.TERM === 'dumb') return false;
  return largura() >= LARGURA_MINIMA;
}

// ─── Dados ──────────────────────────────────────────────────────────────────
// Só entra no caminho quente o que é local e instantâneo. Nada de rede, nada
// de `npm ls`, nada de contar arquivos recursivamente.
function cmd(exe: string, args: string[]): string {
  try {
    return execFileSync(exe, args, {
      cwd: raiz,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 2000, // o gancho não pode travar o `npm run dev`
    }).trim();
  } catch {
    return '';
  }
}

interface Manifesto {
  versao: string;
  descricao: string;
}

function lerManifesto(): Manifesto | null {
  try {
    const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8')) as { version?: string; description?: string };
    if (!pkg.version) return null;
    return { versao: String(pkg.version), descricao: String(pkg.description ?? '') };
  } catch {
    return null;
  }
}

// Comparação de semver componente a componente. Coercionar para número trata
// 0.1.10 como menor que 0.1.9 — o mesmo bug que o `prev-tag.mjs` do
// release-core já corrigiu uma vez.
function comparar(a: string, b: string): number {
  const pa = a.replace(/^v/, '').split(/[-+]/)[0].split('.').map(Number);
  const pb = b.replace(/^v/, '').split(/[-+]/)[0].split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return Math.sign(d);
  }
  return 0;
}

const ultimaTag = () => cmd('git', ['tag', '--sort=-v:refname', '--list', 'v[0-9]*']).split('\n')[0] ?? '';

/**
 * A versão declarada contra a última tag publicada.
 *
 * Este é o único lugar do cabeçalho com limiar de verdade, e por isso o único
 * que usa a tríade de status. A pergunta que ele responde é a mesma que a
 * frota faz do outro lado — *"esta versão já foi publicada?"* — vista aqui em
 * segundos, no lugar onde a pessoa decide se ainda pode mexer na linha.
 *
 * `erro` é reservado para o caso em que a verdade está invertida: código mais
 * velho que a versão já publicada é o estado que realmente exige atenção, e
 * não um projeto por começar.
 */
function estadoDaVersao(declarada: string): { texto: string; tom: string } {
  const tag = ultimaTag();
  if (!tag) return { texto: 'sem tag', tom: T.aviso };
  const ordem = comparar(declarada, tag);
  if (ordem === 0) return { texto: `publicada como ${tag}`, tom: T.estrutura };
  if (ordem > 0) return { texto: `à frente de ${tag}`, tom: T.aviso };
  return { texto: `atrás de ${tag}`, tom: T.erro };
}

/**
 * A árvore instalada contra o lockfile, em uma linha.
 *
 * Devolve `null` — e a seção **não aparece** — quando a leitura falha. Um
 * cabeçalho não pode mentir dizendo "em dia" sobre uma árvore que ele não
 * conseguiu ler, e também não pode quebrar o `npm run dev` por causa de um
 * lockfile ilegível. §8 do padrão: se não se aplica, o bloco não aparece.
 */
function estadoDasDependencias(): { texto: string; tom: string } | null {
  try {
    const r = resumoDependencias();
    if (r.estado === 'ok') return { texto: 'em dia com o lockfile', tom: T.estrutura };
    const n = r.divergentes.length;
    return r.estado === 'quebrado'
      ? { texto: `${n} fora da faixa do manifesto | npm ci`, tom: T.erro }
      : { texto: `${n} atrás do lockfile | npm ci`, tom: T.aviso };
  } catch {
    return null;
  }
}

// ─── As linhas ──────────────────────────────────────────────────────────────
// Cada linha é um objeto: `min` é a largura abaixo da qual ela cai, e `0`
// significa que ela nunca cai. A ordem de sacrifício é a do padrão: dado
// secundário, depois seção, depois descrição. Nome, versão e URL nunca.
interface Parte {
  tom: string;
  texto: string;
}

interface Linha {
  min: number;
  partes: Parte[];
}

const p = (tom: string, texto: string): Parte => ({ tom, texto });

function montar(porta: number): Linha[] {
  const manifesto = lerManifesto();
  const linhas: Linha[] = [];

  // HERÓI: sem moldura, e é o único elemento de destaque.
  const estado = manifesto ? estadoDaVersao(manifesto.versao) : { texto: 'versão ilegível', tom: T.erro };
  linhas.push({
    min: 0,
    partes: [
      p(T.identidade, CONFIG.rotulo),
      p(T.estrutura, '  ' + (manifesto?.versao ?? '—')),
      p(estado.tom, '  ' + estado.texto),
    ],
  });
  if (manifesto?.descricao) linhas.push({ min: 88, partes: [p(T.estrutura, manifesto.descricao)] });
  linhas.push({ min: 0, partes: [] }); // respiro: respirar é layout

  // A DIVISÓRIA. Uma régua só, e ela separa — não emoldura. Régua em cima e
  // embaixo transformariam o cabeçalho num bloco só, que é o defeito original.
  // Ela acompanha a largura: uma régua de largura fixa estourava a linha em
  // 60, 80 e 99 colunas, e isso foi medido — não era hipótese.
  linhas.push({ min: 60, partes: [p(T.estrutura, '─'.repeat(Math.min(largura(), LARGURA_MAXIMA)))] });
  linhas.push({ min: 0, partes: [] });

  // DEV: o dado que a pessoa vai usar agora. O `base` vem do Vite, e sem ele
  // a URL devolveria 404 em toda rota menos a raiz — que é a pegadinha que
  // este cabeçalho existe para eliminar.
  //
  // A porta é o ARGUMENTO, e a fonte dela é o servidor que escutou — nunca a
  // que foi pedida. Ver `principal()` e `header-plugin.ts`: quando o Vite
  // incrementa (strictPort false, o default), a declarada e a real divergem, e
  // o cabeçalho tem que mostrar a real.
  const base = /base:\s*'([^']*)'/.exec(readFileSync(join(raiz, 'vite.config.ts'), 'utf8'))?.[1] ?? '/';
  linhas.push({
    min: 0,
    partes: [p(T.estrutura, 'DEV'), p(T.dado, '    '), p(T.foco, `http://localhost:${porta}${base}`)],
  });

  // GIT: cor de status só onde há LIMIAR real.
  const branch = cmd('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch) {
    const sujos = cmd('git', ['status', '--porcelain']).split('\n').filter(Boolean).length;
    const partes = [p(T.estrutura, 'GIT'), p(T.dado, '    ' + branch)];
    partes.push(
      sujos === 0
        ? p(T.estrutura, '  limpo')
        : p(sujos > 5 ? T.erro : T.aviso, '  ' + sujos + (sujos === 1 ? ' arquivo' : ' arquivos')),
    );
    linhas.push({ min: 66, partes });
  }

  // DEPS: a árvore instalada contra o lockfile.
  //
  // Esta linha entrou depois de um incidente medido, e não por moda. A árvore
  // local estava 16 dependências atrás do `package-lock.json` — duas delas em
  // **major** errada — e `npm run check` passou inteiro, verde, sem que nada
  // olhasse. O que sePagava: `tsc` rodava contra tipos de Node 22 num projeto
  // que pede Node 26, os testes rodavam contra uma major diferente da que a CI
  // usa, e o mesmo commit produzia bytes diferentes dos dois lados
  // (precache `789b1254d138456b` local, `2605a2540eb4063a` na CI).
  //
  // É o limiar que mais importa e que nenhuma outra linha cobre: as outras
  // descrevem o ambiente, esta diz se o que você está rodando é o que o
  // repositório travou. Por isso ela fica acima do NODE, que é informação de
  // contexto, e não de correção.
  const arvore = estadoDasDependencias();
  if (arvore) {
    linhas.push({ min: 58, partes: [p(T.estrutura, 'DEPS'), p(arvore.tom, '    ' + arvore.texto)] });
  }

  // NODE: o site declara `engines.node`, então o limiar existe e é verificável.
  const engines = (() => {
    try {
      const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8')) as { engines?: { node?: string } };
      return pkg.engines?.node ?? '';
    } catch {
      return '';
    }
  })();
  const minima = Number(/(\d+)/.exec(engines)?.[1] ?? 0);
  const atual = Number(process.versions.node.split('.')[0]);
  const desatualizado = minima > 0 && atual < minima;
  linhas.push({
    min: 48,
    partes: [
      p(T.estrutura, 'NODE'),
      p(desatualizado ? T.erro : T.dado, '    ' + process.versions.node),
      ...(desatualizado ? [p(T.erro, `  o projeto exige >= ${engines}`)] : []),
    ],
  });

  return linhas.filter((l) => l.min === 0 || largura() >= l.min);
}

// ─── Desenho ────────────────────────────────────────────────────────────────
export function renderizar(porta: number = CONFIG.porta): string {
  return montar(porta)
    .map((l) => l.partes.map((x) => (x.tom ? x.tom + x.texto + T.reset : x.texto)).join(''))
    .join('\n');
}

// ─── Ponto de saída ─────────────────────────────────────────────────────────
// Falha no limite, nunca no meio: um cabeçalho quebrado não pode quebrar o
// prompt de quem roda. Tudo aqui é engolido de propósito.
//
// A porta é parâmetro porque a **fonte** dela mudou: quem passa é o plugin do
// Vite, que lê `address().port` do servidor que escutou. Sem argumento, cai na
// declarada — que é o fallback honesto para um terminal sem servidor (o
// verificador usa exatamente esse caminho).
export function principal(porta: number = CONFIG.porta): void {
  if (!deveImprimir()) return;
  try {
    const texto = renderizar(porta);
    if (texto) process.stdout.write(texto + '\n');
  } catch {
    // silencioso, de propósito — ver acima
  }
}

const eEntry = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (eEntry) principal();
