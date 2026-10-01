// O registro de portas do Dinopad.
//
// A porta deixa de ser um número escrito no meio do código e passa a ser um
// **nome** com um número atribuído. A diferença não é de estilo: com o nome, a
// porta pode ser procurada, documentada e — quando outro projeto da frota for
// nomeado do mesmo jeito — verificada contra as outras, para saber se duas
// linhas se cruzam.
//
// A fonte do problema está medida em `colisao-de-porta-dev-server.md` §4 item 5:
// cinco projetos da frota declaravam **5173** — `mafhper.github.io`, `sonara_hub`,
// `nebula`, `icon-core` e o próprio Dinopad. "Dois projetos, um localhost" não
// é um acidente: é o default do Vite, e todo projeto novo cai nele.
//
// ## A faixa é escolha, e não arbitraria
//
// Os números ficam **fora** de 5173-5175 e de 4173-4175 de propósito. Essas são
// as faixas do incremento automático do Vite: é nelas que um servidor cai
// quando algo já está escutando. Uma porta nomeada que morasse ali seria
// confundida com um incremento — que é exatamente o defeito que a DNP10
// conserta. Numa porta nomeada, um número diferente **significa** que alguém
// escolheu outra coisa, e não que o Vite desistiu da sua.
//
// | nome | número | para quê |
// |---|---|---|
// | `dinopad-web` | 5180 | `npm run dev` |
// | `dinopad-preview` | 4180 | `npm run preview` (build local servido) |
//
// O par difere de 1000 entre si porque as faixas do Vite também diferem de
// 1000 (`5173` para dev, `4173` para preview): quem lê um número na tela sabe
// dizer qual dos dois servidores é pela centena.
//
// A sobrescrita por ambiente continua existindo (`DINOPAD_DEV_PORT`,
// `DINOPAD_PREVIEW_PORT`), porque o registro é a **preferência** e não um
// decreto: quem precisa de outra porta diz qual, e a sonda do `serve.ts` continua
// sendo quem garante que ela está livre.

export const PORTAS = {
  'dinopad-web': 5180,
  'dinopad-preview': 4180,
} as const;

export type PortaNome = keyof typeof PORTAS;

export function portaDe(nome: PortaNome): number {
  return PORTAS[nome];
}

/** A porta nomeada, com a sobrescrita por ambiente quando existir. */
export function portaPreferida(nome: PortaNome, variavel: string): number {
  const doAmbiente = Number(process.env[variavel]);
  return Number.isInteger(doAmbiente) && doAmbiente > 0 ? doAmbiente : PORTAS[nome];
}