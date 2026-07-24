import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  CategoriaEditorial,
  FonteCientifica,
  NoFilogenetico,
  OrganismoAtlas,
  Periodo,
} from '../../src/content/schema';
import { dataDir } from './io';

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

const universalFields: FonteCientifica['camposSustentados'] = [
  'taxonomia',
  'intervalo',
  'ocorrencias',
  'energia',
  'dimensoes',
  'filogenia',
  'morfologia',
];

const newSources: FonteCientifica[] = [
  {
    id: 'mdd-hominidae',
    titulo: 'Mammal Diversity Database — Hominidae',
    instituicao: 'American Society of Mammalogists',
    nivel: 'A',
    tipo: 'base-dados',
    camposSustentados: ['taxonomia', 'intervalo', 'ocorrencias', 'publicacao'],
    url: 'https://www.mammaldiversity.org/family/hominidae/',
    acessadoEm: reviewedAt,
    observacao: 'Fonte taxonômica para as espécies viventes. Não é usada para inferir a idade de divergência das linhagens.',
  },
  {
    id: 'great-ape-phylogenomics-2013',
    titulo: 'Great ape genetic diversity and population history',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: ['taxonomia', 'filogenia', 'genetica'],
    url: 'https://doi.org/10.1038/nature12228',
    doi: '10.1038/nature12228',
    acessadoEm: reviewedAt,
  },
  {
    id: 'adw-gorilla',
    titulo: 'Gorilla — Animal Diversity Web',
    instituicao: 'University of Michigan Museum of Zoology',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['ocorrencias', 'energia', 'dimensoes', 'morfologia'],
    url: 'https://animaldiversity.org/accounts/Gorilla/',
    acessadoEm: reviewedAt,
  },
  {
    id: 'adw-pan',
    titulo: 'Pan — Animal Diversity Web',
    instituicao: 'University of Michigan Museum of Zoology',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['ocorrencias', 'energia', 'dimensoes', 'morfologia'],
    url: 'https://animaldiversity.org/accounts/Pan/',
    acessadoEm: reviewedAt,
  },
  {
    id: 'adw-pongo',
    titulo: 'Pongo — Animal Diversity Web',
    instituicao: 'University of Michigan Museum of Zoology',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['ocorrencias', 'energia', 'dimensoes', 'morfologia'],
    url: 'https://animaldiversity.org/accounts/Pongo/',
    acessadoEm: reviewedAt,
  },
  {
    id: 'smithsonian-human-species',
    titulo: 'Early human species',
    instituicao: 'Smithsonian Human Origins Program',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: [...universalFields, 'publicacao'],
    url: 'https://humanorigins.si.edu/evidence/human-fossils/species',
    acessadoEm: reviewedAt,
    observacao: 'Índice institucional com fichas individuais e faixas dos fósseis conhecidos; divergências taxonômicas permanecem explícitas.',
  },
  {
    id: 'smithsonian-human-genetics',
    titulo: 'Genetic evidence and human evolution',
    instituicao: 'Smithsonian Human Origins Program',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: ['filogenia', 'genetica', 'conceito', 'publicacao'],
    url: 'https://humanorigins.si.edu/evidence/genetics',
    acessadoEm: reviewedAt,
  },
  {
    id: 'homo-sapiens-jebel-irhoud-2017',
    titulo: 'New fossils from Jebel Irhoud, Morocco and the pan-African origin of Homo sapiens',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: universalFields,
    url: 'https://doi.org/10.1038/nature22336',
    doi: '10.1038/nature22336',
    acessadoEm: reviewedAt,
  },
  {
    id: 'dickinsonia-biomarker-2018',
    titulo: 'Ancient steroids establish the Ediacaran fossil Dickinsonia as one of the earliest animals',
    instituicao: 'Science',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: universalFields,
    url: 'https://doi.org/10.1126/science.aat7228',
    doi: '10.1126/science.aat7228',
    acessadoEm: reviewedAt,
  },
  {
    id: 'rom-anomalocaris',
    titulo: 'Anomalocaris canadensis',
    instituicao: 'Royal Ontario Museum',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: universalFields,
    url: 'https://burgess-shale.rom.on.ca/fossils/anomalocaris-canadensis/',
    acessadoEm: reviewedAt,
  },
  {
    id: 'tiktaalik-2006',
    titulo: 'A Devonian tetrapod-like fish and the evolution of the tetrapod body plan',
    instituicao: 'Nature',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: universalFields,
    url: 'https://doi.org/10.1038/nature04639',
    doi: '10.1038/nature04639',
    acessadoEm: reviewedAt,
  },
  {
    id: 'acanthostega-2002',
    titulo: 'The axial skeleton of the Devonian tetrapod Acanthostega gunnari',
    instituicao: 'Transactions of the Royal Society of Edinburgh',
    nivel: 'A',
    tipo: 'artigo',
    camposSustentados: universalFields,
    url: 'https://doi.org/10.1017/S0263593300000346',
    doi: '10.1017/S0263593300000346',
    acessadoEm: reviewedAt,
  },
  {
    id: 'aberdeen-rhynie',
    titulo: 'The Rhynie Chert — early land plants',
    instituicao: 'University of Aberdeen',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: universalFields,
    url: 'https://www.abdn.ac.uk/rhynie/',
    acessadoEm: reviewedAt,
  },
  {
    id: 'ucmp-calamites',
    titulo: 'Sphenopsids of the late Paleozoic',
    instituicao: 'University of California Museum of Paleontology',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: universalFields,
    url: 'https://ucmp.berkeley.edu/plants/sphenophyta/sphenophytafr.html',
    acessadoEm: reviewedAt,
  },
  {
    id: 'nps-glossopteris',
    titulo: 'Glossopteris and evidence for Gondwana',
    instituicao: 'U.S. National Park Service',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: universalFields,
    url: 'https://www.nps.gov/subjects/nnlandmarks/glossopteris.htm',
    acessadoEm: reviewedAt,
  },
  {
    id: 'smithsonian-cycadeoidea',
    titulo: 'Fossil cycadeoids and the Bennettitales',
    instituicao: 'Smithsonian National Museum of Natural History',
    nivel: 'B',
    tipo: 'museu',
    camposSustentados: universalFields,
    url: 'https://naturalhistory.si.edu/research/paleobiology/collections-overview',
    acessadoEm: reviewedAt,
  },
];

