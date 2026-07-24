# Conteúdo editorial do Dinopad

`schema.ts` é a fonte de verdade Zod. Os registros normalizados ficam em `data/` e
fontes, mídias e relações são centralizadas por ID. `catalog.generated.ts` é criado
por `npm run content:build` e contém apenas fichas com revisão `aprovado`.

Fluxo de curadoria:

1. `npm run content:import` salva taxonomia e ocorrências PBDB dos organismos selecionados,
   além da referência ICS, em `.dev/content-imports`; passe IDs após `--` para limitar a busca.
2. O editor revisa alegações e referências nos JSONs normalizados.
3. `npm run content:media` baixa mídias licenciadas e cria variantes, AVIF/WebP e miniaturas locais.
4. `npm run content:validate` bloqueia relações quebradas, licenças não permitidas,
   URLs remotas e fichas sem evidência, interpretação e um complemento visual
   de escala, mapa, habitat ou morfologia.
5. `npm run content:build` gera índices para atlas, busca, comparação, timeline,
   filogenia, Humanidade e Biblioteca.
6. `npm run content:report` salva a cobertura científica e visual em `.dev/content-health`.
   `npm run content:report -- --milestone meta-72` verifica os 72 IDs e os mínimos
   históricos sem transformar o esquema permanente em uma enumeração fechada.

A faixa PBDB é sempre descrita como intervalo conhecido no registro fóssil. Ela não
é apresentada como duração exata de uma espécie.

Os nós filogenéticos têm fonte, certeza e características compartilhadas. Galhos
não representam tempo nem espécies ancestrais diretas; relações incertas usam
polytomia ou codificação tracejada além da cor.
