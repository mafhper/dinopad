import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadCatalog, repoRoot } from './io';

const catalogo = loadCatalog();
const aprovados = catalogo.organismos.filter(({ revisao }) => revisao.status === 'aprovado');
const organismoIds = new Set(aprovados.map(({ id }) => id));
const linhagemIds = new Set(catalogo.linhagens.filter(({ revisao }) => revisao.status === 'aprovado').map(({ id }) => id));
const dossieIds = new Set(catalogo.dossies.filter(({ revisao }) => revisao.status === 'aprovado').map(({ id }) => id));
const publicacaoIds = new Set(catalogo.publicacoes.filter(({ revisao }) => revisao.status === 'aprovado').map(({ id }) => id));
const especimesAprovados = catalogo.especimes.filter((especime) => especime.revisao.status === 'aprovado'
  && ((especime.organismoId && organismoIds.has(especime.organismoId))
    || (especime.linhagemId && linhagemIds.has(especime.linhagemId))));
const especimeIds = new Set(especimesAprovados.map(({ id }) => id));
const mediaIds = new Set(catalogo.media.filter(({ entidade }) => ({
  organismo: organismoIds,
  especime: especimeIds,
  linhagem: linhagemIds,
  dossie: dossieIds,
  publicacao: publicacaoIds,
}[entidade.tipo].has(entidade.id))).map(({ id }) => id));

