import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  BlocoEditorial,
  ConexaoEvolutiva,
  DossieConceitual,
  EspecimeFossil,
  FonteCientifica,
  LinhagemGenetica,
  MediaAsset,
  OrganismoAtlas,
  Publicacao,
} from '../../src/content/schema';
import { frontiersTranslations } from './frontiers-translations';
import { dataDir, repoRoot } from './io';

const reviewedAt = '2026-07-24';

function read<T>(name: string): T[] {
  return JSON.parse(readFileSync(resolve(dataDir, name), 'utf8')) as T[];
}

function write<T>(name: string, value: T[]) {
  writeFileSync(resolve(dataDir, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function upsert<T extends { id: string }>(items: T[], additions: T[]): T[] {
  const additionsById = new Map(additions.map((item) => [item.id, item]));
  return [
    ...items.map((item) => additionsById.get(item.id) ?? item),
    ...additions.filter((item) => !items.some(({ id }) => id === item.id)),
  ];
}

const scientificFields: FonteCientifica['camposSustentados'] = [
  'taxonomia',
  'intervalo',
  'ocorrencias',
  'dimensoes',
  'filogenia',
  'morfologia',
  'especime',
  'conceito',
  'publicacao',
];

const sources: FonteCientifica[] = [
  {
    id: 'smithsonian-human-fossils',
    titulo: 'Human Fossils',
    instituicao: 'Smithsonian Human Origins Program',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['especime', 'morfologia', 'conceito', 'publicacao'],
    url: 'https://humanorigins.si.edu/evidence/human-fossils',
    acessadoEm: reviewedAt,
  },
  {
    id: 'toumai-2002',
    titulo: 'A new hominid from the Upper Miocene of Chad, Central Africa',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.1038/nature00879',
    doi: '10.1038/nature00879',
    acessadoEm: reviewedAt,
  },
  {
    id: 'ardi-2009',
    titulo: 'Ardipithecus ramidus and the paleobiology of early hominids',
    instituicao: 'Science',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.1126/science.1175802',
    doi: '10.1126/science.1175802',
    acessadoEm: reviewedAt,
  },
  {
    id: 'lucy-1976',
    titulo: 'Plio-Pleistocene hominid discoveries in Hadar, Ethiopia',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.1038/260293a0',
    doi: '10.1038/260293a0',
    acessadoEm: reviewedAt,
  },
  {
    id: 'taung-1925',
    titulo: 'Australopithecus africanus: the man-ape of South Africa',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.1038/115195a0',
    doi: '10.1038/115195a0',
    acessadoEm: reviewedAt,
  },
  {
    id: 'little-foot-wits',
    titulo: 'Little Foot hominin skeleton',
    instituicao: 'University of the Witwatersrand',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['especime', 'morfologia', 'conceito', 'publicacao'],
    url: 'https://www.wits.ac.za/news/latest-news/research-news/2018/2018-12/little-foot.html',
    acessadoEm: reviewedAt,
  },
  {
    id: 'oh7-1964',
    titulo: 'A new species of the genus Homo from Olduvai Gorge',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.1038/202007a0',
    doi: '10.1038/202007a0',
    acessadoEm: reviewedAt,
  },
  {
    id: 'smithsonian-turkana-boy',
    titulo: 'KNM-WT 15000 — Turkana Boy',
    instituicao: 'Smithsonian Human Origins Program',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['especime', 'morfologia', 'dimensoes', 'conceito', 'publicacao'],
    url: 'https://humanorigins.si.edu/evidence/human-fossils/fossils/knm-wt-15000',
    acessadoEm: reviewedAt,
  },
  {
    id: 'dmanisi-5-2013',
    titulo: 'A complete skull from Dmanisi, Georgia, and the evolutionary biology of early Homo',
    instituicao: 'Science',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.1126/science.1238484',
    doi: '10.1126/science.1238484',
    acessadoEm: reviewedAt,
  },
  {
    id: 'neanderthal-1-smithsonian',
    titulo: 'Neanderthal 1',
    instituicao: 'Smithsonian Human Origins Program',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['especime', 'morfologia', 'conceito', 'publicacao'],
    url: 'https://humanorigins.si.edu/evidence/human-fossils/fossils/neanderthal-1',
    acessadoEm: reviewedAt,
  },
  {
    id: 'green-neanderthal-2010',
    titulo: 'A draft sequence of the Neandertal genome',
    instituicao: 'Science',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: ['genetica', 'filogenia', 'conceito', 'publicacao', 'especime'],
    url: 'https://doi.org/10.1126/science.1188021',
    doi: '10.1126/science.1188021',
    acessadoEm: reviewedAt,
  },
  {
    id: 'reich-denisovan-2010',
    titulo: 'Genetic history of an archaic hominin group from Denisova Cave in Siberia',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: ['genetica', 'filogenia', 'conceito', 'publicacao', 'especime'],
    url: 'https://doi.org/10.1038/nature09710',
    doi: '10.1038/nature09710',
    acessadoEm: reviewedAt,
  },
  {
    id: 'lb1-2004',
    titulo: 'A new small-bodied hominin from the Late Pleistocene of Flores, Indonesia',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.1038/nature02999',
    doi: '10.1038/nature02999',
    acessadoEm: reviewedAt,
  },
  {
    id: 'berger-naledi-2015',
    titulo: 'Homo naledi, a new species of the genus Homo from the Dinaledi Chamber, South Africa',
    instituicao: 'eLife',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: scientificFields,
    url: 'https://doi.org/10.7554/eLife.09560',
    doi: '10.7554/eLife.09560',
    acessadoEm: reviewedAt,
    observacao: 'Artigo CC BY; figuras exigem verificação individual de créditos antes de reprodução.',
  },
  {
    id: 'naledi-dating-2017',
    titulo: 'Homo naledi and Pleistocene hominin evolution in subequatorial Africa',
    instituicao: 'eLife',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: ['intervalo', 'ocorrencias', 'morfologia', 'conceito', 'publicacao'],
    url: 'https://doi.org/10.7554/eLife.24234',
    doi: '10.7554/eLife.24234',
    acessadoEm: reviewedAt,
    observacao: 'Sustenta a datação de Homo naledi entre aproximadamente 236 e 335 mil anos.',
  },
  {
    id: 'cann-mtdna-1987',
    titulo: 'Mitochondrial DNA and human evolution',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: ['genetica', 'conceito', 'publicacao'],
    url: 'https://doi.org/10.1038/325031a0',
    doi: '10.1038/325031a0',
    acessadoEm: reviewedAt,
  },
  {
    id: 'poznik-y-2013',
    titulo: 'Sequencing Y chromosomes resolves discrepancy in time to common ancestor of males versus females',
    instituicao: 'Science',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: ['genetica', 'conceito', 'publicacao'],
    url: 'https://doi.org/10.1126/science.1237619',
    doi: '10.1126/science.1237619',
    acessadoEm: reviewedAt,
  },
  {
    id: 'frontiers-adna-2019',
    titulo: 'The Revolution of Ancient DNA—What Does Genetics Tell Us About the Past?',
    instituicao: 'Frontiers for Young Minds',
    nivel: 'B',
    tipo: 'artigo',
    camposSustentados: ['genetica', 'conceito', 'publicacao', 'direitos'],
    url: 'https://kids.frontiersin.org/articles/10.3389/frym.2019.00024',
    doi: '10.3389/frym.2019.00024',
    acessadoEm: reviewedAt,
  },
  {
    id: 'frontiers-neanderthal-2019',
    titulo: 'Why Do Some Humans Have Neanderthal DNA?',
    instituicao: 'Frontiers for Young Minds',
    nivel: 'B',
    tipo: 'artigo',
    camposSustentados: ['genetica', 'conceito', 'publicacao', 'direitos'],
    url: 'https://kids.frontiersin.org/articles/10.3389/frym.2019.00104',
    doi: '10.3389/frym.2019.00104',
    acessadoEm: reviewedAt,
  },
  {
    id: 'frontiers-dna-history-2020',
    titulo: 'What Our DNA Can Tell Us About the History of Humans',
    instituicao: 'Frontiers for Young Minds',
    nivel: 'B',
    tipo: 'artigo',
    camposSustentados: ['genetica', 'conceito', 'publicacao', 'direitos'],
    url: 'https://kids.frontiersin.org/articles/10.3389/frym.2020.00106',
    doi: '10.3389/frym.2020.00106',
    acessadoEm: reviewedAt,
  },
];

const lineages: LinhagemGenetica[] = [
  {
    id: 'denisovanos',
    nomePt: 'Denisovanos',
    nomeEn: 'Denisovans',
    tipo: 'populacao-arcaica',
    resumo: 'Populações humanas arcaicas reconhecidas primeiro pelo DNA. Ainda não há base suficiente para tratá-las como uma espécie aprovada no atlas.',
    intervalo: {
      inicioMa: 0.2,
      fimMa: 0.04,
      incerteza: 'alta',
      significado: 'Janela ampla de evidências genéticas e fósseis atribuídas a populações denisovanas; não é a duração exata de uma espécie.',
      fonteIds: ['reich-denisovan-2010'],
    },
    organismoIds: ['homo-sapiens', 'homo-neanderthalensis'],
    noFilogeneticoIds: ['homo'],
    fonteIds: ['reich-denisovan-2010'],
    revisao: { status: 'aprovado', revisadoEm: reviewedAt },
  },
  {
    id: 'ancestral-mitocondrial-comum',
    nomePt: 'Ancestral matrilinear comum mais recente',
    nomeEn: 'Mitochondrial most recent common ancestor',
    tipo: 'linhagem-genomica',
    resumo: 'Ponto de coalescência das linhagens de DNA mitocondrial atuais. Não foi a primeira mulher, a única mulher de seu tempo nem uma folha da árvore de espécies.',
    organismoIds: ['homo-sapiens'],
    noFilogeneticoIds: ['homo'],
    fonteIds: ['cann-mtdna-1987'],
    revisao: { status: 'aprovado', revisadoEm: reviewedAt },
  },
  {
    id: 'ancestral-y-comum',
    nomePt: 'Ancestral patrilinear comum mais recente do cromossomo Y',
    nomeEn: 'Y-chromosomal most recent common ancestor',
    tipo: 'linhagem-genomica',
    resumo: 'Ponto de coalescência das linhagens atuais do cromossomo Y. Viveu em uma população com muitas outras pessoas e não precisa ser contemporâneo do ancestral mitocondrial comum.',
    organismoIds: ['homo-sapiens'],
    noFilogeneticoIds: ['homo'],
    fonteIds: ['poznik-y-2013'],
    revisao: { status: 'aprovado', revisadoEm: reviewedAt },
  },
];

const connections: ConexaoEvolutiva[] = [
  {
    id: 'neandertal-sapiens-fluxo-genico',
    origemId: 'homo-neanderthalensis',
    destinoId: 'homo-sapiens',
    tipo: 'fluxo-genico',
    certeza: 'estabelecida',
    resumo: 'Genomas mostram introgressão neandertal em ancestrais de populações humanas modernas.',
    fonteIds: ['green-neanderthal-2010'],
  },
  {
    id: 'denisovano-sapiens-fluxo-genico',
    origemId: 'denisovanos',
    destinoId: 'homo-sapiens',
    tipo: 'fluxo-genico',
    certeza: 'estabelecida',
    resumo: 'Segmentos denisovanos persistem em proporções diferentes entre populações humanas atuais.',
    fonteIds: ['reich-denisovan-2010'],
  },
  {
    id: 'neandertal-denisovano-fluxo-genico',
    origemId: 'homo-neanderthalensis',
    destinoId: 'denisovanos',
    tipo: 'fluxo-genico',
    certeza: 'estabelecida',
    resumo: 'DNA antigo registra encontros entre populações neandertais e denisovanas.',
    fonteIds: ['reich-denisovan-2010'],
  },
];

const block = (id: string, titulo: string, texto: string, tipo: BlocoEditorial['tipo'] = 'paragrafo'): BlocoEditorial => ({
  id,
  tipo,
  ...(titulo ? { titulo } : {}),
  texto,
});

const dossierDefinitions = [
  ['termos-familia-humana', 'Hominídeo, hominíneo, hominínio e humano', 'Palavras parecidas apontam para ramos diferentes.', 'Hominídeo inclui os grandes símios e seus parentes. Hominíneo é um ramo interno; hominínio reúne humanos e fósseis mais próximos de nós do que de chimpanzés.', 'Os nomes indicam inclusão em grupos, não graus de inteligência ou progresso.'],
  ['arvore-nao-escada', 'Árvore, não escada evolutiva', 'Evolução produz ramificações, não uma fila rumo ao presente.', 'Espécies podem coexistir, extinguir-se ou deixar descendentes. Um fóssil semelhante a nós não precisa ser nosso ancestral direto.', 'Na árvore do Dinopad, galhos tracejados e polytomias mostram relações incertas sem esconder o debate.'],
  ['eva-mitocondrial', '“Eva mitocondrial”: significado e limites', 'Um apelido para um resultado genealógico, não para a primeira mulher.', 'Ao seguir apenas o DNA mitocondrial atual para trás, as linhagens convergem em uma ancestral comum. Outras mulheres viveram no mesmo tempo e também podem ser ancestrais genealógicas nossas.', 'Genes diferentes têm histórias diferentes. Não existe uma única “Eva evolutiva” que concentre toda a origem humana.'],
  ['ancestral-y', 'Ancestral patrilinear do cromossomo Y', 'O cromossomo Y também permite seguir uma linha específica de herança.', 'As linhagens atuais do Y coalescem em um ancestral comum, mas a data estimada depende das amostras, modelos e mutações usadas.', 'O ancestral do Y e o ancestral mitocondrial não formam um casal fundador.'],
  ['coalescencia', 'Coalescência e genealogias diferentes', 'Cada trecho de DNA pode contar uma genealogia própria.', 'Recombinação mistura trechos herdados. Ao voltar no tempo, as cópias de um trecho coalescem em ancestrais comuns, em datas que variam de trecho para trecho.', 'Uma árvore de genes não deve ser confundida automaticamente com uma árvore de espécies.'],
  ['origem-africana-dispersoes', 'Origem africana e dispersões de Homo', 'A história humana envolve múltiplos movimentos, encontros e retornos.', 'Homo sapiens surgiu na África. Populações se dispersaram para fora do continente em ondas, enquanto movimentos de volta e encontros conectaram novamente regiões.', 'Mapas são instantâneos simplificados: fronteiras atuais não existiam na pré-história.'],
  ['neandertais-denisovanos', 'Neandertais, Denisovanos e fluxo gênico', 'Ramos distintos puderam trocar genes quando populações se encontraram.', 'Genomas antigos mostraram que a história não foi substituição total. Segmentos neandertais e denisovanos permanecem em populações atuais em frequências variadas.', 'As conexões de fluxo gênico aparecem sobre a árvore, não como novos galhos principais.'],
  ['dna-antigo-metodo', 'Recuperação e interpretação de DNA antigo', 'DNA antigo é fragmentado, raro e vulnerável à contaminação.', 'Laboratórios usam salas limpas, controles e padrões de dano molecular para distinguir sequências antigas de DNA moderno.', 'Uma sequência não fala sozinha: contexto arqueológico, datação, anatomia e modelos populacionais precisam concordar.'],
] as const;

const dossiers: DossieConceitual[] = dossierDefinitions.map(([id, titulo, resumo, body, closing]) => ({
  id,
  slug: id,
  titulo,
  resumo,
  blocos: [
    block(`${id}-abertura`, 'Ideia central', body, 'destaque'),
    block(`${id}-cuidado`, 'O que não concluir', closing),
    block(`${id}-pergunta`, 'Pergunta para estudar', `Que evidência faria esta explicação mudar?`, 'pergunta'),
  ],
  organismoIds: ['homo-sapiens', 'homo-neanderthalensis'].filter((organismId) => !['termos-familia-humana'].includes(id) || organismId === 'homo-sapiens'),
  linhagemIds: ['eva-mitocondrial', 'ancestral-y', 'coalescencia'].includes(id) ? ['ancestral-mitocondrial-comum', 'ancestral-y-comum'] : id === 'neandertais-denisovanos' || id === 'dna-antigo-metodo' ? ['denisovanos'] : [],
  fonteIds: id === 'eva-mitocondrial' ? ['cann-mtdna-1987'] : id === 'ancestral-y' ? ['poznik-y-2013'] : id === 'neandertais-denisovanos' || id === 'dna-antigo-metodo' ? ['green-neanderthal-2010', 'reich-denisovan-2010'] : ['smithsonian-human-genetics'],
  revisao: { status: 'aprovado', revisadoEm: reviewedAt },
}));

type PublicationDefinition = {
  id: string;
  title: string;
  mode: Publicacao['modo'];
  authors: string[];
  sourceTitle: string;
  sourceUrl: string;
  doi?: string;
  license: string;
  licenseUrl?: string;
  integral?: boolean;
  sourceIds: string[];
  dossierIds: string[];
  essential: Array<[string, string]>;
  deep: Array<[string, string]>;
  minutes?: number;
};

const translationNotice = 'Tradução PT-BR do texto principal sob CC BY 4.0. Figuras foram omitidas até auditoria individual; notas de atualização do Dinopad aparecem separadas da tradução.';
const publicationsData: PublicationDefinition[] = [
  {
    id: 'arvore-ou-escada',
    title: 'Árvore ou escada?',
    mode: 'sintese-dinopad',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Síntese original Dinopad',
    sourceUrl: 'https://mafhper.github.io/dinopad/',
    license: 'MIT',
    sourceIds: ['smithsonian-human-genetics'],
    dossierIds: ['arvore-nao-escada'],
    essential: [['Uma imagem que engana', 'A famosa fila do macaco ao humano sugere progresso e substituição. A evidência mostra uma árvore cheia de ramos que coexistiram.'], ['Como ler a árvore', 'Nós internos são ancestrais comuns inferidos. Uma espécie desenhada na ponta não é declarada ancestral direta de outra.']],
    deep: [['Polytomias', 'Quando os dados não resolvem a ordem de separação, vários ramos partem do mesmo ponto. Isso registra honestamente a incerteza.'], ['Genes e espécies', 'Uma árvore feita com um gene pode discordar de outra porque cada trecho de DNA tem sua genealogia. Revisões combinam muitas evidências.']],
  },
  {
    id: 'familia-humana',
    title: 'Quem pertence à família humana?',
    mode: 'sintese-dinopad',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Síntese original Dinopad',
    sourceUrl: 'https://mafhper.github.io/dinopad/',
    license: 'MIT',
    sourceIds: ['mdd-hominidae', 'smithsonian-human-species'],
    dossierIds: ['termos-familia-humana'],
    essential: [['Hominidae', 'A família Hominidae inclui orangotangos, gorilas, chimpanzés, bonobos e humanos, além de parentes extintos.'], ['Hominínios', 'No uso mais comum, hominínios são os membros do ramo humano depois da separação do ramo de chimpanzés e bonobos.']],
    deep: [['Nomes mudam', 'Classificações são hipóteses revisáveis. Novos fósseis e análises podem alterar a posição de um gênero sem apagar o registro anterior.'], ['Sem hierarquia moral', 'Categorias taxonômicas descrevem parentesco. Elas não medem valor, inteligência ou importância.']],
  },
  {
    id: 'eva-mitocondrial-explicada',
    title: 'O que “Eva mitocondrial” realmente significa?',
    mode: 'sintese-dinopad',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Síntese original Dinopad',
    sourceUrl: 'https://mafhper.github.io/dinopad/',
    license: 'MIT',
    sourceIds: ['cann-mtdna-1987', 'smithsonian-human-genetics'],
    dossierIds: ['eva-mitocondrial', 'coalescencia'],
    essential: [['Uma linha entre muitas', 'O DNA mitocondrial costuma passar pela linha materna. Seguindo as cópias atuais para trás, elas convergem em uma ancestral comum.'], ['Não foi a única', 'Essa ancestral viveu entre muitas pessoas. Outras mulheres do mesmo tempo também podem ser ancestrais nossas por caminhos diferentes.']],
    deep: [['Coalescência', 'O ponto de encontro depende das linhagens que sobreviveram até a amostra atual. Novas amostras e modelos podem ajustar a data.'], ['Muitos passados no genoma', 'O cromossomo Y e cada trecho autossômico têm outros pontos de coalescência. Não existe um casal fundador genético.']],
  },
  {
    id: 'migracoes-e-encontros',
    title: 'Migrações e encontros entre diferentes humanos',
    mode: 'sintese-dinopad',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Síntese original Dinopad',
    sourceUrl: 'https://mafhper.github.io/dinopad/',
    license: 'MIT',
    sourceIds: ['green-neanderthal-2010', 'reich-denisovan-2010'],
    dossierIds: ['origem-africana-dispersoes', 'neandertais-denisovanos'],
    essential: [['Múltiplos movimentos', 'Homo sapiens surgiu na África. Ao longo do tempo, populações se moveram para outras regiões e também retornaram.'], ['Encontros', 'Neandertais, denisovanos e humanos modernos trocaram genes. O resultado aparece como conexões sobre a árvore.']],
    deep: [['Mosaicos genéticos', 'A frequência de segmentos arcaicos varia entre populações. Isso reflete histórias demográficas, seleção e amostragem, não “porcentagens de espécie”.'], ['Cuidado com mapas', 'Rótulos geográficos atuais simplificam paisagens e populações antigas em movimento.']],
  },
  {
    id: 'fosseis-e-dna-antigo',
    title: 'Como fósseis e DNA antigo produzem conhecimento',
    mode: 'sintese-dinopad',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Síntese original Dinopad',
    sourceUrl: 'https://mafhper.github.io/dinopad/',
    license: 'MIT',
    sourceIds: ['smithsonian-human-fossils', 'green-neanderthal-2010'],
    dossierIds: ['dna-antigo-metodo'],
    essential: [['Duas linhas de evidência', 'Ossos registram anatomia, idade e contexto. DNA pode revelar parentesco e fluxo gênico quando preserva.'], ['Limites', 'DNA se degrada e contamina. Muitos fósseis tropicais antigos nunca fornecerão genomas utilizáveis.']],
    deep: [['Controles', 'Padrões de fragmentação, substituições químicas, replicação e controles negativos ajudam a autenticar DNA antigo.'], ['Convergência', 'Conclusões mais fortes aparecem quando genética, anatomia, arqueologia e datação apontam na mesma direção.']],
  },
  {
    id: 'revolucao-dna-antigo',
    title: 'A revolução do DNA antigo — o que a genética conta sobre o passado?',
    mode: 'traducao-autorizada',
    authors: ['Yoav Mathov', 'Liran Carmel'],
    sourceTitle: 'The Revolution of Ancient DNA—What Does Genetics Tell Us About the Past?',
    sourceUrl: 'https://kids.frontiersin.org/articles/10.3389/frym.2019.00024',
    doi: '10.3389/frym.2019.00024',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    integral: true,
    sourceIds: ['frontiers-adna-2019'],
    dossierIds: ['dna-antigo-metodo', 'neandertais-denisovanos'],
    minutes: 16,
    essential: [['Resumo', 'O DNA contém instruções para construir e manter organismos. Novas técnicas permitem recuperar DNA de restos antigos e investigar mudanças evolutivas, Neandertais, Denisovanos e extinções.'], ['A grande ideia', 'Sequenciar DNA antigo abre uma janela independente dos ossos e objetos, mas moléculas degradadas e contaminação exigem métodos rigorosos.']],
    deep: [...frontiersTranslations['revolucao-dna-antigo']],
  },
  {
    id: 'dna-neandertal',
    title: 'Por que alguns humanos têm DNA neandertal?',
    mode: 'traducao-autorizada',
    authors: ['Jente Ottenburghs'],
    sourceTitle: 'Why Do Some Humans Have Neanderthal DNA?',
    sourceUrl: 'https://kids.frontiersin.org/articles/10.3389/frym.2019.00104',
    doi: '10.3389/frym.2019.00104',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    integral: true,
    sourceIds: ['frontiers-neanderthal-2019', 'green-neanderthal-2010'],
    dossierIds: ['neandertais-denisovanos'],
    minutes: 12,
    essential: [['Resumo', 'Humanos modernos e Neandertais tiveram descendentes. Esse fluxo de DNA é chamado introgressão, e alguns segmentos arcaicos permanecem em populações atuais.'], ['Seleção', 'Segmentos podem diminuir por cruzamentos e acaso, persistir sem efeito ou mudar de frequência quando afetam reprodução e sobrevivência.']],
    deep: [...frontiersTranslations['dna-neandertal']],
  },
  {
    id: 'dna-historia-humana',
    title: 'O que nosso DNA pode contar sobre a história humana',
    mode: 'traducao-autorizada',
    authors: ['Leo Speidel', 'Clare Bycroft'],
    sourceTitle: 'What Our DNA Can Tell Us About the History of Humans',
    sourceUrl: 'https://kids.frontiersin.org/articles/10.3389/frym.2020.00106',
    doi: '10.3389/frym.2020.00106',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    integral: true,
    sourceIds: ['frontiers-dna-history-2020'],
    dossierIds: ['coalescencia', 'origem-africana-dispersoes'],
    minutes: 14,
    essential: [['Resumo', 'Trechos de DNA passam por caminhos diferentes de ancestrais. Matemática, estatística e computadores ajudam a reconstruir árvores genealógicas de cada trecho.'], ['Três escalas', 'Essas árvores informam a história antiga, diferenças regionais recentes e misturas entre populações em movimento.']],
    deep: [...frontiersTranslations['dna-historia-humana']],
  },
  {
    id: 'leitura-cann-1987',
    title: 'Leitura guiada: Cann, Stoneking e Wilson (1987)',
    mode: 'leitura-guiada',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Mitochondrial DNA and human evolution',
    sourceUrl: 'https://doi.org/10.1038/325031a0',
    doi: '10.1038/325031a0',
    license: 'Leitura guiada; artigo original sob direitos autorais',
    sourceIds: ['cann-mtdna-1987'],
    dossierIds: ['eva-mitocondrial', 'coalescencia'],
    essential: [['Pergunta do artigo', 'O que a variação do DNA mitocondrial de pessoas atuais pode revelar sobre a história recente da nossa espécie?'], ['Resultado histórico', 'A análise apoiou uma origem africana recente para as linhagens mitocondriais amostradas e popularizou a expressão “Eva mitocondrial”.']],
    deep: [['Como ler hoje', 'A amostra e os métodos de 1987 eram limitados. O artigo é importante historicamente, mas estimativas atuais usam muito mais genomas e modelos.'], ['Pergunta', 'Por que uma ancestral comum de um gene não é a única mulher viva naquela época?']],
  },
  {
    id: 'leitura-green-2010',
    title: 'Leitura guiada: o genoma Neandertal (2010)',
    mode: 'leitura-guiada',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'A draft sequence of the Neandertal genome',
    sourceUrl: 'https://doi.org/10.1126/science.1188021',
    doi: '10.1126/science.1188021',
    license: 'Leitura guiada; artigo original sob direitos autorais',
    sourceIds: ['green-neanderthal-2010'],
    dossierIds: ['neandertais-denisovanos', 'dna-antigo-metodo'],
    essential: [['Mudança de visão', 'Comparações genômicas mostraram fluxo gênico entre Neandertais e ancestrais de humanos modernos fora da África.'], ['Evidência', 'O padrão aparece em milhões de posições do genoma e precisa ser separado de contaminação e ancestralidade compartilhada antiga.']],
    deep: [['Método', 'Fragmentos de vários indivíduos foram sequenciados, autenticados e comparados com genomas humanos e de chimpanzé.'], ['Pergunta', 'Que controles tornam um sinal de introgressão mais convincente do que uma semelhança isolada?']],
  },
  {
    id: 'leitura-reich-2010',
    title: 'Leitura guiada: Denisovanos (2010)',
    mode: 'leitura-guiada',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Genetic history of an archaic hominin group from Denisova Cave in Siberia',
    sourceUrl: 'https://doi.org/10.1038/nature09710',
    doi: '10.1038/nature09710',
    license: 'Leitura guiada; artigo original sob direitos autorais',
    sourceIds: ['reich-denisovan-2010'],
    dossierIds: ['neandertais-denisovanos', 'dna-antigo-metodo'],
    essential: [['Uma população pelo DNA', 'Um pequeno osso do dedo revelou uma linhagem humana arcaica distinta: os Denisovanos.'], ['Conexões', 'Comparações indicaram parentesco próximo com Neandertais e contribuição genética para ancestrais de populações atuais.']],
    deep: [['Limite taxonômico', 'Uma linhagem genética não é automaticamente uma espécie formal. O Dinopad mantém Denisovanos fora das folhas aprovadas.'], ['Pergunta', 'Quais fósseis e contextos seriam necessários para ligar anatomia e genoma com mais segurança?']],
  },
  {
    id: 'leitura-berger-2015',
    title: 'Leitura guiada: a descrição de Homo naledi (2015)',
    mode: 'leitura-guiada',
    authors: ['Equipe editorial Dinopad'],
    sourceTitle: 'Homo naledi, a new species of the genus Homo from the Dinaledi Chamber, South Africa',
    sourceUrl: 'https://doi.org/10.7554/eLife.09560',
    doi: '10.7554/eLife.09560',
    license: 'CC BY 4.0; leitura guiada, não reprodução integral',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceIds: ['berger-naledi-2015'],
    dossierIds: ['arvore-nao-escada'],
    essential: [['Um grande conjunto', 'A câmara Dinaledi preservou restos de vários indivíduos com uma combinação singular de características.'], ['Nomear uma espécie', 'A equipe comparou dentes, crânio e esqueleto com outros hominínios para justificar Homo naledi.']],
    deep: [['O que veio depois', 'A datação publicada posteriormente mostrou idade muito mais recente do que muitos esperavam pela anatomia. Forma não funciona como relógio simples.'], ['Pergunta', 'Quais características sustentam a inclusão em Homo e quais mantêm a posição filogenética incerta?']],
  },
];

function publication(definition: PublicationDefinition): Publicacao {
  const essential = definition.essential.map(([title, text], index) => block(`${definition.id}-essencial-${index + 1}`, title, text, index === 0 ? 'destaque' : 'paragrafo'));
  const deep = definition.deep.map(([title, text], index) => block(`${definition.id}-aprofundar-${index + 1}`, title, text));
  return {
    id: definition.id,
    slug: definition.id,
    titulo: definition.title,
    modo: definition.mode,
    traducaoIntegral: definition.mode === 'traducao-autorizada' && Boolean(definition.integral),
    autores: definition.authors,
    ...(definition.mode === 'traducao-autorizada' ? { tradutor: 'Equipe editorial Dinopad' } : {}),
    idiomaOriginal: definition.mode === 'traducao-autorizada' ? 'Inglês' : 'Português do Brasil',
    minutosLeitura: definition.minutes ?? Math.max(5, essential.length + deep.length + 2),
    fonteOriginal: {
      titulo: definition.sourceTitle,
      url: definition.sourceUrl,
      ...(definition.doi ? { doi: definition.doi } : {}),
      licenca: definition.license,
      ...(definition.licenseUrl ? { urlLicenca: definition.licenseUrl } : {}),
      permiteTraducaoIntegral: Boolean(definition.integral),
    },
    notaEditorial: definition.mode === 'traducao-autorizada'
      ? translationNotice
      : definition.mode === 'leitura-guiada'
        ? 'Paráfrase educativa com perguntas de estudo. O artigo original não é reproduzido.'
        : 'Síntese original Dinopad em linguagem adequada para leitura acompanhada.',
    camadaEssencial: essential,
    camadaAprofundar: deep,
    organismoIds: ['homo-sapiens', 'homo-neanderthalensis'].filter((id) => definition.id !== 'familia-humana' || id === 'homo-sapiens'),
    linhagemIds: definition.dossierIds.some((id) => ['neandertais-denisovanos', 'dna-antigo-metodo'].includes(id)) ? ['denisovanos'] : [],
    dossieIds: definition.dossierIds,
    fonteIds: definition.sourceIds,
    revisao: { status: 'aprovado', revisadoEm: reviewedAt },
  };
}

const publications = publicationsData.map(publication);
if (publications.length !== 12) throw new Error(`A Meta 72 exige 12 publicações; encontrado: ${publications.length}.`);

type SpecimenSeed = {
  id: string;
  organismId?: string;
  lineageId?: string;
  nickname: string;
  catalog: string;
  year: number;
  discoverer: string;
  formation: string;
  location: string;
  museum: string;
  summary: string;
  sourceIds: string[];
};

const specimenSeeds: SpecimenSeed[] = [
  { id: 'toumai', organismId: 'sahelanthropus-tchadensis', nickname: 'Toumaï', catalog: 'TM 266-01-060-1', year: 2001, discoverer: 'Equipe da Missão Paleoantropológica Franco-Chadiana', formation: 'Toros-Menalla', location: 'Deserto de Djurab, Chade', museum: 'Centre National de Recherche pour le Développement, Chade', summary: 'Crânio deformado pela fossilização que ampliou para a África central o mapa dos primeiros hominínios candidatos. Sua postura e posição filogenética seguem em debate.', sourceIds: ['toumai-2002'] },
  { id: 'ardi', organismId: 'ardipithecus-ramidus', nickname: 'Ardi', catalog: 'ARA-VP-6/500', year: 1994, discoverer: 'Equipe do Middle Awash', formation: 'Sagantole', location: 'Aramis, Etiópia', museum: 'National Museum of Ethiopia', summary: 'Esqueleto parcial que exigiu anos de preparação. A combinação de pés, mãos, pelve e crânio ajuda a discutir locomoção em árvores e no solo.', sourceIds: ['ardi-2009'] },
  { id: 'lucy', organismId: 'australopithecus-afarensis', nickname: 'Lucy', catalog: 'AL 288-1', year: 1974, discoverer: 'Donald Johanson e Tom Gray', formation: 'Hadar', location: 'Afar, Etiópia', museum: 'National Museum of Ethiopia', summary: 'Cerca de 40% de um esqueleto adulto. Pelve, joelho e membros documentam bipedalismo, enquanto braços e ombros preservam pistas de escalada.', sourceIds: ['lucy-1976'] },
  { id: 'taung-1', organismId: 'australopithecus-africanus', nickname: 'Criança de Taung', catalog: 'Taung 1', year: 1924, discoverer: 'Trabalhadores da pedreira de Buxton; estudado por Raymond Dart', formation: 'Taung', location: 'Noroeste da África do Sul', museum: 'University of the Witwatersrand', summary: 'Crânio infantil e molde natural do cérebro que ajudaram a deslocar a busca pelas origens humanas para a África.', sourceIds: ['taung-1925'] },
  { id: 'little-foot', organismId: 'australopithecus-africanus', nickname: 'Little Foot', catalog: 'StW 573', year: 1994, discoverer: 'Ron Clarke e equipe de Sterkfontein', formation: 'Sterkfontein Member 2', location: 'Gauteng, África do Sul', museum: 'University of the Witwatersrand', summary: 'Esqueleto muito completo extraído lentamente de brecha calcária. Sua espécie, idade e combinação locomotora alimentam debates importantes.', sourceIds: ['little-foot-wits'] },
  { id: 'oh-7', organismId: 'homo-habilis', nickname: 'OH 7', catalog: 'OH 7', year: 1960, discoverer: 'Jonathan Leakey e equipe', formation: 'Olduvai Bed I', location: 'Garganta de Olduvai, Tanzânia', museum: 'National Museum of Tanzania', summary: 'Mandíbula, dentes e ossos da mão que compõem o holótipo de Homo habilis. A associação lembra como espécimes fragmentários sustentam nomes taxonômicos.', sourceIds: ['oh7-1964'] },
  { id: 'turkana-boy', organismId: 'homo-erectus', nickname: 'Turkana Boy', catalog: 'KNM-WT 15000', year: 1984, discoverer: 'Kamoya Kimeu e equipe', formation: 'Nariokotome', location: 'Oeste do lago Turkana, Quênia', museum: 'National Museums of Kenya', summary: 'Esqueleto juvenil excepcionalmente completo que informa proporções corporais, crescimento e locomoção de Homo erectus.', sourceIds: ['smithsonian-turkana-boy'] },
  { id: 'dmanisi-5', organismId: 'homo-erectus', nickname: 'Dmanisi 5', catalog: 'D4500/D2600', year: 2005, discoverer: 'Equipe do Museu Nacional da Geórgia', formation: 'Dmanisi', location: 'Dmanisi, Geórgia', museum: 'Georgian National Museum', summary: 'Crânio completo associado a uma mandíbula robusta. A variação entre os crânios do sítio desafia divisões taxonômicas simples.', sourceIds: ['dmanisi-5-2013'] },
  { id: 'neanderthal-1', organismId: 'homo-neanderthalensis', nickname: 'Neanderthal 1', catalog: 'Neanderthal 1', year: 1856, discoverer: 'Trabalhadores da pedreira Feldhofer', formation: 'Feldhofer Cave deposits', location: 'Vale de Neander, Alemanha', museum: 'LVR-LandesMuseum Bonn', summary: 'Calota craniana e ossos que deram nome aos Neandertais. Interpretações iniciais mudaram quando novos fósseis mostraram uma população humana extinta.', sourceIds: ['neanderthal-1-smithsonian'] },
  { id: 'denisova-3', lineageId: 'denisovanos', nickname: 'Denisova 3', catalog: 'Denisova 3', year: 2008, discoverer: 'Equipe da caverna de Denisova', formation: 'Denisova Cave layer 11', location: 'Montanhas Altai, Rússia', museum: 'Institute of Archaeology and Ethnography, Novosibirsk', summary: 'Pequeno fragmento de falange que forneceu um genoma e revelou uma população arcaica. É associado à linhagem denisovana, não reclassificado como Homo sapiens.', sourceIds: ['reich-denisovan-2010'] },
  { id: 'lb1', organismId: 'homo-floresiensis', nickname: 'LB1', catalog: 'LB1', year: 2003, discoverer: 'Equipe indonésio-australiana de Liang Bua', formation: 'Liang Bua', location: 'Ilha de Flores, Indonésia', museum: 'Indonesian National Research and Innovation Agency', summary: 'Esqueleto parcial adulto e holótipo de Homo floresiensis. Seu pequeno corpo e mosaico anatômico motivaram extensos testes de hipóteses alternativas.', sourceIds: ['lb1-2004'] },
  { id: 'dh1', organismId: 'homo-naledi', nickname: 'DH1', catalog: 'DH1', year: 2013, discoverer: 'Equipe Rising Star', formation: 'Dinaledi Chamber', location: 'Sistema Rising Star, África do Sul', museum: 'University of the Witwatersrand', summary: 'Crânio composto designado holótipo de Homo naledi, parte de um conjunto com muitos indivíduos e regiões do esqueleto.', sourceIds: ['berger-naledi-2015'] },
];

const specimenMediaByOrganism = new Map<string, string>();
for (const seed of specimenSeeds) if (seed.organismId) specimenMediaByOrganism.set(seed.organismId, `${seed.organismId}-evidencia`);
const specimens: EspecimeFossil[] = specimenSeeds.map((seed) => ({
  id: seed.id,
  ...(seed.organismId ? { organismoId: seed.organismId } : { linhagemId: seed.lineageId! }),
  apelido: seed.nickname,
  numeroCatalogo: seed.catalog,
  tipo: ['toumai', 'oh-7', 'lb1', 'dh1'].includes(seed.id) ? 'holotipo' : 'especime-notavel',
  anoDescoberta: seed.year,
  descobridor: seed.discoverer,
  formacao: seed.formation,
  local: seed.location,
  museuAtual: seed.museum,
  resumo: seed.summary,
  mediaIds: seed.organismId ? [specimenMediaByOrganism.get(seed.organismId)!] : ['denisovanos-evidencia'],
  fonteIds: seed.sourceIds,
  revisao: { status: 'aprovado', revisadoEm: reviewedAt },
}));

const denisovaMediaDir = resolve(repoRoot, 'public/media/linhagens/denisovanos');
mkdirSync(denisovaMediaDir, { recursive: true });
writeFileSync(resolve(denisovaMediaDir, 'denisova-3.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560" role="img" aria-labelledby="title desc">
  <title id="title">Diagrama do fragmento Denisova 3</title>
  <desc id="desc">Forma esquemática de um pequeno fragmento de falange. Não é uma reconstrução anatômica nem uma fotografia do fóssil.</desc>
  <rect width="960" height="560" rx="24" fill="#f1ead7"/>
  <text x="64" y="82" font-family="system-ui, sans-serif" font-size="18" letter-spacing="2" fill="#875711">EVIDÊNCIA GENÉTICA</text>
  <path d="M318 165C392 116 559 128 637 190C695 236 682 339 612 386C535 439 374 427 302 359C247 307 251 210 318 165Z" fill="#c8b48e" stroke="#514534" stroke-width="7"/>
  <path d="M369 208C431 177 548 183 593 224M347 321C424 363 551 357 619 309" fill="none" stroke="#8d7655" stroke-width="9" stroke-linecap="round"/>
  <text x="64" y="474" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#34362f">Denisova 3</text>
  <text x="64" y="515" font-family="system-ui, sans-serif" font-size="20" fill="#5f6258">Diagrama esquemático · consulte a publicação original para a evidência</text>
</svg>`, 'utf8');
const lineageMedia: MediaAsset = {
  id: 'denisovanos-evidencia',
  entidade: { tipo: 'linhagem', id: 'denisovanos' },
  papel: 'evidencia',
  representacao: 'diagrama',
  titulo: 'Denisova 3 — evidência genética',
  autor: 'Equipe editorial Dinopad',
  fonte: 'Dinopad, a partir de Reich et al. (2010)',
  urlFonte: 'https://doi.org/10.1038/nature09710',
  licenca: 'MIT',
  urlLicenca: 'https://opensource.org/license/mit',
  acessadoEm: reviewedAt,
  arquivos: { src: '/media/linhagens/denisovanos/denisova-3.svg' },
  altPt: 'Diagrama esquemático do pequeno fragmento de falange Denisova 3.',
  legendaPt: 'Diagrama de orientação, não fotografia nem reconstrução anatômica. O pequeno fragmento forneceu DNA que revelou a linhagem denisovana.',
  alteracoes: 'Diagrama vetorial original do Dinopad; proporções simplificadas e nenhuma reconstrução por IA.',
};

const existingSources = read<FonteCientifica>('fontes.json');
const existingLineages = read<LinhagemGenetica>('linhagens.json');
const existingConnections = read<ConexaoEvolutiva>('conexoes-evolutivas.json');
const existingDossiers = read<DossieConceitual>('dossies.json');
const existingPublications = read<Publicacao>('publicacoes.json');
const existingSpecimens = read<EspecimeFossil>('especimes.json');
const existingMedia = read<MediaAsset>('media.json');
const organisms = read<OrganismoAtlas>('organismos.json');
const specimenIdsByOrganism = new Map<string, string[]>();
for (const specimen of [...existingSpecimens, ...specimens]) {
  if (specimen.organismoId) specimenIdsByOrganism.set(specimen.organismoId, [...(specimenIdsByOrganism.get(specimen.organismoId) ?? []), specimen.id]);
}

write('fontes.json', upsert(existingSources, sources));
write('linhagens.json', upsert(existingLineages, lineages));
write('conexoes-evolutivas.json', upsert(existingConnections, connections));
write('dossies.json', upsert(existingDossiers, dossiers));
// O seed cria registros ausentes, mas não substitui revisões editoriais feitas
// diretamente no catálogo publicado.
write('publicacoes.json', upsert(publications, existingPublications));
write('especimes.json', upsert(existingSpecimens, specimens));
write('media.json', upsert(existingMedia, [lineageMedia]));
write('organismos.json', organisms.map((organism) => ({
  ...organism,
  especimeIds: [...new Set(specimenIdsByOrganism.get(organism.id) ?? organism.especimeIds)],
})));

console.log(`Humanidade semeada: ${lineages.length} linhagens, ${connections.length} conexões, ${dossiers.length} dossiês, ${publications.length} publicações e ${specimens.length} espécimes.`);
