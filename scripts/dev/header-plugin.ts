// ═══════════════════════════════════════════════════════════════════════════
//  Dinopad — o cabeçalho, dentro do processo do Vite
//
//  Por que este arquivo existe. O cabeçalho era um gancho `predev`: rodava
//  ANTES do Vite, e por isso imprimia a porta que tinha sido **pedida**. Com
//  `strictPort` no default (false), o Vite **incrementa** a porta quando a
//  pedida está ocupada — e o cabeçalho ficava errado exatamente nos casos em
//  que a pessoa mais precisava dele.
//
//  A correção tem duas partes, e as duas importam:
//
//   1. a porta vem de `address().port`, do servidor que **escutou**. Não há
//      subprocesso, não há leitura de `netstat`/`lsof`, e não há cache em disco —
//      o padrão da frota proíbe as três no caminho quente (§10 do
//      `cabecalho-de-terminal.md`), e aqui nenhuma é necessária.
//   2. a impressão acontece **depois** do `listening`. Um cabeçalho que
//      descreve um servidor que ainda não existe não é um cabeçalho com um
//      número velho; é um cabeçalho que mente sobre o presente.
//
//  E o ganho de processos: sai o `tsx` do `predev`. `npm run dev` volta a ser
//  `npm → vite`, que era a forma antes do cabeçalho existir (DNP-N3).
// ═══════════════════════════════════════════════════════════════════════════

import type { Plugin, ViteDevServer, PreviewServer } from 'vite';
import { principal } from './header.ts';


/**
 * A porta real, ou `null` se o servidor ainda não escutou.
 *
 * O `address()` devolve `string` (pipe) ou `{ port, address, family }` (TCP) —
 * e devolve `null` antes do bind. Qualquer um dos três é motivo para **não
 * imprimir**: absent is `unknown`, nunca um número chutado.
 */
function portaEmEscuta(server: { httpServer?: unknown }): number | null {
  const addr = (server.httpServer as { address?: () => unknown } | undefined)?.address?.();
  if (!addr || typeof addr !== 'object') return null;
  const porta = (addr as { port?: unknown }).port;
  return typeof porta === 'number' ? porta : null;
}

/**
 * O plugin. Registra o mesmo desenho nos dois servidores do Vite — o de
 * desenvolvimento e o de `preview` — porque os dois escutam numa porta que pode
 * não ser a pedida, e é o mesmo cabeçalho nos dois casos.
 *
 * Os tipos são os do Vite, e não um estrutural próprio: o hook aceita tanto a
 * função quanto o objeto `{ handler }`, e um tipo mais estreito é recusado pelo
 * `defineConfig` — com um erro que não aparece em runtime, só no `tsc`.
 */
export function cabecalho(): Plugin {
  const instalar = (server: ViteDevServer | PreviewServer): void => {
    const http = server.httpServer;
    // Sem `httpServer` (modo middleware), não há porta para ler. Silêncio é a
    // resposta honesta: não há servidor, não há URL.
    if (!http) return;
    http.once('listening', () => {
      const porta = portaEmEscuta(server);
      if (porta === null) return;
      principal(porta);
    });
  };

  return {
    name: 'dinopad:cabecalho',
    configureServer: instalar,
    configurePreviewServer: instalar,
  };
}