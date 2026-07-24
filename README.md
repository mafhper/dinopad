# Dinopad

Atlas interativo mobile-first sobre a história da vida, feito para crianças explorarem fósseis com acompanhamento adulto.

## O que existe hoje

- Checkpoint editorial Meta 72: 72 organismos, com expansão posterior por lotes.
- 216 mídias de organismos, mais evidência de linhagem, com crédito e licença para uso offline.
- Linha do tempo com camadas de fauna, flora e marcos.
- Cladograma responsivo com 125 nós, relações incertas explícitas, conexões de fluxo gênico e foco progressivo no celular.
- Atlas, busca, comparação temporal, histórias de espécimes e créditos integrados.
- Percurso Humanidade com 12 histórias fósseis e oito dossiês conceituais.
- Biblioteca com 12 publicações em duas camadas, favoritos, progresso, destaques, exportação e importação locais.
- Aparência persistente com modo automático e temas Claro, Escuro, Dourado e Roxo.

Os galhos da árvore representam hipóteses de parentesco, não duração, ancestralidade direta ou uma escala temporal. A escala geológica usada no conteúdo é versionada como ICS 2026/06.

## Stack

- React 19, TypeScript e React Router em modo hash.
- Vite e CSS responsivo.
- D3 Scale para a timeline e D3 Hierarchy para o layout determinístico da árvore.
- Framer Motion apenas para transições de contexto.
- Zod, tsx e Sharp no pipeline editorial local.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Principais gates:

```bash
npm run content:validate
npm run content:report
npm run content:report -- --milestone meta-72
npm run content:report -- --check-links # relatório editorial opcional; não bloqueia o build
npm run lint
npm run type-check
npm run test
npm run test:e2e
npm run build
```

O navegador não consulta APIs durante o uso normal. A curadoria usa `content:import` (todos os organismos ou IDs após `--`), as mídias aprovadas são processadas por `content:media` e `content:build` gera os índices estáticos consumidos pelo app.

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
│   ├── estudo/
│   ├── humanidade/
│   ├── linha-do-tempo/
│   └── publicacoes/
├── hooks/
└── styles/
scripts/content/                 # importação, mídia, validação, build e relatório
public/media/                    # variantes locais e miniaturas
```

## Conteúdo e licenças

Cada ficha aprovada liga suas alegações a fontes e possui evidência material ou observável, uma interpretação identificada ou segunda evidência científica e ao menos um recurso de escala, mapa, habitat ou morfologia. As mídias aceitas usam CC0, domínio público, CC BY ou CC BY-SA; autoria, página original, licença, acesso, alterações, legenda e texto alternativo ficam registrados em `src/content/data/media.json`.

Anotações de estudo ficam apenas no IndexedDB `dinopad-study` do navegador. Elas podem ser exportadas em JSON; limpar os dados do site ou usar navegação privada pode removê-las.

## Publicação

O workflow do GitHub Pages usa `npm ci`, valida o conteúdo e gera o build estático. O `base` público acompanha o repositório `mafhper/dinopad`, com endereço esperado em `https://mafhper.github.io/dinopad/`. Commit, push e publicação exigem que os metadados Git do projeto estejam disponíveis.

## Dedicação

Projeto pessoal e afetivo para a Maria Sofia e todas as crianças curiosas sobre a vida na Terra.
