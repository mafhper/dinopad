// O ponto de entrada do `npm run dev`.
//
// Escolhe a porta, sobe o Vite nela e imprime a porta escolhida **antes** de
// qualquer outra coisa — porque a pessoa precisa saber em qual porta o
// servidor vai estar, e o Vite não avisa quando incrementa.
//
// O cabeçalho em si é impresso pelo plugin do Vite, depois do `listening`,
// com a porta que o servidor escutou (DNP9). Aqui o que se anuncia é a
// **decisão**: "vou usar a porta nomeada" ou "a nomeada está ocupada, vou
// usar a seguinte".

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { findSafePort, prazoDeVida, servir } from './serve.ts';
import { derrubarArvore } from './matar.ts';
import { portaPreferida, PORTAS } from './portas.ts';

const NOME = 'dinopad-web';
const PREFERIDA = portaPreferida(NOME, 'DINOPAD_DEV_PORT');
const HOST = '127.0.0.1';

// O executável do Vite resolvido direto, sem passar pelo `npm exec`. Um
// wrapper a mais é um processo a mais — e um processo a mais é exatamente o
// que sobrou vivo na primeira versão da prova da DNP9.
//
// O caminho vem do campo `bin` do manifesto, e não de `vite/bin/vite.js`:
// o Vite não declara esse subpath no `exports`, e `require` o recusa com
// ERR_PACKAGE_PATH_NOT_EXPORTED. Achar o caminho "óbvio" é um jeito garantido
// de o gancho morrer na primeira execução, em silêncio, sem nada do Vite.
const require_ = createRequire(import.meta.url);
const VITE_MANIFESTO = require_.resolve('vite/package.json');
const VITE_BIN = (require_(VITE_MANIFESTO).bin?.vite ?? 'bin/vite.js') as string;
const VITE = join(dirname(VITE_MANIFESTO), VITE_BIN);

async function principal(): Promise<void> {
  const porta = await findSafePort(PREFERIDA, HOST);

  // A mensagem diz o **nome** e o número. Quem lê `5180` não sabe de que
  // projeto é; quem lê `dinopad-web 5180` sabe, e é isso que a porta nomeada
  // compra. Quando a nomeada está ocupada, o número da seguinte vem junto — sem
  // ele, a pessoa procura um servidor que não sabe onde está.
  const aviso = porta === PREFERIDA
    ? `${NOME}  porta ${porta}`
    : `${NOME}  porta ${porta}  (${PORTAS[NOME]} estava ocupada)`;
  process.stdout.write(`Dinopad  dev  ${aviso}\n`);

  const prazo = prazoDeVida();
  if (prazo !== null) {
    const horas = prazo / 3_600_000;
    process.stdout.write(
      `        encerra sozinho em ${horas}h ` +
      `(NODE_ENV=development; unset para desligar)\n`,
    );
  }

  const { filho, cancelar } = servir(porta, {
    comando: process.execPath,
    args: [VITE, '--port', String(porta), '--strictPort', '--host', HOST],
    aoEncerrar: () => {
      process.stdout.write('\nDinopad  dev  prazo vencido — encerrando a Arvore\n');
      cancelar();
    },
  });

  filho.on('exit', (codigo, sinal) => {
    cancelar();
    // Encerrado por sinal não é falha: o Ctrl+C chega assim.
    process.exitCode = sinal ? 130 : (codigo ?? 0);
  });

  process.on('SIGINT', () => {
    cancelar();
    derrubarArvore(filho);
    process.exitCode = 130;
  });
}

principal().catch((erro: unknown) => {
  process.stderr.write(`Dinopad  dev  ${erro instanceof Error ? erro.message : String(erro)}\n`);
  process.exitCode = 1;
});