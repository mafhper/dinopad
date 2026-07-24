import { z } from 'zod';

const Id = z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const Texto = z.string().trim().min(2);
const FonteIds = z.array(Id).min(1);

export const CategoriaEditorialSchema = z.object({
  id: Id,
  nomePt: Texto,
  nomeEn: Texto,
  reino: z.enum(['animalia', 'plantae']),
  descricao: Texto,
});

export const EraSchema = z.object({
  id: Id,
  nomeCientifico: Texto,
  nomePt: Texto,
  nomeEn: Texto,
  inicioMa: z.number().nonnegative(),
  fimMa: z.number().nonnegative(),
  descricaoCurta: Texto,
  corTema: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const PeriodoSchema = z.object({
  id: Id,
  eraId: Id,
  nomeCientifico: Texto,
  nomePt: Texto,
  nomeEn: Texto,
  inicioMa: z.number().nonnegative(),
  fimMa: z.number().nonnegative(),
  subdivisao: z.string().optional(),
  descricaoCurta: Texto,
});

export const NoFilogeneticoSchema = z.object({
  id: Id,
  nomeCientifico: Texto,
  nomePt: Texto,
  nomeEn: Texto,
  nivelTaxonomico: z.enum(['dominio', 'reino', 'subreino', 'filo', 'classe', 'ordem', 'clado', 'familia', 'genero', 'incertae-sedis']),
  paiId: Id.nullable(),
  ordemVisual: z.number().int().nonnegative(),
  caracteristicasCompartilhadas: z.array(Texto).min(1),
  certeza: z.enum(['estabelecida', 'provavel', 'em-debate']),
  notaEditorial: z.string().optional(),
  fonteIds: FonteIds,
});

export const FonteCientificaSchema = z.object({
  id: Id,
  titulo: Texto,
  instituicao: Texto,
  nivel: z.enum(['A', 'B', 'C']),
  tipo: z.enum(['artigo', 'base-dados', 'museu', 'escala-geologica', 'midia', 'direitos']),
  camposSustentados: z.array(z.enum([
    'taxonomia',
    'intervalo',
    'ocorrencias',
    'energia',
    'dimensoes',
    'comportamento',
    'filogenia',
    'morfologia',
    'especime',
    'marco',
    'midia',
    'genetica',
    'conceito',
    'publicacao',
    'direitos',
  ])).min(1),
  url: z.string().url(),
  doi: z.string().optional(),
  acessadoEm: z.string().date(),
  observacao: z.string().optional(),
});

export const IntervaloTemporalSchema = z.object({
  inicioMa: z.number().nonnegative(),
  fimMa: z.number().nonnegative(),
  incerteza: z.enum(['baixa', 'media', 'alta']),
  significado: Texto,
  fonteIds: FonteIds,
});

const FaixaSchema = z.object({ min: z.number().nonnegative(), max: z.number().nonnegative() });

const MedidaSchema = FaixaSchema.extend({
  tipo: z.enum(['comprimento', 'altura', 'envergadura', 'massa', 'diametro', 'folha', 'cone', 'flor', 'caule', 'estrutura']),
  unidade: z.enum(['mm', 'cm', 'm', 'kg', 't', 'unid']),
  rotuloPt: Texto,
});

const OcorrenciaResumoSchema = z.object({
  formacao: Texto,
  regiao: Texto,
  pais: Texto,
  pbdbId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  paleolatitude: z.number().min(-90).max(90).optional(),
  paleolongitude: z.number().min(-180).max(180).optional(),
});

const RelacaoSchema = z.object({
  organismoId: Id,
  tipo: z.enum(['contemporaneo', 'mesmo-clado', 'presa-predador', 'comparacao-temporal']),
  nivelEvidencia: z.enum(['direta', 'inferida', 'contextual']),
  nota: Texto,
  fonteIds: FonteIds,
});

export const OrganismoAtlasSchema = z.object({
  id: Id,
  nomeCientifico: Texto,
  autoridadeTaxonomica: Texto,
  nomePt: Texto,
  nomeEn: Texto,
  aliases: z.array(z.string()).default([]),
  significadoNome: Texto,
  reino: z.enum(['animalia', 'plantae']),
  categoriaIds: z.array(Id).min(1),
  periodoIds: z.array(Id).min(1),
  noFilogeneticoId: Id,
  energia: z.object({
    modoPrincipal: z.enum(['carnivoria', 'herbivoria', 'onivoria', 'fotossintese', 'frugivoria', 'folivoria', 'insetivoria', 'desconhecida']),
    modosSecundarios: z.array(z.enum(['carnivoria', 'herbivoria', 'onivoria', 'fotossintese', 'frugivoria', 'folivoria', 'insetivoria', 'desconhecida'])).default([]),
    incerteza: z.enum(['baixa', 'media', 'alta']),
    fonteIds: FonteIds,
  }),
  intervalo: IntervaloTemporalSchema,
  medidas: z.object({
    itens: z.array(MedidaSchema).min(1),
    observacao: Texto,
    fonteIds: FonteIds,
  }),
  ocorrencias: z.array(OcorrenciaResumoSchema).min(1),
  resumo: Texto,
  descricao: Texto,
  memoria: Texto,
  nivelEvidencia: z.enum(['bem-estabelecido', 'interpretado', 'em-debate']),
  fonteIds: FonteIds,
  mediaIds: z.array(Id).min(3),
  mediaPrincipalId: Id,
  especimeIds: z.array(Id).default([]),
  relacoes: z.array(RelacaoSchema).default([]),
  revisao: z.object({
    status: z.enum(['rascunho', 'em-revisao', 'aprovado']),
    revisadoEm: z.string().date(),
    observacoes: z.string().optional(),
  }),
});

export const MediaAssetSchema = z.object({
  id: Id,
  entidade: z.object({
    tipo: z.enum(['organismo', 'especime', 'linhagem', 'dossie', 'publicacao']),
    id: Id,
  }),
  papel: z.enum(['evidencia', 'interpretacao', 'escala', 'mapa', 'habitat', 'morfologia']),
  representacao: z.enum(['evidencia', 'interpretacao', 'diagrama']),
  titulo: Texto,
  autor: Texto,
  fonte: Texto,
  urlFonte: z.string().url(),
  licenca: z.enum(['CC0', 'PDM', 'CC-BY-2.0', 'CC-BY-3.0', 'CC-BY-4.0', 'CC-BY-SA-2.0', 'CC-BY-SA-3.0', 'CC-BY-SA-4.0', 'MIT']),
  urlLicenca: z.string().url(),
  acessadoEm: z.string().date(),
  arquivos: z.object({
    src: Texto,
    srcSet: z.string().optional(),
    avifSrcSet: z.string().optional(),
    miniaturaSrcSet: z.string().optional(),
  }),
  altPt: Texto,
  legendaPt: Texto,
  alteracoes: Texto,
});

export const EspecimeFossilSchema = z.object({
  id: Id,
  organismoId: Id.optional(),
  linhagemId: Id.optional(),
  apelido: Texto,
  numeroCatalogo: Texto,
  tipo: z.enum(['holotipo', 'especime-referencia', 'especime-notavel']),
  anoDescoberta: z.number().int().min(1800).max(2100).nullable(),
  descobridor: Texto,
  formacao: Texto,
  local: Texto,
  museuAtual: Texto,
  resumo: Texto,
  mediaIds: z.array(Id).min(1),
  fonteIds: FonteIds,
  revisao: z.object({ status: z.literal('aprovado'), revisadoEm: z.string().date() }),
}).refine((value) => Number(Boolean(value.organismoId)) + Number(Boolean(value.linhagemId)) === 1, {
  message: 'O espécime deve pertencer a um organismo ou a uma linhagem, nunca aos dois.',
});

export const MarcoTemporalSchema = z.object({
  id: Id,
  titulo: Texto,
  dataMa: z.number().nonnegative(),
  fimMa: z.number().nonnegative().optional(),
  periodoId: Id.nullable(),
  categoria: z.enum(['vida', 'evolucao', 'extincao', 'geologia', 'humanidade']),
  incerteza: z.enum(['baixa', 'media', 'alta']),
  descricaoCurta: Texto,
  fonteIds: FonteIds,
  revisao: z.object({ status: z.literal('aprovado'), revisadoEm: z.string().date() }),
});

const RevisaoAprovavelSchema = z.object({
  status: z.enum(['rascunho', 'em-revisao', 'aprovado']),
  revisadoEm: z.string().date(),
  observacoes: z.string().optional(),
});

export const LinhagemGeneticaSchema = z.object({
  id: Id,
  nomePt: Texto,
  nomeEn: Texto,
  nomeCientifico: z.string().optional(),
  tipo: z.enum(['populacao-arcaica', 'linhagem-genomica', 'haplogrupo']),
  resumo: Texto,
  intervalo: IntervaloTemporalSchema.optional(),
  organismoIds: z.array(Id).default([]),
  noFilogeneticoIds: z.array(Id).default([]),
  fonteIds: FonteIds,
  revisao: RevisaoAprovavelSchema,
});

export const ConexaoEvolutivaSchema = z.object({
  id: Id,
  origemId: Id,
  destinoId: Id,
  tipo: z.enum(['fluxo-genico', 'ancestralidade-compartilhada']),
  certeza: z.enum(['estabelecida', 'provavel', 'em-debate']),
  resumo: Texto,
  fonteIds: FonteIds,
});

export const BlocoEditorialSchema = z.object({
  id: Id,
  tipo: z.enum(['titulo', 'paragrafo', 'lista', 'destaque', 'citacao', 'pergunta', 'glossario']),
  titulo: z.string().optional(),
  texto: z.string().optional(),
  itens: z.array(Texto).optional(),
});

export const DossieConceitualSchema = z.object({
  id: Id,
  slug: Id,
  titulo: Texto,
  resumo: Texto,
  blocos: z.array(BlocoEditorialSchema).min(2),
  organismoIds: z.array(Id).default([]),
  linhagemIds: z.array(Id).default([]),
  fonteIds: FonteIds,
  revisao: RevisaoAprovavelSchema,
});

export const PublicacaoSchema = z.object({
  id: Id,
  slug: Id,
  titulo: Texto,
  subtitulo: z.string().optional(),
  modo: z.enum(['sintese-dinopad', 'traducao-autorizada', 'leitura-guiada']),
  traducaoIntegral: z.boolean().default(false),
  autores: z.array(Texto).min(1),
  tradutor: z.string().optional(),
  idiomaOriginal: Texto,
  minutosLeitura: z.number().int().positive(),
  fonteOriginal: z.object({
    titulo: Texto,
    url: z.string().url(),
    doi: z.string().optional(),
    licenca: Texto,
    urlLicenca: z.string().url().optional(),
    permiteTraducaoIntegral: z.boolean(),
  }),
  notaEditorial: Texto,
  camadaEssencial: z.array(BlocoEditorialSchema).min(2),
  camadaAprofundar: z.array(BlocoEditorialSchema).min(2),
  organismoIds: z.array(Id).default([]),
  linhagemIds: z.array(Id).default([]),
  dossieIds: z.array(Id).default([]),
  fonteIds: FonteIds,
  revisao: RevisaoAprovavelSchema,
});

export const TextQuoteSelectorSchema = z.object({
  exact: Texto,
  prefix: z.string(),
  suffix: z.string(),
});

export const AnotacaoLeituraSchema = z.object({
  id: Id,
  publicacaoId: Id,
  versaoConteudo: Texto,
  blockId: Id,
  seletor: TextQuoteSelectorSchema,
  nota: z.string().default(''),
  status: z.enum(['ancorada', 'revisar']),
  criadaEm: z.string().datetime(),
  atualizadaEm: z.string().datetime(),
});

export const CatalogoSchema = z.object({
  versaoEscalaGeologica: Texto,
  eras: z.array(EraSchema),
  periodos: z.array(PeriodoSchema),
  categorias: z.array(CategoriaEditorialSchema),
  nosFilogeneticos: z.array(NoFilogeneticoSchema),
  fontes: z.array(FonteCientificaSchema),
  organismos: z.array(OrganismoAtlasSchema),
  media: z.array(MediaAssetSchema),
  especimes: z.array(EspecimeFossilSchema),
  marcos: z.array(MarcoTemporalSchema),
  linhagens: z.array(LinhagemGeneticaSchema),
  conexoesEvolutivas: z.array(ConexaoEvolutivaSchema),
  dossies: z.array(DossieConceitualSchema),
  publicacoes: z.array(PublicacaoSchema),
});

export type CategoriaEditorial = z.infer<typeof CategoriaEditorialSchema>;
export type Era = z.infer<typeof EraSchema>;
export type Periodo = z.infer<typeof PeriodoSchema>;
export type NoFilogenetico = z.infer<typeof NoFilogeneticoSchema>;
export type FonteCientifica = z.infer<typeof FonteCientificaSchema>;
export type IntervaloTemporal = z.infer<typeof IntervaloTemporalSchema>;
export type OrganismoAtlas = z.infer<typeof OrganismoAtlasSchema>;
export type MediaAsset = z.infer<typeof MediaAssetSchema>;
export type EspecimeFossil = z.infer<typeof EspecimeFossilSchema>;
export type MarcoTemporal = z.infer<typeof MarcoTemporalSchema>;
export type LinhagemGenetica = z.infer<typeof LinhagemGeneticaSchema>;
export type ConexaoEvolutiva = z.infer<typeof ConexaoEvolutivaSchema>;
export type BlocoEditorial = z.infer<typeof BlocoEditorialSchema>;
export type DossieConceitual = z.infer<typeof DossieConceitualSchema>;
export type Publicacao = z.infer<typeof PublicacaoSchema>;
export type TextQuoteSelector = z.infer<typeof TextQuoteSelectorSchema>;
export type AnotacaoLeitura = z.infer<typeof AnotacaoLeituraSchema>;
export type Catalogo = z.infer<typeof CatalogoSchema>;
export type Reino = OrganismoAtlas['reino'];
export type Energia = OrganismoAtlas['energia']['modoPrincipal'];
export type TipoMedida = OrganismoAtlas['medidas']['itens'][number]['tipo'];
export type PapelMedia = MediaAsset['papel'];
