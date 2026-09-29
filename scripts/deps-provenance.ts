// Procedência de publicação das dependências, com exceções enumeradas.
//
// Uso:
//
//   npm run deps:provenance            portão de PR: barato, roda o npm
//   npm run deps:provenance -- --sweep varredura semanal: enumera a árvore toda
//
// ## O que reprova, e por que a lista é pequena
//
// A verificação de proveniência não falha por "pacote sem prova". Falha por
// **referência pendente**: o packument do pacote declara uma URL de atestação e
// o endpoint não responde. As duas coisas são bem diferentes:
//
//   - `dist.attestations` **ausente**  → o pacote não reivindica provenance.
//     O npm aceita. Não é exceção, e a maioria dos pacotes está aqui.
//   - `dist.attestations` **presente** e o endpoint dá 404 → o registro declara
//     uma prova que não está lá. Isso reprova, e precisa de exceção nomeada.
//
// A lista em `docs/dependency-provenance-exceptions.md` é a **fonte única**,
// lida de um bloco JSON do próprio documento — a tabela e o código não podem
// divergir em silêncio.
//
// ## Por que dois modos
//
// `npm audit signatures` para no **primeiro** pacote pendente. No portão de PR,
// isso basta para ler a coordenada do erro e conferir contra a lista: se o npm
// nomeou um pacote que não está na lista, reprova. O custo é uma execução do
// npm, e o tempo de uma porta.
//
// A consequência é que a porta não enxerga um **segundo** pacote pendente, que
// ficaria atrás do primeiro. A varredura semanal existe para fechar esse buraco:
// ela percorre a árvore inteira, com todas as versões travadas, e compara o
// conjunto medido com a lista. Uma semana é o prazo aceitável para um segundo
// pacote pendente que só apareceu agora.
//
// Falha para o lado fechado: qualquer pacote fora da lista reprova os dois modos.

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const raiz = resolve(import.meta.dirname, '..');
const documento = resolve(raiz, 'docs', 'dependency-provenance-exceptions.md');
const CONCORRENCIA = 16;
const TIMEOUT_MS = 20_000;

interface Excecao {
  pacote: string;
  versao: string;
  motivo: string;
  medidoEm: string;
  saiQuando: string;
}

/** A lista mora no documento, num bloco cercado. Uma fonte só, versionada e revisável. */
export function lerExcecoes(): Excecao[] {
  const texto = readFileSync(documento, 'utf8');
  const bloco = /```json\s*\r?\n([\s\S]*?)\r?\n```/.exec(texto);
  if (!bloco) {
    throw new Error('docs/dependency-provenance-exceptions.md não tem bloco JSON com a lista de exceções.');
  }
  const lista: unknown = JSON.parse(bloco[1]);
  if (!Array.isArray(lista)) throw new Error('A lista de exceções no documento não é um array.');
  for (const item of lista) {
    const e = item as Excecao;
    if (typeof e.pacote !== 'string' || typeof e.versao !== 'string') {
      throw new Error(`Entrada de exceção sem pacote/versão: ${JSON.stringify(item)}`);
    }
  }
  return lista as Excecao[];
}

/** Nome e versão de cada pacote travado no lockfile, resolvendo aninhamento. */
function pacotesTravados(): Array<{ pacote: string; versao: string }> {
  const lock = JSON.parse(readFileSync(resolve(raiz, 'package-lock.json'), 'utf8')) as {
    packages?: Record<string, { version?: string }>;
  };
  const porNome = new Map<string, Set<string>>();
  for (const [caminho, meta] of Object.entries(lock.packages ?? {})) {
    // `a/node_modules/b/node_modules/c` → o pacote é `c`.
    const ultimo = caminho.lastIndexOf('node_modules/');
    if (ultimo === -1 || !meta.version) continue;
    const pacote = caminho.slice(ultimo + 'node_modules/'.length);
    const versoes = porNome.get(pacote) ?? new Set<string>();
    versoes.add(meta.version);
    porNome.set(pacote, versoes);
  }
  return [...porNome].flatMap(([pacote, versoes]) => [...versoes].map((versao) => ({ pacote, versao })));
}

async function buscar(url: string): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
}

/**
 * Referências de atestação pendentes na árvore travada.
 * Só consulta as versões que o lockfile fixa — nunca o histórico do pacote.
 */
