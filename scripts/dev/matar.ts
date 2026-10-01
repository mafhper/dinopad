// Derrubar a ÁRVORE de processos, e não o wrapper.
//
// Esta é a lição do incidente de 2026-09-30, e ela custou um processo para ser
// aprendida: a primeira versão da prova da DNP9 encerrava o `npm` pai e
// deixava o Vite filho **vivo**, segurando a 5173. A pessoa que subisse outro
// projeto cairia no servidor errado, e nada no terminal dizia por quê.
//
// E a árvore se derruba de jeito **diferente** em cada plataforma, e o jeito
// errado é silencioso:
//
//   - POSIX: o filho nasce `detached`, o que faz dele um líder de grupo, e
//     `kill(-pid)` sinaliza o grupo inteiro.
//   - Windows: **não existe grupo de processos negativo**. `kill(-pid)` ou
//     lança, ou mata o processo errado. A árvore se derruba com `taskkill /T`,
//     que é a única forma de dizer "e os filhos" ao Windows.
//
// A porta é a razão de isto existir: um processo órfão escutando é um
// cabeçalho que mente para a próxima pessoa, e ela só descobre pelo sintoma.

import { spawnSync, type ChildProcess } from 'node:child_process';

export const E_WINDOWS = process.platform === 'win32';

/**
 * Derruba o processo e todos os descendentes.
 *
 * `sinal` é traduzido para a flag do `taskkill` no Windows; no POSIX vai
 * direto. O `SIGKILL` é o último recurso e é explícito — quem chama passa
 * `forcar`.
 */
export function derrubarArvore(
  filho: ChildProcess,
  opcoes: { sinal?: NodeJS.Signals; forcar?: boolean } = {},
): void {
  const { sinal = 'SIGTERM', forcar = false } = opcoes;
  if (filho.pid === undefined || filho.exitCode !== null) return;

  if (E_WINDOWS) {
    // /T = a árvore. /F = forçar (SIGKILL). Sem /F o taskkill pede consentimento
    // a um processo que já não tem terminal — e fica esperando.
    const r = spawnSync(
      'taskkill',
      ['/pid', String(filho.pid), '/T', ...(forcar ? ['/F'] : [])],
      { stdio: 'ignore', windowsHide: true },
    );
    if (r.error === undefined) return;
    // taskkill indisponível: cai para o sinal direto, que é o pior caso
    // aceitável — derruba o pai e pode deixar o filho.
    try {
      filho.kill(forcar ? 'SIGKILL' : sinal);
    } catch {
      /* já saiu */
    }
    return;
  }

  try {
    // negativo = o grupo inteiro, que existe porque o filho é `detached`
    process.kill(-filho.pid, sinal);
  } catch {
    try {
      filho.kill(sinal);
    } catch {
      /* já saiu */
    }
  }
}

/**
 * Coloca o filho em um grupo próprio (POSIX) ou deixa estar (Windows).
 *
 * Sem isto, `kill(-pid)` sinalizaria também o grupo do **launcher** — e o
 * shutdown derrubaria quem o chamou, o que é um jeito elegante de matar o
 * processo errado.
 */
export function highlight(): boolean {
  return !E_WINDOWS;
}