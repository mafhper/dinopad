// ═══════════════════════════════════════════════════════════════════════════
//  Dinopad — o launcher do servidor de desenvolvimento
//
//  Por que este arquivo existe. `npm run dev` chamava o Vite direto, e o Vite
//  escolhe a porta sozinho: pede a declarada, e se ela estiver ocupada ele
//  **incrementa em silêncio**. Em 2026-09-30 isso custou um incidente real —
//  o Dinopad ficou na 5173, o icon-core (mesma porta) subiu em 5174 sem dizer
//  nada, e quem abriu 5173 caiu no projeto errado. O sintoma só apareceu porque
//  os `base` são diferentes; com `base` igual, teria sido indistinguível.
//
//  Três garantias, e cada uma contra um modo de falha medido:
//
//   1. PORTA LIVRE, ESCOLHIDA AQUI. A porta é escolhida antes de o servidor
//      subir, e a escolha é **dita**. Um processo que reserva a porta e a
//      entrega ao Vite não pode divergir do que está escutando — que é o
//      defeito da DNP9, fechado pela raiz em vez de ser compensado.
//
//   2. PORTA QUE O `fetch` ACEITA. `net.listen(1719)` funciona — o SO aceita —
//      e `fetch('http://127.0.0.1:1719/')` recusa com `bad port`. A lista é a
//      do WHATWG URL Standard, transcrita de `imaginizim/scripts/net-port.mjs`
//      (ver `.dev/projects/imaginizim.md`). Uma sonda só no SO devolve uma
//      porta possivelmente inutilizável.
//
//   3. ENCERRA SOZINHO, SÓ EM DESENVOLVIMENTO. Dois horas é tempo de sobra
//      para uma sessão esquecida e curto demais para atrapalhar uma sessão
//      real. E é **só** em desenvolvimento: em CI, um servidor que se mata
//      no meio do build é um flake, não umaEconomia.
//
//  O relógio é INJETÁVEL. Um `setTimeout(7200000)` fixo não tem como ser
//  testado sem esperar duas horas — e um timer que existe só para o teste
//  passar, sem o teste cobrir o timer, é pior que não ter.
//
//  ANSI puro e sem dependência, como o cabeçalho: isto roda a cada `npm run
//  dev` e é sentido imediatamente.
// ═══════════════════════════════════════════════════════════════════════════

import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { derrubarArvore, highlight } from './matar.ts';

// ─── Portas que o cliente HTTP recusa ────────────────────────────────────────
// Lista *bad port* do WHATWG URL Standard. Node não tem essa restrição, então
// `net` e `fetch` discordam sobre o que é legal: uma porta provadamente
// bindável não é necessariamente usável.
const BAD_PORTS = new Set([
  1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79, 87, 95, 101, 102,
  103, 104, 109, 110, 111, 113, 115, 117, 119, 135, 139, 143, 161, 179, 185, 389, 427, 465, 512,
  513, 514, 515, 526, 530, 531, 532, 540, 548, 554, 556, 563, 587, 601, 636, 989, 990, 993, 995,
  1719, 1720, 1723, 2049, 3659, 4045, 5060, 5061, 6000, 6566, 6665, 6666, 6667, 6668, 6669, 6697,
  10080,
]);

export function isForbiddenPort(porta: number): boolean {
  return !Number.isInteger(porta) || porta < 1 || porta > 65535 || BAD_PORTS.has(porta);
}

// ─── A sonda ────────────────────────────────────────────────────────────────
/**
 * Reserva a porta e **devolve**, fechando em seguida. Devolver `null` é
 * "não deu" — e `null` é a resposta honesta tanto para porta ocupada quanto
 * para porta proibida. Nunca um número chutado.
 */
function tentar(porta: number, host: string): Promise<number | null> {
  return new Promise((resolve) => {
    const s = createServer();
    s.once('error', () => resolve(null));
    s.listen(porta, host, () => {
      const addr = s.address();
      s.close(() => resolve(typeof addr === 'object' && addr ? addr.port : null));
    });
  });
}

