# Release

> O Dinopad é publicado no GitHub Pages a cada push em `main`. Isso é
> **deploy**. Release é outra coisa: é a tag, a nota e o arquivo que dão nome ao
> que foi construído e validado. As duas partem do mesmo código e respondem a
> perguntas diferentes — *"o que está publicado agora?"* e *"qual versão foi
> construída e validada?"*.

## O que dispara uma release

Só a tag. Não existe botão, não existe versionamento automático:

```bash
npm run check                       # a barreira completa antes de cortar a tag
git tag -a v0.1.0 -m "Dinopad v0.1.0"
git push origin v0.1.0
```

O push da tag executa `.github/workflows/release.yml`, que é apenas o *caller*:
declara a matrix e chama o [Release Core](https://github.com/mafhper/release-core),
o protocolo compartilhado do portfólio. Ferramenta, arte, notas, seções e fontes
de versão vivem em [`.github/release.config.json`](../.github/release.config.json).

O `package.json` é a fonte canônica de versão. A tag precisa concordar com ele,
ou o workflow falha antes de compilar.

## Reproduzir a release localmente

```bash
npm ci                      # a árvore tem de ser a do lockfile — ver abaixo
npm run release:local
```

Roda o mesmo `build` que a release roda e produz `release/dinopad.zip` — o
artefato exato que será publicado. Serve para conferir o que vai sair sem
esperar o GitHub.

### `npm ci` primeiro, e não é sugestão

O ZIP é construído a partir do `package-lock.json`, com as versões que ele
trava. Uma `node_modules` divergente **não falha**: ela compila, os testes
passam, e o resultado é um artefato diferente do que a CI vai publicar.

Isso não é teórico. Em 2026-09-29 a árvore local estava 16 dependências atrás do
lockfile — `@testing-library/jest-dom` numa **major** errada, `@types/node` três
majors atrás — e o `npm run check` passou inteiro sem reclamar. O sintoma era o
`dist` sair com outro hash de precache (`789b1254d138456b` local contra
`2605a2540eb4063a` na CI) por causa do `zod` instalado ser o 4.4.3 e o do
lockfile o 4.5.4.

Por isso `npm run check` começa com `npm run deps:check`, que reprova quando a
árvore não bate com o lockfile, e `npm run dev` mostra a mesma informação na
linha `DEPS`. Um build local só é um ensaio fiel depois de um `npm ci`.

**`npm install` não resolve.** Ele atualiza o lockfile para casar com a árvore, e
com isso satisfaz o gate sem trocar nada — que é exatamente o caminho que
produz o problema.

## O artefato

`dinopad-v{version}.zip`, com o site estático completo e um `MANIFEST.json` na
raiz:

```json
{
  "projeto": "dinopad",
  "versao": "0.1.0",
  "tag": "v0.1.0",
  "commit": "…",
  "data": "…",
  "base": "/dinopad/",
  "arquivos": 963,
  "bytes": 33677012
}
```

O `MANIFEST` descreve **de qual commit** o arquivo saiu, e a data vem do commit,
não do relógio: empacotar o mesmo commit duas vezes produz o mesmo manifesto.

**Atenção ao caminho.** O site é compilado com `base: /dinopad/`, e é por isso
que todo asset é referenciado a partir desse prefixo. Abrir `index.html` direto
do disco (`file://`) não funciona, e servir a pasta na raiz de um domínio também
não. Serve em `/dinopad/`, ou recompile com `vite build --base=/`:

```bash
unzip dinopad-v0.1.0.zip -d dinopad
npx serve dinopad
```

## A arte de release

A imagem da release vive em `docs/images/releases/` e é **por linha
`major.minor`**:

| Arquivo | Quando é usado |
| --- | --- |
| `release-v0.1.0-new.webp` | correção, lida do branch padrão |
| `release-v0.1.0.webp` | a tag `v0.1.0` |
| `release-v0.1-new.webp` | correção da linha `0.1` |
| `release-v0.1.webp` | a linha `0.1` — patches reaproveitam |
| `release.webp` | arquivo único, sem versão |

Com `granularity: "minor"`, entrar numa linha nova (`v0.2.0`) **exige** uma arte
nova, e o workflow falha se ela não mudar em relação à tag anterior. É o que
impede a release de repetir a imagem da versão passada. Um patch (`v0.1.1`) não
cobra trabalho editorial: ele reaproveita a arte da linha.

A arte é anexada como asset da release e o corpo aponta para
`/releases/download/<tag>/<arquivo>`.

## Corrigir a arte depois da tag

A tag não se move — cortou-se, corta-se outra.

1. Corrija o arquivo e commite como `release-vX.Y.Z-new.webp` em `main`.
2. Em **Actions → Release → Run workflow**, dispare com a tag que já existe.

O asset é reenviado e o corpo republicado, sem perder o ZIP já publicado. O
nome `-new` é convenção de autoria: a release publica o nome canônico, sem
`-new`.

## Portas da release

Os gates que a release roda são os mesmos que a CI roda, com uma diferença
deliberada:

| Etapa | O que faz |
| --- | --- |
| `gates` | `brand:validate`, `lint`, `type-check`, `test` |
| `build.command` | `npm run release:local` |

O `build` **não** é um `npm run build` genérico. Ele chama
`content:validate` antes de compilar, e essa validação é o que impede que um
índice de conteúdo quebrado vire uma versão publicada.

## Reexecutar

Um run que falhou pode ser reexecutado pela aba Actions. O `workflow_dispatch`
também existe para reprocessar uma tag já criada — o Release Core rejeita
qualquer tag que não exista no repositório, então o dispatch nunca é um segundo
mecanismo de versionamento.