const node = (
  id: string,
  nomeCientifico: string,
  nomePt: string,
  paiId: string,
  ordemVisual: number,
  fonteIds: string[],
  certeza: NoFilogenetico['certeza'] = 'estabelecida',
  nivelTaxonomico: NoFilogenetico['nivelTaxonomico'] = 'clado',
  notaEditorial?: string,
): NoFilogenetico => ({
  id,
  nomeCientifico,
  nomePt,
  nomeEn: nomeCientifico,
  nivelTaxonomico,
  paiId,
  ordemVisual,
  caracteristicasCompartilhadas: [`Ramo reconhecido por um conjunto de características de ${nomePt.toLocaleLowerCase('pt-BR')}`],
  certeza,
  ...(notaEditorial ? { notaEditorial } : {}),
  fonteIds,
});

const humanSources = ['smithsonian-human-species', 'great-ape-phylogenomics-2013'];
const newNodes: NoFilogenetico[] = [
  node('vertebrata', 'Vertebrata', 'Vertebrados', 'chordata', 0, ['open-tree-of-life']),
  node('tetrapodomorpha', 'Tetrapodomorpha', 'Tetrapodomorfos', 'vertebrata', 0, ['tiktaalik-2006']),
  node('elpistostegalia', 'Elpistostegalia', 'Elpistostegálios', 'tetrapodomorpha', 0, ['tiktaalik-2006']),
  node('tetrapoda', 'Tetrapoda', 'Tetrápodes', 'tetrapodomorpha', 1, ['acanthostega-2002', 'open-tree-of-life']),
  node('acanthostegidae', 'Acanthostegidae', 'Acanthostegídeos', 'tetrapoda', 0, ['acanthostega-2002'], 'estabelecida', 'familia'),
  node('arthropoda', 'Arthropoda', 'Artrópodes', 'metazoa', 0, ['open-tree-of-life']),
  node('radiodonta', 'Radiodonta', 'Radiodontes', 'arthropoda', 0, ['rom-anomalocaris']),
  node('anomalocarididae', 'Anomalocarididae', 'Anomalocaridídeos', 'radiodonta', 0, ['rom-anomalocaris'], 'estabelecida', 'familia'),
  node('dickinsoniidae', 'Dickinsoniidae', 'Dickinsoniídeos', 'metazoa', 1, ['dickinsonia-biomarker-2018'], 'provavel', 'familia', 'A posição exata dentro de Metazoa permanece debatida.'),
  node('primates', 'Primates', 'Primatas', 'mammalia', 1, humanSources, 'estabelecida', 'ordem'),
  node('haplorhini', 'Haplorhini', 'Haplorrinos', 'primates', 0, humanSources),
  node('simiiformes', 'Simiiformes', 'Símios', 'haplorhini', 0, humanSources),
  node('catarrhini', 'Catarrhini', 'Catarrinos', 'simiiformes', 0, humanSources),
  node('hominoidea', 'Hominoidea', 'Hominoides', 'catarrhini', 0, humanSources),
  node('hominidae', 'Hominidae', 'Hominídeos', 'hominoidea', 0, humanSources, 'estabelecida', 'familia'),
  node('ponginae', 'Ponginae', 'Pongíneos', 'hominidae', 0, humanSources),
  node('pongo', 'Pongo', 'Orangotangos', 'ponginae', 0, humanSources, 'estabelecida', 'genero'),
  node('homininae', 'Homininae', 'Hominíneos', 'hominidae', 1, humanSources),
  node('gorillini', 'Gorillini', 'Gorilas e parentes', 'homininae', 0, humanSources),
  node('gorilla', 'Gorilla', 'Gorilas', 'gorillini', 0, humanSources, 'estabelecida', 'genero'),
  node('hominini', 'Hominini', 'Humanos, chimpanzés e parentes', 'homininae', 1, humanSources),
  node('panina', 'Panina', 'Chimpanzés e bonobos', 'hominini', 0, humanSources),
  node('pan', 'Pan', 'Chimpanzés e bonobos', 'panina', 0, humanSources, 'estabelecida', 'genero'),
  node('hominina', 'Hominina', 'Hominínios', 'hominini', 1, humanSources, 'provavel', 'clado', 'A ordem dos primeiros ramos hominínios não está completamente resolvida.'),
  node('sahelanthropus-lineage', 'Sahelanthropus', 'Ramo de Sahelanthropus', 'hominina', 0, humanSources, 'em-debate', 'genero'),
  node('orrorin-lineage', 'Orrorin', 'Ramo de Orrorin', 'hominina', 1, humanSources, 'em-debate', 'genero'),
  node('ardipithecus', 'Ardipithecus', 'Ardipitecos', 'hominina', 2, humanSources, 'provavel', 'genero'),
  node('australopithecina', 'Australopithecina', 'Australopitecíneos', 'hominina', 3, humanSources, 'em-debate', 'clado', 'A topologia entre Australopithecus, Kenyanthropus, Paranthropus e Homo varia entre análises.'),
  node('australopithecus', 'Australopithecus', 'Australopitecos', 'australopithecina', 0, humanSources, 'em-debate', 'genero'),
  node('kenyanthropus', 'Kenyanthropus', 'Kenyanthropus', 'australopithecina', 1, humanSources, 'em-debate', 'genero'),
  node('paranthropus', 'Paranthropus', 'Parantropos', 'australopithecina', 2, humanSources, 'provavel', 'genero'),
  node('homo', 'Homo', 'Humanos', 'australopithecina', 3, humanSources, 'em-debate', 'genero', 'As relações entre as espécies fósseis de Homo não formam uma escada simples.'),
  node('euphyllophyta', 'Euphyllophyta', 'Eufilófitas', 'tracheophyta', 1, ['open-tree-of-life']),
  node('rhyniopsida', 'Rhyniopsida', 'Riniópsidas', 'tracheophyta', 0, ['aberdeen-rhynie']),
  node('rhyniaceae', 'Rhyniaceae', 'Riniáceas', 'rhyniopsida', 0, ['aberdeen-rhynie'], 'estabelecida', 'familia'),
  node('sphenopsida', 'Sphenopsida', 'Esfenopsidas', 'euphyllophyta', 0, ['ucmp-calamites']),
  node('calamitaceae', 'Calamitaceae', 'Calamitáceas', 'sphenopsida', 0, ['ucmp-calamites'], 'estabelecida', 'familia'),
  node('glossopteridales', 'Glossopteridales', 'Glossopteridales', 'spermatophyta', 0, ['nps-glossopteris'], 'provavel', 'ordem'),
  node('glossopteridaceae', 'Glossopteridaceae', 'Glossopteridáceas', 'glossopteridales', 0, ['nps-glossopteris'], 'provavel', 'familia'),
  node('bennettitales', 'Bennettitales', 'Bennettitales', 'gymnospermae', 3, ['smithsonian-cycadeoidea'], 'estabelecida', 'ordem'),
  node('bennettitaceae', 'Bennettitaceae', 'Bennettitáceas', 'bennettitales', 0, ['smithsonian-cycadeoidea'], 'estabelecida', 'familia'),
];