/**
 * A porta que o servidor vai usar.
 *
 * A ordem importa, e ela mudou depois de uma medição. A primeira versão pedia
 * uma porta **efêmera** ao SO quando a preferida falhava, e o launcher
 * anunciava `5565` — número que ninguém lê de relance e que não denuncia de
 * que projeto é. A varredura **sequencial** da preferida entrega `5174`, que é
 * acontinuação óbvia da que o dev esperava.
 *
 * O efêmero continua como último recurso: se a faixa inteira estiver ocupada,
 * o SO diz qual está livre, e o filtro de `BAD_PORTS` continua valendo em
 * cima dele.
 */
export async function findSafePort(preferida: number, host = '127.0.0.1', tentativas = 20): Promise<number> {
  for (let i = 0; i < tentativas; i += 1) {
    const c = await tentar(preferida + i, host);
    if (c && !isForbiddenPort(c)) return c;
  }
  // faixa esgotada: pede ao SO e descarta as que o `fetch` recusa
  for (let i = 0; i < tentativas; i += 1) {
    const c = await tentar(0, host);
    if (c && !isForbiddenPort(c)) return c;
  }
  throw new Error(`nenhuma porta utilizavel em ${host} apos ${tentativas} tentativas`);
}

// ─── O encerramento automatico ───────────────────────────────────────────────
export const HORAS_PADRAO = 2;

/**
 * O prazo de vida, em ms. Só existe em desenvolvimento.
 *
 * "Desenvolvimento" aqui é o `NODE_ENV` — e não `!process.env.CI`, que é
 * invertido e mente justamente no lugar que importa: um runner sem `CI`
 * definido ainda é CI. `NODE_ENV` é o que o Alguém declara sobre o **ambiente**,
 * e a ausência dela é desenvolvimento.
 */
export function prazoDeVida(env: NodeJS.ProcessEnv = process.env): number | null {
  if (env.NODE_ENV !== 'development') return null;
  const bruto = env.DINOPAD_DEV_MAX_HOURS;
  const horas = bruto === undefined ? HORAS_PADRAO : Number(bruto);
  return Number.isFinite(horas) && horas > 0 ? horas * 3_600_000 : null;
}

// ─── O processo ─────────────────────────────────────────────────────────────

/**
 * Sobe o servidor na porta escolhida, e — só em desenvolvimento — derruba a
 * árvore quando o prazo vence.
 *
 * `agora` e `setTimeout` entram por parâmetro para que o **teste do
 * encerramento** exista. Um prazo fixo de duas horas não tem como ser
 * verificado sem esperar duas horas.
 */
export function servir(
  porta: number,
  opcoes: {
    comando?: string;
    args?: string[];
    env?: NodeJS.ProcessEnv;
    prazo?: number | null;
    aoEncerrar?: (ms: number) => void;
    setTimeout?: typeof setTimeout;
    clearTimeout?: typeof clearTimeout;
  } = {},
): { filho: ChildProcess; cancelar: () => void } {
  const {
    comando = process.execPath,
    args,
    env = process.env,
    prazo = prazoDeVida(env),
    aoEncerrar,
    setTimeout: agendar = setTimeout,
    clearTimeout: cancelarAgendamento = clearTimeout,
  } = opcoes;

  const filho = spawn(comando, args ?? [], {
    env: { ...env, VITE_PORT: String(porta), DINOPAD_DEV_PORT: String(porta) },
    stdio: 'inherit',
    // grupo próprio no POSIX; no Windows o `taskkill /T` faz o papel equivalente
    detached: highlight(),
    shell: false,
  });

  let timer: ReturnType<typeof setTimeout> | null = null;
  if (prazo !== null && prazo !== undefined && prazo > 0) {
    timer = agendar(() => {
      aoEncerrar?.(prazo);
      derrubarArvore(filho, { sinal: 'SIGTERM', forcar: true });
    }, prazo);
  }

  const cancelar = () => {
    if (timer !== null) cancelarAgendamento(timer);
  };

  return { filho, cancelar };
}