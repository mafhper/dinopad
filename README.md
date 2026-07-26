# Dinopad

[![CI](https://github.com/mafhper/dinopad/actions/workflows/ci.yml/badge.svg)](https://github.com/mafhper/dinopad/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/mafhper/dinopad/actions/workflows/deploy.yml/badge.svg)](https://github.com/mafhper/dinopad/actions/workflows/deploy.yml)

Um caderno de campo do tempo profundo: atlas interativo, mobile-first e local-first sobre a história da vida, feito para crianças explorarem fósseis, evolução e evidências científicas com acompanhamento adulto.

[Abrir o Dinopad](https://mafhper.github.io/dinopad/)

## O que você pode explorar

- **Descobrir:** uma abertura editorial com pistas, leituras e organismos que mudam a cada visita.
- **Atlas:** fichas de fauna e flora com período, dieta ou modo de obtenção de energia, escala, habitat, relações e fontes.
- **Tempo:** linha do tempo com camadas de organismos e marcos geológicos.
- **Árvore:** cladograma responsivo com relações incertas explícitas e conexões de fluxo gênico.
- **Humanidade:** histórias de fósseis, linhagens e dossiês sobre evidências anatômicas e genéticas.
- **Biblioteca:** leituras em camadas essencial e aprofundada, com progresso, pontos de retomada, destaques e comentários.
- **Ferramentas:** busca por pistas, comparação temporal, favoritos e exportação ou importação dos dados de estudo.
- **Aparência:** modo automático e temas Claro, Escuro, Dourado e Roxo.

## Conteúdo atual

O checkpoint editorial **Meta 72** reúne:

- 72 organismos aprovados;
- 217 mídias locais com crédito e licença;
- 18 espécimes;
- 8 dossiês;
- 12 publicações;
- uma filogenia com 125 nós.

O checkpoint é uma base versionada, não um catálogo fechado. Novos lotes podem ampliar o atlas sem alterar os critérios de revisão.

## Como o Dinopad trata ciência

Cada ficha aprovada liga suas alegações a fontes e precisa apresentar evidência material ou observável, uma interpretação identificada ou segunda evidência científica e ao menos um recurso de escala, mapa, habitat ou morfologia.

Os galhos da árvore representam hipóteses de parentesco, não duração, ancestralidade direta ou uma escala temporal. A escala geológica usada no conteúdo é versionada como ICS 2026/06.

Intervalos fósseis são apresentados como o intervalo conhecido no registro, não como a duração exata de uma espécie. Incertezas filogenéticas usam politomias, traços e linguagem explícita em vez de serem escondidas.

## Local-first e offline

O navegador não consulta APIs durante o uso normal. Conteúdo, índices e mídias são publicados como arquivos estáticos, e o service worker mantém o build disponível offline depois da primeira carga e ativação do cache.

Progresso, favoritos, destaques, comentários e preferências ficam apenas no dispositivo:

- dados de estudo no IndexedDB `dinopad-study`;
- tema no `localStorage`;
- exportação e importação de uma cópia JSON pelas configurações.

Limpar os dados do site ou usar navegação privada pode remover informações que não tenham sido exportadas.

## Stack

- React 19, TypeScript 6 e React Router 8 em modo hash.
- Vite 8, Tailwind CSS 4 e CSS responsivo baseado em tokens.
- D3 Scale para a timeline e D3 Hierarchy para o layout determinístico da árvore.
- Framer Motion apenas para transições de contexto.
- Zod, tsx e Sharp no pipeline editorial local.
- IndexedDB e service worker sem backend de aplicação.
- Vitest, Testing Library e Playwright para validação unitária, responsiva, visual e offline.

## Desenvolvimento local

### Pré-requisitos

- Node.js 22.22 ou superior;
- npm;
- Chromium instalado pelo Playwright para os testes de navegador.

### Executar

```bash
npm ci
npm run dev
```

O Vite informa o endereço local no terminal. Para validar o build de produção:

```bash
npm run build
npm run preview
```

### Qualidade

| Comando | Verificação |
| --- | --- |
| `npm run check` | marca, lint, tipagem, testes unitários, conteúdo e build |
| `npm run brand:validate` | integridade da arte-mestre e das variantes geradas |
| `npm run content:validate` | esquema, relações, evidências, licenças e arquivos locais |
| `npm run test` | testes unitários e de componentes |
| `npm run test:e2e:ci` | jornadas estáveis em retrato, paisagem e desktop |
| `npm run test:e2e` | suíte Playwright completa, incluindo testes visuais |

Antes do primeiro teste de navegador:

```bash
npx --no-install playwright install chromium
npm run test:e2e:ci
```

### Curadoria

| Comando | Função |
| --- | --- |
| `npm run content:import -- [ids]` | importa dados brutos para `.dev/content-imports` |
| `npm run content:media` | processa mídias aprovadas e gera variantes AVIF/WebP |
| `npm run content:build` | gera o catálogo e os índices estáticos consumidos pelo app |
| `npm run content:report` | grava o relatório editorial em `.dev/content-health` |
| `npm run content:report -- --milestone meta-72` | verifica a cobertura do checkpoint Meta 72 |
| `npm run content:report -- --check-links` | testa links editoriais sem bloquear o build |

O fluxo completo de curadoria está descrito em [`src/content/README.md`](src/content/README.md).

## Estrutura

```text
src/
├── app/                         # shell, rotas e navegação
├── components/                  # componentes compartilhados
├── content/
│   ├── data/                    # organismos, filogenia, fontes, mídias e marcos
│   ├── catalog.generated.ts     # catálogo e índices gerados
│   └── schema.ts                # fonte de verdade Zod
├── features/
│   ├── arvore-evolutiva/
│   ├── busca/
│   ├── colecao-cartas/
│   ├── comparador/
│   ├── configuracoes/
│   ├── estudo/
│   ├── humanidade/
│   ├── inicio/
│   ├── linha-do-tempo/
│   └── publicacoes/
├── hooks/
├── test/
├── theme/
└── styles/
scripts/
├── brand/                       # validação e variantes da marca
└── content/                     # importação, mídia, validação, build e relatório
public/media/                    # variantes locais e miniaturas
tests/e2e/                       # jornadas e referências visuais do Playwright
```

## Conteúdo e licenças

As mídias aceitas usam CC0, domínio público, CC BY ou CC BY-SA. Autoria, página original, licença, data de acesso, alterações, legenda e texto alternativo ficam registrados em [`src/content/data/media.json`](src/content/data/media.json).

Os créditos e fontes também podem ser consultados na [tela de créditos do Dinopad](https://mafhper.github.io/dinopad/#/creditos). O repositório ainda não inclui uma licença geral para o código-fonte; as licenças registradas para as mídias não se estendem automaticamente ao software.

As regras de uso da marca aprovada estão em [`src/assets/brand/README.md`](src/assets/brand/README.md).

## Integração contínua e publicação

- O workflow **CI** executa `npm run check` e as jornadas responsivas/offline em pull requests e em `main`.
- O **Dependency Guard** instala com `npm ci --ignore-scripts`, verifica assinaturas do registro, executa `npm audit` e revisa mudanças de dependências.
- O Dependabot acompanha npm e GitHub Actions com atualizações agrupadas e cooldown para mudanças comuns.
- Cada push em `main` validado publica automaticamente o diretório `dist/` no GitHub Pages.

O build usa o `base` `/dinopad/` e o roteamento hash para funcionar de forma estática em [mafhper.github.io/dinopad](https://mafhper.github.io/dinopad/).

## Dedicação

Projeto pessoal e afetivo para a Maria Sofia e todas as crianças curiosas sobre a vida na Terra.