type OrganismSeed = {
  id: string;
  scientific: string;
  authority: string;
  pt: string;
  en?: string;
  aliases?: string[];
  meaning: string;
  kingdom?: 'animalia' | 'plantae';
  categories: string[];
  period: string;
  node: string;
  start: number;
  end: number;
  uncertainty?: 'baixa' | 'media' | 'alta';
  energy: OrganismoAtlas['energia']['modoPrincipal'];
  secondary?: OrganismoAtlas['energia']['modoPrincipal'][];
  measure: { min: number; max: number; type?: OrganismoAtlas['medidas']['itens'][number]['tipo']; unit?: OrganismoAtlas['medidas']['itens'][number]['unidade']; label?: string };
  formation: string;
  region: string;
  country: string;
  source: string;
  description: string;
  memory: string;
  evidence?: OrganismoAtlas['nivelEvidencia'];
};

const living: OrganismSeed[] = [
  { id: 'gorilla-beringei', scientific: 'Gorilla beringei', authority: 'Matschie, 1903', pt: 'Gorila-oriental', meaning: 'gorila de Beringe', categories: ['mamifero', 'primata', 'hominideo'], period: 'quaternario', node: 'gorilla', start: 0.001, end: 0, energy: 'herbivoria', secondary: ['frugivoria', 'folivoria'], measure: { min: 1.2, max: 1.85, type: 'altura', label: 'Altura corporal' }, formation: 'Populações atuais', region: 'África centro-oriental', country: 'República Democrática do Congo, Ruanda e Uganda', source: 'adw-gorilla', description: 'Uma das duas espécies atuais de gorila. Populações vivem em florestas de montanha e de planície na África centro-oriental.', memory: 'Gorilas são nossos parentes vivos, não nossos ancestrais.' },
  { id: 'gorilla-gorilla', scientific: 'Gorilla gorilla', authority: 'Savage, 1847', pt: 'Gorila-ocidental', meaning: 'gorila', categories: ['mamifero', 'primata', 'hominideo'], period: 'quaternario', node: 'gorilla', start: 0.001, end: 0, energy: 'herbivoria', secondary: ['frugivoria', 'folivoria'], measure: { min: 1.2, max: 1.8, type: 'altura', label: 'Altura corporal' }, formation: 'Populações atuais', region: 'África centro-ocidental', country: 'Gabão, Camarões e países vizinhos', source: 'adw-gorilla', description: 'Espécie atual de gorila das florestas da África ocidental e central, com populações e habitats distintos.', memory: 'Duas espécies de gorila ajudam a lembrar que os grandes símios atuais também se ramificam.' },
  { id: 'homo-sapiens', scientific: 'Homo sapiens', authority: 'Linnaeus, 1758', pt: 'Humano moderno', meaning: 'humano sábio', categories: ['mamifero', 'primata', 'hominideo', 'homininio'], period: 'quaternario', node: 'homo', start: 0.315, end: 0, uncertainty: 'media', energy: 'onivoria', measure: { min: 1.4, max: 2.0, type: 'altura', label: 'Altura adulta aproximada' }, formation: 'Registros fósseis e populações atuais', region: 'Origem africana; distribuição global atual', country: 'Global', source: 'homo-sapiens-jebel-irhoud-2017', description: 'Nossa espécie surgiu na África e hoje vive em todos os continentes. Populações humanas sempre estiveram conectadas por migrações e encontros.', memory: 'Todos os humanos vivos pertencem à mesma espécie.' },
  { id: 'pan-paniscus', scientific: 'Pan paniscus', authority: 'Schwarz, 1929', pt: 'Bonobo', meaning: 'Pan pequeno', categories: ['mamifero', 'primata', 'hominideo'], period: 'quaternario', node: 'pan', start: 0.001, end: 0, energy: 'frugivoria', secondary: ['folivoria', 'onivoria'], measure: { min: 0.7, max: 0.83, type: 'altura', label: 'Altura corporal' }, formation: 'Populações atuais', region: 'Bacia do Congo ao sul do rio Congo', country: 'República Democrática do Congo', source: 'adw-pan', description: 'Grande símio atual do gênero Pan, distinto do chimpanzé-comum e restrito à bacia central do Congo.', memory: 'Bonobos e chimpanzés são igualmente parentes próximos dos humanos.' },
  { id: 'pan-troglodytes', scientific: 'Pan troglodytes', authority: 'Blumenbach, 1775', pt: 'Chimpanzé-comum', meaning: 'Pan habitante de cavernas', categories: ['mamifero', 'primata', 'hominideo'], period: 'quaternario', node: 'pan', start: 0.001, end: 0, energy: 'frugivoria', secondary: ['folivoria', 'onivoria'], measure: { min: 0.8, max: 1.2, type: 'altura', label: 'Altura corporal' }, formation: 'Populações atuais', region: 'África equatorial', country: 'Vários países africanos', source: 'adw-pan', description: 'Espécie atual de grande símio africano. Compartilha conosco um ancestral comum, mas não é um ancestral humano.', memory: 'Humanos não vieram dos chimpanzés atuais: os dois ramos têm um ancestral comum.' },
  { id: 'pongo-abelii', scientific: 'Pongo abelii', authority: 'Lesson, 1827', pt: 'Orangotango-de-sumatra', meaning: 'Pongo de Abel', categories: ['mamifero', 'primata', 'hominideo'], period: 'quaternario', node: 'pongo', start: 0.001, end: 0, energy: 'frugivoria', secondary: ['folivoria'], measure: { min: 1.1, max: 1.5, type: 'altura', label: 'Altura corporal' }, formation: 'Populações atuais', region: 'Norte de Sumatra', country: 'Indonésia', source: 'adw-pongo', description: 'Uma das três espécies atuais de orangotango, adaptada à vida nas florestas de Sumatra.', memory: 'Orangotangos formam um ramo asiático dos grandes símios.' },
  { id: 'pongo-pygmaeus', scientific: 'Pongo pygmaeus', authority: 'Linnaeus, 1760', pt: 'Orangotango-de-bornéu', meaning: 'Pongo pigmeu', categories: ['mamifero', 'primata', 'hominideo'], period: 'quaternario', node: 'pongo', start: 0.001, end: 0, energy: 'frugivoria', secondary: ['folivoria'], measure: { min: 1.1, max: 1.5, type: 'altura', label: 'Altura corporal' }, formation: 'Populações atuais', region: 'Ilha de Bornéu', country: 'Indonésia e Malásia', source: 'adw-pongo', description: 'Espécie atual de orangotango de Bornéu. O desmatamento ameaça populações que dependem da floresta.', memory: 'Uma ilha pode abrigar um ramo próprio da árvore da vida.' },
  { id: 'pongo-tapanuliensis', scientific: 'Pongo tapanuliensis', authority: 'Nurcahyo et al., 2017', pt: 'Orangotango-de-tapanuli', meaning: 'Pongo de Tapanuli', categories: ['mamifero', 'primata', 'hominideo'], period: 'quaternario', node: 'pongo', start: 0.001, end: 0, energy: 'frugivoria', secondary: ['folivoria'], measure: { min: 1.1, max: 1.5, type: 'altura', label: 'Altura corporal' }, formation: 'Populações atuais', region: 'Batang Toru, Sumatra', country: 'Indonésia', source: 'adw-pongo', description: 'Espécie reconhecida em 2017 a partir de evidências morfológicas e genéticas de uma pequena população de Sumatra.', memory: 'A taxonomia também muda quando novas evidências aparecem.' },
];