export async function referenciasPendentes(
  alvos: Array<{ pacote: string; versao: string }>,
): Promise<string[]> {
  const porNome = new Map<string, string[]>();
  for (const { pacote, versao } of alvos) {
    porNome.set(pacote, [...(porNome.get(pacote) ?? []), versao]);
  }
  const nomes = [...porNome.keys()].sort();
  const pendentes: string[] = [];
  let proximo = 0;

  const trabalhador = async () => {
    for (;;) {
      const i = proximo++;
      const nome = nomes[i];
      if (nome === undefined) return;

      let packument: { versions?: Record<string, { dist?: { attestations?: { url?: string } } }> };
      try {
        const resposta = await buscar(`https://registry.npmjs.org/${nome.replace('/', '%2f')}`);
        if (!resposta.ok) continue;
        packument = (await resposta.json()) as typeof packument;
      } catch {
        continue; // registro indisponível não é ausência de prova
      }

      for (const versao of porNome.get(nome) ?? []) {
        const declarada = packument.versions?.[versao]?.dist?.attestations?.url;
        if (!declarada) continue; // não reivindica provenance: o npm aceita
        try {
          const resposta = await buscar(declarada);
          if (!resposta.ok) pendentes.push(`${nome}@${versao}`);
        } catch {
          pendentes.push(`${nome}@${versao}`);
        }
      }
    }
  };

  await Promise.all(Array.from({ length: CONCORRENCIA }, trabalhador));
  return pendentes.sort();
}

function rodarNpm(): { ok: boolean; saida: string } {
  const r = spawnSync('npm', ['audit', 'signatures'], {
    cwd: raiz,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    timeout: 10 * 60 * 1000,
  });
  if (r.error) return { ok: false, saida: String(r.error.message) };
  return { ok: r.status === 0, saida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/** A coordenada que o npm nomeia no erro: o endpoint que ele não conseguiu ler. */
function pacoteNomeadoPorNpm(saida: string): string | null {
  const achado = /attestations\/(.+?)\s+-\s+Not found/.exec(saida);
  return achado?.[1] ?? null;
}

function relatar(excecoes: Excecao[], declaradas: Set<string>, pendentes: string[]): number {
  console.log(`referências pendentes: ${pendentes.length}`);
  for (const p of pendentes) {
    console.log(`  ${declaradas.has(p) ? '(exceção declarada)' : 'FORA DA LISTA '} ${p}`);
  }
  const foraDaLista = pendentes.filter((p) => !declaradas.has(p));
  const obsoletas = [...declaradas].filter((p) => !pendentes.includes(p));
  for (const p of obsoletas) {
    console.warn(`aviso: exceção declarada e não mais medida — remova do documento: ${p}`);
  }
  if (foraDaLista.length > 0) {
    console.error(`\n${foraDaLista.length} pendente(s) fora da lista declarada. Reprova.`);
    console.error('A lista vive em docs/dependency-provenance-exceptions.md.');
    return 1;
  }
  console.log(`\nProcedência: a reprovação cabe nas ${excecoes.length} exceção(ões) declarada(s).`);
  return 0;
}

async function principal(): Promise<void> {
  const sweep = process.argv.includes('--sweep');
  const excecoes = lerExcecoes();
  const declaradas = new Set(excecoes.map((e) => `${e.pacote}@${e.versao}`));

  if (sweep) {
    console.log('Varredura semanal: enumerando a árvore inteira…');
    const medido = await referenciasPendentes(pacotesTravados());
    process.exit(relatar(excecoes, declaradas, medido));
  }

  const npm = rodarNpm();
  if (npm.ok) {
    process.stdout.write(npm.saida);
    console.log('Procedência: o npm verificou todas as dependências instaladas.');
    return;
  }
  process.stdout.write(npm.saida);

  // O npm parou no primeiro. A lista é a autoridade para essa coordenada.
  const nomeado = pacoteNomeadoPorNpm(npm.saida);
  if (nomeado === null) {
    console.error('\nO npm reprovou por um motivo que não é referência de atestação pendente.');
    console.error('Este wrapper só sabe relaxar pendências de provenance nomeadas. Reprova.');
    process.exit(1);
  }
  console.log(`\nO npm nomeou: ${nomeado}`);
  process.exit(relatar(excecoes, declaradas, [nomeado]));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  principal().catch((erro: unknown) => {
    console.error(erro instanceof Error ? erro.message : String(erro));
    process.exit(1);
  });
}