function normalizarBusca(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const periodoPorId = new Map(catalogo.periodos.map((periodo) => [periodo.id, periodo]));
const indiceBusca = aprovados.map((organismo) => {
  const colecaoTaxonomica = organismo.reino === 'plantae'
    ? 'flora planta fossil fotossintese'
    : !organismo.categoriaIds.some((id) => ['dinossauro', 'ave-primitiva'].includes(id))
      ? 'fauna nao e dinossauro'
      : 'fauna dinossauro';
  const campos = [
    organismo.nomePt,
    organismo.nomeCientifico,
    organismo.nomeEn,
    organismo.significadoNome,
    organismo.energia.modoPrincipal,
    ...organismo.energia.modosSecundarios,
    organismo.resumo,
    organismo.descricao,
    colecaoTaxonomica,
    ...organismo.aliases,
    ...organismo.periodoIds.map((id) => periodoPorId.get(id)?.nomePt ?? ''),
    ...organismo.ocorrencias.flatMap(({ pais, regiao, formacao }) => [pais, regiao, formacao]),
  ];
  return { id: organismo.id, texto: normalizarBusca(campos.join(' ')) };
});
const indiceBuscaEditorial = [
  ...catalogo.publicacoes.filter(({ revisao }) => revisao.status === 'aprovado').map((publicacao) => ({
    id: publicacao.id,
    tipo: 'publicacao' as const,
    slug: publicacao.slug,
    titulo: publicacao.titulo,
    texto: normalizarBusca([
      publicacao.titulo,
      publicacao.subtitulo ?? '',
      publicacao.autores.join(' '),
      ...publicacao.camadaEssencial.flatMap((bloco) => [bloco.titulo ?? '', bloco.texto ?? '', ...(bloco.itens ?? [])]),
    ].join(' ')),
  })),
  ...catalogo.dossies.filter(({ revisao }) => revisao.status === 'aprovado').map((dossie) => ({
    id: dossie.id,
    tipo: 'dossie' as const,
    slug: dossie.slug,
    titulo: dossie.titulo,
    texto: normalizarBusca([dossie.titulo, dossie.resumo, ...dossie.blocos.flatMap((bloco) => [bloco.titulo ?? '', bloco.texto ?? '', ...(bloco.itens ?? [])])].join(' ')),
  })),
];

const noPorId = new Map(catalogo.nosFilogeneticos.map((no) => [no.id, no]));
const filhosPorNo = new Map<string, string[]>();
for (const no of catalogo.nosFilogeneticos) {
  if (!no.paiId) continue;
  filhosPorNo.set(no.paiId, [...(filhosPorNo.get(no.paiId) ?? []), no.id]);
}
for (const filhos of filhosPorNo.values()) {
  filhos.sort((a, b) => (noPorId.get(a)?.ordemVisual ?? 0) - (noPorId.get(b)?.ordemVisual ?? 0));
}
const organismosPorNo = Object.fromEntries(
  catalogo.nosFilogeneticos.map((no) => [no.id, aprovados.filter(({ noFilogeneticoId }) => noFilogeneticoId === no.id).map(({ id }) => id)]),
);
const caminhoAteRaiz = (id: string) => {
  const caminho: string[] = [];
  let atual = noPorId.get(id);
  while (atual) {
    caminho.unshift(atual.id);
    atual = atual.paiId ? noPorId.get(atual.paiId) : undefined;
  }
  return caminho;
};
const descendentesComFolhas = (id: string): string[] => [
  ...(organismosPorNo[id] ?? []),
  ...(filhosPorNo.get(id) ?? []).flatMap(descendentesComFolhas),
];
const indiceFilogenia = {
  raizId: catalogo.nosFilogeneticos.find(({ paiId }) => paiId === null)?.id ?? 'eukaryota',
  organismosPorNo,
  nos: catalogo.nosFilogeneticos.map((no) => ({
    id: no.id,
    paiId: no.paiId,
    filhoIds: filhosPorNo.get(no.id) ?? [],
    organismoIds: organismosPorNo[no.id] ?? [],
    descendenteIds: descendentesComFolhas(no.id),
    caminhoRaiz: caminhoAteRaiz(no.id),
  })),
  folhas: aprovados.map((organismo) => ({
    organismoId: organismo.id,
    noId: organismo.noFilogeneticoId,
    caminhoRaiz: [...caminhoAteRaiz(organismo.noFilogeneticoId), organismo.id],
  })),
};
const organismosPorPeriodo = Object.fromEntries(
  catalogo.periodos.map((periodo) => [periodo.id, aprovados.filter(({ periodoIds }) => periodoIds.includes(periodo.id)).map(({ id }) => id)]),
);
const indiceComparacao = aprovados.map(({ id, intervalo }) => ({
  id,
  inicioMa: intervalo.inicioMa,
  fimMa: intervalo.fimMa,
  pontoMedioMa: (intervalo.inicioMa + intervalo.fimMa) / 2,
}));
const timelineOrganismoIds = [...aprovados]
  .sort((a, b) => b.intervalo.inicioMa - a.intervalo.inicioMa)
  .map(({ id }) => id);
const timelineMarcoIds = [...catalogo.marcos]
  .sort((a, b) => b.dataMa - a.dataMa)
  .map(({ id }) => id);
const humanityOrganismIds = aprovados
  .filter(({ categoriaIds }) => categoriaIds.some((id) => ['primata', 'hominideo', 'homininio'].includes(id)))
  .map(({ id }) => id);
const humanitySpecimenIds = catalogo.especimes
  .filter((specimen) => (specimen.organismoId && humanityOrganismIds.includes(specimen.organismoId)) || Boolean(specimen.linhagemId))
  .map(({ id }) => id);

const source = `/* Arquivo gerado por npm run content:build. Não editar manualmente. */
import type { Catalogo } from './schema';
import eras from './data/eras.json';
import periodos from './data/periodos.json';
import categorias from './data/categorias.json';
import nosFilogeneticos from './data/filogenia.json';
import fontes from './data/fontes.json';
import organismos from './data/organismos.json';
import media from './data/media.json';
import especimes from './data/especimes.json';
import marcos from './data/marcos.json';
import linhagens from './data/linhagens.json';
import conexoesEvolutivas from './data/conexoes-evolutivas.json';
import dossies from './data/dossies.json';
import publicacoes from './data/publicacoes.json';

const organismoIds = new Set(${JSON.stringify([...organismoIds])});
const mediaIds = new Set(${JSON.stringify([...mediaIds])});
const especimeIds = new Set(${JSON.stringify([...especimeIds])});

export const catalogo = {
  versaoEscalaGeologica: ${JSON.stringify(catalogo.versaoEscalaGeologica)},
  eras,
  periodos,
  categorias,
  nosFilogeneticos,
  fontes,
  organismos: organismos.filter((item) => organismoIds.has(item.id)),
  media: media.filter((item) => mediaIds.has(item.id)),
  especimes: especimes.filter((item) => especimeIds.has(item.id)),
  marcos,
  linhagens,
  conexoesEvolutivas,
  dossies,
  publicacoes,
} as unknown as Catalogo;

export const indicesConteudo = ${JSON.stringify({
  busca: indiceBusca,
  buscaEditorial: indiceBuscaEditorial,
  filogenia: indiceFilogenia,
  atlas: { organismosPorPeriodo },
  comparacao: indiceComparacao,
  timeline: { organismoIds: timelineOrganismoIds, marcoIds: timelineMarcoIds },
  humanidade: {
    organismoIds: humanityOrganismIds,
    especimeIds: humanitySpecimenIds,
    linhagemIds: catalogo.linhagens.map(({ id }) => id),
    dossieIds: catalogo.dossies.map(({ id }) => id),
  },
  biblioteca: {
    publicacaoIds: catalogo.publicacoes.map(({ id }) => id),
    porModo: Object.fromEntries(['sintese-dinopad', 'traducao-autorizada', 'leitura-guiada'].map((modo) => [modo, catalogo.publicacoes.filter((item) => item.modo === modo).map(({ id }) => id)])),
  },
}, null, 2)} as const;
`;

writeFileSync(resolve(repoRoot, 'src/content/catalog.generated.ts'), source, 'utf8');
console.log(`Índice gerado com ${aprovados.length} fichas aprovadas.`);