const fossilHumans: OrganismSeed[] = [
  ['sahelanthropus-tchadensis','Sahelanthropus tchadensis','Brunet et al., 2002','Sahelanthropus','homem do Sahel','sahelanthropus-lineage',7,6,'Chade','África central','Crânio e partes cranianas mostram uma combinação antiga de características; sua posição exata perto da base dos hominínios continua debatida.'],
  ['orrorin-tugenensis','Orrorin tugenensis','Senut et al., 2001','Orrorin','homem original de Tugen','orrorin-lineage',6.2,5.8,'Formação Lukeino','Quênia','Ossos do fêmur e dentes são usados para discutir locomoção e dieta, com relações filogenéticas ainda incertas.'],
  ['ardipithecus-kadabba','Ardipithecus kadabba','Haile-Selassie, 2001','Ardipithecus kadabba','Ardipithecus ancestral basal','ardipithecus',5.8,5.2,'Afar','Etiópia','Conhecido por dentes e partes do esqueleto, representa um ramo muito antigo próximo à origem dos hominínios.'],
  ['ardipithecus-ramidus','Ardipithecus ramidus','White, Suwa & Asfaw, 1994','Ardi','símio do chão na raiz','ardipithecus',4.5,4.3,'Aramis','Etiópia','O esqueleto parcial Ardi combina adaptações para subir em árvores e deslocar-se no solo.'],
  ['australopithecus-anamensis','Australopithecus anamensis','Leakey et al., 1995','Australopithecus anamensis','símio austral do lago','australopithecus',4.2,3.8,'Kanapoi e Allia Bay','Quênia e Etiópia','Mandíbulas, dentes e ossos de membros registram um australopiteco muito antigo.'],
  ['australopithecus-afarensis','Australopithecus afarensis','Johanson, White & Coppens, 1978','Australopithecus afarensis','símio austral de Afar','australopithecus',3.85,2.95,'Hadar e Laetoli','Etiópia e Tanzânia','Inclui Lucy e fósseis associados a locomoção bípede, embora ainda conservasse adaptações para escalar.'],
  ['australopithecus-africanus','Australopithecus africanus','Dart, 1925','Australopithecus africanus','símio austral africano','australopithecus',3.3,2.1,'Taung, Sterkfontein e Makapansgat','África do Sul','Crânios e esqueletos mostram bipedalismo e um mosaico de características faciais e dentárias.'],
  ['australopithecus-garhi','Australopithecus garhi','Asfaw et al., 1999','Australopithecus garhi','símio austral surpresa','australopithecus',2.55,2.45,'Bouri','Etiópia','Espécie conhecida por poucos fósseis; sua relação com Homo permanece incerta.'],
  ['australopithecus-sediba','Australopithecus sediba','Berger et al., 2010','Australopithecus sediba','símio austral da fonte','australopithecus',1.99,1.97,'Malapa','África do Sul','Esqueletos bem preservados combinam características australopitecíneas e outras semelhantes às de Homo.'],
  ['paranthropus-aethiopicus','Paranthropus aethiopicus','Arambourg & Coppens, 1968','Paranthropus aethiopicus','parente do homem da Etiópia','paranthropus',2.7,2.3,'Omo e Turkana','Etiópia e Quênia','Crânio e mandíbulas robustas ajudam a estudar a diversificação dos parantropos.'],
  ['paranthropus-boisei','Paranthropus boisei','Leakey, 1959','Paranthropus boisei','parente do homem de Boise','paranthropus',2.3,1.2,'Olduvai, Koobi Fora e Omo','África oriental','Grandes dentes posteriores e uma face robusta indicam especializações mastigatórias, sem definir sozinhos uma dieta única.'],
  ['paranthropus-robustus','Paranthropus robustus','Broom, 1938','Paranthropus robustus','parente robusto do homem','paranthropus',2.0,1.2,'Swartkrans, Kromdraai e Drimolen','África do Sul','Fósseis cranianos e dentários registram um ramo robusto sul-africano.'],
  ['kenyanthropus-platyops','Kenyanthropus platyops','Leakey et al., 2001','Kenyanthropus','homem de face plana do Quênia','kenyanthropus',3.5,3.2,'Lomekwi','Quênia','A face relativamente plana motivou um novo gênero, mas a deformação do fóssil e sua posição continuam debatidas.'],
  ['homo-habilis','Homo habilis','Leakey et al., 1964','Homo habilis','humano habilidoso','homo',2.4,1.4,'Olduvai e Koobi Fora','Tanzânia e Quênia','Fósseis variados foram reunidos sob este nome; limites com outras espécies de Homo ainda são discutidos.'],
  ['homo-rudolfensis','Homo rudolfensis','Alexeev, 1986','Homo rudolfensis','humano do lago Rudolf','homo',1.9,1.8,'Koobi Fora','Quênia','Crânios atribuídos à espécie diferem de H. habilis, mas a amostra e a classificação continuam debatidas.'],
  ['homo-erectus','Homo erectus','Dubois, 1892','Homo erectus','humano ereto','homo',1.89,0.11,'África, Cáucaso e Ásia','África e Eurásia','Foi um dos hominínios mais duradouros e geograficamente amplos, com grande variação entre fósseis.'],
  ['homo-heidelbergensis','Homo heidelbergensis','Schoetensack, 1908','Homo heidelbergensis','humano de Heidelberg','homo',0.7,0.2,'Sítios da África e Europa','África e Europa','Nome usado para fósseis do Pleistoceno Médio; quais exemplares pertencem à espécie é tema de debate.'],
  ['homo-neanderthalensis','Homo neanderthalensis','King, 1864','Neandertal','humano do vale de Neander','homo',0.4,0.04,'Cavernas e sítios da Eurásia ocidental','Europa e Ásia ocidental','Parentes humanos próximos, adaptados a ambientes variados e ligados a humanos modernos por fluxo gênico.'],
  ['homo-naledi','Homo naledi','Berger et al., 2015','Homo naledi','humano estrela','homo',0.335,0.236,'Dinaledi e Lesedi','África do Sul','Muitos ossos revelam uma combinação incomum de características; sua posição na árvore de Homo permanece incerta.'],
  ['homo-floresiensis','Homo floresiensis','Brown et al., 2004','Homo floresiensis','humano de Flores','homo',0.1,0.05,'Caverna Liang Bua','Indonésia','Fósseis de pequeno porte encontrados na ilha de Flores mostram uma história insular singular.'],
].map(([id, scientific, authority, pt, meaning, lineageNode, start, end, formation, region, description]) => ({
  id, scientific, authority, pt, meaning, categories: ['mamifero', 'primata', 'hominideo', 'homininio'],
  period: Number(start) > 2.58 ? 'neogeno' : 'quaternario', node: lineageNode, start: Number(start), end: Number(end),
  uncertainty: 'media', energy: 'onivoria', measure: { min: 1, max: 1.8, type: 'altura', label: 'Estatura aproximada' },
  formation, region, country: region, source: 'smithsonian-human-species', description,
  memory: 'A árvore humana tem muitos ramos contemporâneos e incertos; não é uma fila de progresso.',
  evidence: 'em-debate',
})) as OrganismSeed[];

