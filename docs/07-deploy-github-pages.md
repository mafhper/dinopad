# Deploy no GitHub Pages

O site é publicado automaticamente a cada push em `main`, pelo
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). Não há branch `gh-pages`
manual, nem token configurado à mão: o workflow usa as actions oficiais do GitHub para Pages.

Este documento existe porque há **um passo que o workflow não dá para automatizar por arquivo**.

## O passo manual, único e obrigatório

No repositório, em **Settings → Pages**, mude **Source** para **GitHub Actions**.

Sem isso, o workflow `deploy` termina com sucesso e **nada é publicado** — o job passa, o site
continua servindo a versão anterior, e não há erro em lugar nenhum. É o caso mais comum de
"deployed with no effect" que existe com Pages.

| Source escolhido | O que acontece |
| --- | --- |
| `Deploy from a branch` | O workflow roda, mas não publica. Sem erro. |
| `GitHub Actions` | O workflow publica. Correto. |

Feito uma vez, vale para todos os pushes seguintes: o `deploy.yml` cuida do resto.

## O que o workflow faz, em ordem

1. **Checkout** com `persist-credentials: false` — o token do job não sobra no clone.
2. **Node 22** com `cache: npm` — o cache do npm é a única coisa que o setup-node traz.
3. **`npm ci`** — nunca `npm install`. A árvore de dependências tem de bater com o
   `package-lock.json`, e é isso que a trava.
4. **`npm run check`** — os portões completos (`deps:check`, `brand:validate`, `dev:check`,
   `lint`, `type-check`, `test`, `build`) antes de qualquer publicação. Se o build quebrar, nada
   vai ao ar.
5. **Upload do artefato** a partir de `./dist`.
6. **`deploy-pages`**, com `pages: write` e `id-token: write` — permissões mínimas, apenas
   `contents: read` no resto.

O workflow dispara em `push` em `main` e também aceita disparo manual pela aba **Actions**
(`workflow_dispatch`).

## Concorrência

```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```

Dois pushes seguidos não publicam em paralelo: **o segundo cancela o primeiro**. Se um deploy longo
for cancelado pelo push seguinte, o site vai ao ar na versão do **último** commit — que é o
desejado, e a razão de `cancel-in-progress` ser `true` aqui.

## Release e deploy são separados

Este workflow **não** é o de release. A release (`release.yml`, via
[release-core](https://github.com/mafhper/release-core)) roda por **tag** e publica o ZIP do
`dist` como artefato de release. O deploy roda por **push** e publica o site.

Não conflita: `main` recebe push constantly e vira site; uma tag `v*` vira release. O que o
release-core **não** faz é publicar no Pages — por desenho, para que subir uma tag não substitua o
site.

## Diagnóstico

| sintoma | leitura |
| --- | --- |
| O site não atualiza depois de um push | Quase sempre é o **Source** ainda em `Deploy from a branch`. Confira Settings → Pages. |
| O workflow falhou no passo 4 | Os portões reprovaram. O log do run traz o comando exato; é o mesmo `npm run check` local. |
| O site voltou uma versão atrás | Houve dois pushes seguidos e o segundo cancelou o primeiro; confira a aba Actions. |
| `404` nas rotas internas | O app é estático e usa *fallback* de rota; se aparecer, o build do `dist` saiu incompleto. |

## Ver o que está no ar

```bash
gh run list --workflow deploy.yml --limit 5   # os últimos runs
gh run watch <run-id>                         # acompanhar
```

O run bem-sucedido imprime a URL pública no passo `deploy`.