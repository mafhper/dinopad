// O ponto de entrada do `npm run preview`.
//
// Antes este script era `vite preview` cru, e por isso tinha o defeito da §1 do
// documento da frota sem ter o aviso da §2: se a porta estivesse ocupada, o Vite
// incrementava **em silêncio**. A auditoria encontrou isso ao nomear as portas —
// `preview` usava o `4173`, que é o default do Vite e a mesma faixa em que os
// outros projetos caem.
//
// A porta de preview é nomeada (`dinopad-preview`, 4180) e passa pela mesma
// sonda, pelo mesmo `--strictPort` e pela mesma mensagem que a de dev. Sem prazo
// de encerramento: quem vai `preview` está conferindo um build e vai encerrar.

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { findSafePort, servir } from './serve.ts';
import { derrubarArvore } from './matar.ts';
import { portaPreferida, PORTAS } from './portas.ts';

const NOME = 'dinopad-preview';
const PREFERIDA = portaPreferida(NOME, 'DINOPAD_PREVIEW_PORT');
const HOST = '127.0.0.1';

const require_ = createRequire(import.meta.url);
const VITE_MANIFESTO = require_.resolve('vite/package.json');
const VITE_BIN = (require_(VITE_MANIFESTO).bin?.vite ?? 'bin/vite.js') as string;
const VITE = join(dirname(VITE_MANIFESTO), VITE_BIN);

async function principal(): Promise<void> {
  const porta = await findSafePort(PREFERIDA, HOST);
  const aviso = porta === PREFERIDA
    ? `${NOME}  porta ${porta}`
    : `${NOME}  porta ${porta}  (${PORTAS[NOME]} estava ocupada)`;
  process.stdout.write(`Dinopad  preview  ${aviso}\n`);

  // `aoEncerrar` recebe uma referênciaposterior a `cancelar`: o hook e
  // guardado dentro de `servir` e chamado no fim da vida do processo, quando a
  // destructuring ja terminou. Passar a funcao direto seria usar a variavel
  // antes de ela existir — e o `tsc` recusa, o que e exatamente o que aconteceu.
  let cancelar: () => void = () => {};
  const servico = servir(porta, {
    comando: process.execPath,
    args: [VITE, 'preview', '--port', String(porta), '--strictPort', '--host', HOST],
    aoEncerrar: () => cancelar(),
  });
  cancelar = servico.cancelar;
  const { filho } = servico;

  filho.on('exit', (codigo, sinal) => {
    cancelar();
    process.exitCode = sinal ? 130 : (codigo ?? 0);
  });

  process.on('SIGINT', () => {
    cancelar();
    derrubarArvore(filho);
    process.exitCode = 130;
  });
}

principal().catch((erro: unknown) => {
  process.stderr.write(`Dinopad  preview  ${erro instanceof Error ? erro.message : String(erro)}\n`);
  process.exitCode = 1;
});