const broadLife: OrganismSeed[] = [
  { id: 'dickinsonia-costata', scientific: 'Dickinsonia costata', authority: 'Sprigg, 1947', pt: 'Dickinsonia', meaning: 'organismo de Dickinson', categories: ['animal-ediacarano'], period: 'ediacarano', node: 'dickinsoniidae', start: 558, end: 555, uncertainty: 'media', energy: 'desconhecida', measure: { min: 3, max: 140, type: 'comprimento', unit: 'cm', label: 'Comprimento preservado' }, formation: 'Ediacara Member', region: 'Austrália do Sul e outros registros ediacaranos', country: 'Austrália', source: 'dickinsonia-biomarker-2018', description: 'Corpo achatado e segmentado conhecido por impressões. Biomarcadores apoiam afinidade animal, mas sua posição exata continua incerta.', memory: 'Nem todo animal antigo tinha ossos, dentes ou olhos reconhecíveis.', evidence: 'interpretado' },
  { id: 'anomalocaris-canadensis', scientific: 'Anomalocaris canadensis', authority: 'Whiteaves, 1892', pt: 'Anomalocaris', meaning: 'camarão estranho do Canadá', categories: ['artropode'], period: 'cambriano', node: 'anomalocarididae', start: 509, end: 505, uncertainty: 'media', energy: 'carnivoria', measure: { min: 0.4, max: 1, type: 'comprimento', unit: 'm', label: 'Comprimento estimado' }, formation: 'Burgess Shale', region: 'Colúmbia Britânica', country: 'Canadá', source: 'rom-anomalocaris', description: 'Radiodonte marinho com apêndices frontais, olhos compostos e boca circular, reconstruído a partir de partes antes confundidas com animais separados.', memory: 'Fósseis fragmentados podem parecer espécies diferentes até serem montados como um corpo.' },
  { id: 'tiktaalik-roseae', scientific: 'Tiktaalik roseae', authority: 'Daeschler, Shubin & Jenkins, 2006', pt: 'Tiktaalik', meaning: 'grande peixe de água rasa', categories: ['tetrapodomorfo'], period: 'devoniano', node: 'elpistostegalia', start: 375, end: 374, uncertainty: 'baixa', energy: 'carnivoria', measure: { min: 1.2, max: 2.7, type: 'comprimento', unit: 'm', label: 'Comprimento estimado' }, formation: 'Fram Formation', region: 'Ilha Ellesmere, Nunavut', country: 'Canadá', source: 'tiktaalik-2006', description: 'Peixe de nadadeiras lobadas com pescoço móvel e ossos de nadadeira comparáveis aos membros dos tetrápodes.', memory: 'Transições evolutivas são mosaicos: estruturas novas surgem enquanto outras antigas permanecem.' },
  { id: 'acanthostega-gunnari', scientific: 'Acanthostega gunnari', authority: 'Jarvik, 1952', pt: 'Acanthostega', meaning: 'teto espinhoso de Gunnar', categories: ['tetrapode-inicial'], period: 'devoniano', node: 'acanthostegidae', start: 365, end: 363, uncertainty: 'media', energy: 'carnivoria', measure: { min: 0.5, max: 0.7, type: 'comprimento', unit: 'm', label: 'Comprimento estimado' }, formation: 'Aina Dal Formation', region: 'Groenlândia Oriental', country: 'Groenlândia', source: 'acanthostega-2002', description: 'Tetrápode inicial com oito dedos em cada membro e muitas adaptações aquáticas.', memory: 'Ter dedos não significou abandonar imediatamente a água.' },
  { id: 'rhynia-gwynne-vaughanii', scientific: 'Rhynia gwynne-vaughanii', authority: 'Kidston & Lang, 1917', pt: 'Rhynia', meaning: 'planta de Rhynie', kingdom: 'plantae', categories: ['planta-vascular-inicial'], period: 'devoniano', node: 'rhyniaceae', start: 411, end: 407, uncertainty: 'baixa', energy: 'fotossintese', measure: { min: 15, max: 20, type: 'altura', unit: 'cm', label: 'Altura estimada' }, formation: 'Rhynie Chert', region: 'Aberdeenshire, Escócia', country: 'Reino Unido', source: 'aberdeen-rhynie', description: 'Planta vascular pequena, sem folhas verdadeiras, preservada em sílica com detalhes celulares extraordinários.', memory: 'Uma planta simples pode preservar uma anatomia microscópica excepcional.' },
  { id: 'calamites-suckowii', scientific: 'Calamites suckowii', authority: 'Brongniart, 1828', pt: 'Calamites', meaning: 'caule semelhante a junco', kingdom: 'plantae', categories: ['esfenopsida'], period: 'carbonifero', node: 'calamitaceae', start: 323, end: 299, uncertainty: 'media', energy: 'fotossintese', measure: { min: 10, max: 30, type: 'altura', unit: 'm', label: 'Altura estimada' }, formation: 'Depósitos de carvão do Carbonífero', region: 'Laurússia tropical', country: 'Registros na Europa e América do Norte', source: 'ucmp-calamites', description: 'Parente arborescente das cavalinhas, com caules articulados e crescimento em florestas pantanosas.', memory: 'As cavalinhas atuais são pequenas parentes de formas que já foram árvores.' },
  { id: 'glossopteris-indica', scientific: 'Glossopteris indica', authority: 'Schimper, 1869', pt: 'Glossopteris', meaning: 'folha em forma de língua da Índia', kingdom: 'plantae', categories: ['pteridosperma'], period: 'permiano', node: 'glossopteridaceae', start: 299, end: 252, uncertainty: 'media', energy: 'fotossintese', measure: { min: 5, max: 30, type: 'folha', unit: 'cm', label: 'Comprimento da folha' }, formation: 'Camadas permianas de Gondwana', region: 'América do Sul, África, Índia, Antártica e Austrália', country: 'Gondwana', source: 'nps-glossopteris', description: 'Planta com sementes conhecida por folhas em forma de língua; sua ampla distribuição ajudou a demonstrar a antiga união dos continentes austrais.', memory: 'O mesmo tipo de folha em continentes distantes foi pista para reconstruir Gondwana.' },
  { id: 'cycadeoidea', scientific: 'Cycadeoidea', authority: 'Buckland, 1828', pt: 'Cycadeoidea', meaning: 'semelhante a uma cicadácea', kingdom: 'plantae', categories: ['bennettital'], period: 'jurasico', node: 'bennettitaceae', start: 161, end: 100, uncertainty: 'alta', energy: 'fotossintese', measure: { min: 0.5, max: 2, type: 'altura', unit: 'm', label: 'Altura estimada' }, formation: 'Depósitos jurássicos e cretáceos', region: 'Registros em vários continentes', country: 'Distribuição ampla', source: 'smithsonian-cycadeoidea', description: 'Gênero de bennettitales com troncos robustos e estruturas reprodutivas complexas, superficialmente parecido com cicadáceas.', memory: 'Parecer com uma planta atual não significa pertencer ao mesmo ramo.' },
];

