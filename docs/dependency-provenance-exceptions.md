# Exceções de procedência de dependência

> **Decisão registrada de propósito.** O `Dependency Guard` verifica a
> procedência de publicação das dependências. Uma referência de atestação
> pendente derrubaria o workflow inteiro, e a lista abaixo é o que impede que
> esse tropeço vire um portão que ninguém pode atravessar.
>
> Este arquivo é a lista. Ele é versionado de propósito: uma exceção que só
> existisse na memória de quem autorizou é uma exceção que ninguém revisa.

## O que reprova, e o que **não** reprova

A verificação de provenance tem **duas** situações que se parecem e não são a
mesma coisa:

| situação | o registro diz | o npm faz |
|---|---|---|
| **`dist.attestations` ausente** | o pacote não reivindica provenance | **aceita** |
| **`dist.attestations` presente, endpoint 404** | o registro declara uma prova que não está lá | **reprova** |

A primeira é a maioria dos pacotes da árvore e não é exceção nenhuma. A segunda é
uma referência **pendente**, e é a única que esta lista trata. Medido em
2026-09-29 contra a árvore inteira: **uma** referência pendente.

Diferença que importa: a referência pendente não é "código não identificado" nem
"dependência adulterada". O pacote tem nome, autor, versão e assinatura
verificáveis; o que falta é o documento de prova que o registro não conseguiu
servir. Quando o registro corrigir o dado, a exceção sai daqui — por isso cada
linha tem a data e a condição de saída.

---

## A lista

O bloco abaixo é a **fonte única**: `scripts/deps-provenance.ts` lê daqui e não
tem cópia própria, então a tabela e o código não podem divergir em silêncio.

```json
[
  {
    "pacote": "whatwg-url",
    "versao": "17.1.1",
    "motivo": "O packument declara a URL de atestação e o endpoint responde 404. As versões 17.1.0 e 17.1.2 do mesmo pacote respondem 200 — é uma referência pendente isolada, não uma linha sem provenance.",
    "medidoEm": "2026-09-29",
    "saiQuando": "o registro passar a servir a atestação de whatwg-url@17.1.1"
  }
]
```

| pacote | versão | por quê | medido | sai quando |
|---|---|---|---|---|
| `whatwg-url` | `17.1.1` | packument declara a URL, endpoint **404**; `17.1.0` e `17.1.2` respondem **200** | 2026-09-29 | o registro servir a atestação de `17.1.1` |

**Por que entra:** fechar a vulnerabilidade `undici` (*moderate*,
`Denial of Service via unhandled error in WebSocket permessage-deflate
decompression`, faixa `7.28.0 - 7.29.0`) exige `jsdom@30`, e o `jsdom@30` puxa
`whatwg-url@17.1.1`, que é esta referência pendente.

---

## Por que o custo é aceitável aqui

O `undici` alcançado por `jsdom` é **devDependency usada só em teste**. Não
entra em `dist/`, não é servido no site publicado. A troca é:

- **Ganha:** `npm audit` volta a zero e a dependência com problema sai da árvore.
- **Perde:** a prova de provenance de um pacote **de desenvolvimento**.

Um risco *moderate* em código de teste trocado por um risco de procedência em
código de teste. O primeiro é explorável por quem roda a suíte; o segundo exige
comprometimento do registro, e mesmo assim o pacote continua assinado e
verificável no instante em que o dado voltar.

### A alternativa seria pior

Sem esta lista, a verificação reprova e a correção de segurança **não entra**.
O resultado líquido seria manter o `undici` vulnerável para preservar uma
verificação que, para este pacote, não tem o que verificar.

---

## Como isto é aplicado no CI

O `Dependency Guard` roda `npm run deps:provenance`, um **wrapper** em vez de
`npm audit signatures` cru. O motivo é concreto: o npm **para no primeiro**
pacote pendente, então ele não consegue dizer se a falha está contida na lista
ou se há outra atrás dela.

O wrapper é **fail-closed** nos dois modos:

| | quando roda | o que faz | custo |
|---|---|---|---|
| **portão de PR** | a cada PR que toca `package.json`, `package-lock.json` ou `.github/workflows/**` | roda o npm; se reprova, confere a coordenada que o npm nomeou contra a lista; qualquer pacote fora da lista reprova | uma execução do npm |
| **varredura** | semanal, no `schedule` do próprio workflow | enumera a árvore inteira, consulta o packument de cada pacote travado e compara **o conjunto medido** com a lista | ~390 consultas, uma vez por semana |

O buraco conhecido do portão de PR está escrito no código: ele não enxerga um
**segundo** pacote pendente, que ficaria atrás do primeiro. A varredura semanal
fecha esse buraco, com o prazo de uma semana para algo que só apareceria agora.

A verificação de vulnerabilidades conhecidas (`npm audit --audit-level=high`)
segue independente e **sem exceção nenhuma**.

## Uma nota sobre a versão do npm no CI

A PR do Dependabot que trazia o `jsdom@30` propôs um passo
`npm install --global npm@12.0.2` neste workflow. **Medido: o npm 12.0.2 falha
igual** — mesmo `E404`, mesmo pacote. O passo não resolvia nada e trocava a
versão do npm em toda execução, então foi removido. O workflow fica com o npm
que o runner traz, como os outros quatro.

## Revisão

Esta lista é revisada a cada bump de dependência. Uma entrada que continuar aqui
depois que o registro corrigiu o dado está vencida — e deve sair. A varredura
semanal avisa sozinha quando isso acontece.