function makeOrganism(seed: OrganismSeed): OrganismoAtlas {
  const kingdom = seed.kingdom ?? 'animalia';
  const sourceIds = kingdom === 'animalia' && seed.categories.includes('hominideo')
    ? [...new Set([seed.source, 'smithsonian-human-species', 'great-ape-phylogenomics-2013', ...(seed.end === 0 ? ['mdd-hominidae'] : [])])]
    : [seed.source, 'pbdb-1-2'];
  const measureSource = seed.source;
  const unit = seed.measure.unit ?? 'm';
  return {
    id: seed.id,
    nomeCientifico: seed.scientific,
    autoridadeTaxonomica: seed.authority,
    nomePt: seed.pt,
    nomeEn: seed.en ?? seed.scientific,
    aliases: seed.aliases ?? [],
    significadoNome: seed.meaning,
    reino: kingdom,
    categoriaIds: seed.categories,
    periodoIds: [seed.period],
    noFilogeneticoId: seed.node,
    energia: {
      modoPrincipal: seed.energy,
      modosSecundarios: seed.secondary ?? [],
      incerteza: seed.uncertainty ?? 'media',
      fonteIds: [measureSource],
    },
    intervalo: {
      inicioMa: seed.start,
      fimMa: seed.end,
      incerteza: seed.uncertainty ?? 'media',
      significado: seed.end === 0
        ? 'A espécie vive no presente. Esta barra não representa a data em que a espécie se originou.'
        : 'Intervalo aproximado dos fósseis atribuídos à espécie; não é uma duração exata.',
      fonteIds: [seed.end === 0 && seed.id !== 'homo-sapiens' ? 'mdd-hominidae' : seed.source],
    },
    medidas: {
      itens: [{
        min: seed.measure.min,
        max: seed.measure.max,
        tipo: seed.measure.type ?? 'comprimento',
        unidade: unit,
        rotuloPt: seed.measure.label ?? 'Medida estimada',
      }],
      observacao: 'Faixa educativa arredondada; indivíduos e estimativas publicados podem variar.',
      fonteIds: [measureSource],
    },
    ocorrencias: [{ formacao: seed.formation, regiao: seed.region, pais: seed.country }],
    resumo: `${seed.pt} integra o ramo ${seed.node.replaceAll('-', ' ')} da árvore da vida.`,
    descricao: seed.description,
    memoria: seed.memory,
    nivelEvidencia: seed.evidence ?? 'bem-estabelecido',
    fonteIds: sourceIds,
    mediaIds: [`${seed.id}-evidencia`, `${seed.id}-interpretacao`, `${seed.id}-${kingdom === 'plantae' ? 'morfologia' : 'escala'}`],
    mediaPrincipalId: `${seed.id}-evidencia`,
    especimeIds: [],
    relacoes: [],
    revisao: { status: 'em-revisao', revisadoEm: reviewedAt, observacoes: 'Aprovação automática somente após mídia, validação e relatório do lote.' },
  };
}

const newPeriods: Periodo[] = [{
  id: 'ediacarano',
  eraId: 'proterozoico',
  nomeCientifico: 'Ediacaran',
  nomePt: 'Ediacarano',
  nomeEn: 'Ediacaran',
  inicioMa: 635,
  fimMa: 538.8,
  descricaoCurta: 'Organismos multicelulares de corpo mole deixaram impressões antes da grande diversificação cambriana.',
}];

const categories = read<CategoriaEditorial>('categorias.json');
const sources = read<FonteCientifica>('fontes.json');
const periods = read<Periodo>('periodos.json');
const nodes = read<NoFilogenetico>('filogenia.json');
const organisms = read<OrganismoAtlas>('organismos.json');

const allNewOrganisms = [...living, ...fossilHumans, ...broadLife].map(makeOrganism);
if (allNewOrganisms.length !== 36) throw new Error(`A Meta 72 exige exatamente 36 novas fichas; encontrado: ${allNewOrganisms.length}.`);

const updatedNodes = upsert(nodes, newNodes).map((item) => {
  if (item.id === 'amniota') return { ...item, paiId: 'tetrapoda', ordemVisual: 1 };
  if (item.id === 'spermatophyta') return { ...item, paiId: 'euphyllophyta', ordemVisual: 1 };
  if (item.id === 'chordata') return { ...item, ordemVisual: 2 };
  return item;
});

write('periodos.json', upsert(periods, newPeriods));
write('fontes.json', upsert(sources, newSources));
write('filogenia.json', updatedNodes);
write('organismos.json', upsert(organisms, allNewOrganisms));
write('categorias.json', categories);

console.log(`Meta 72 semeada: ${allNewOrganisms.length} candidatos, ${newNodes.length} nós e ${newSources.length} fontes editoriais.`);
