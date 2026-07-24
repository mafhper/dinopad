import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { BlocoEditorial, Publicacao } from '../../src/content/schema';
import { dataDir } from './io';

const reviewedAt = '2026-07-24';
const publicationsPath = resolve(dataDir, 'publicacoes.json');

function paragraph(id: string, titulo: string, texto: string): BlocoEditorial {
  return { id, tipo: 'paragrafo', titulo, texto };
}

function highlight(id: string, titulo: string, texto: string): BlocoEditorial {
  return { id, tipo: 'destaque', titulo, texto };
}

function list(id: string, titulo: string, itens: string[]): BlocoEditorial {
  return { id, tipo: 'lista', titulo, itens };
}

type Revision = Pick<Publicacao, 'camadaAprofundar' | 'camadaEssencial' | 'minutosLeitura'> & {
  fonteIds?: string[];
  notaEditorial?: string;
};

const revisions: Record<string, Revision> = {
  'arvore-ou-escada': {
    minutosLeitura: 8,
    fonteIds: ['smithsonian-human-species', 'smithsonian-human-genetics'],
    camadaEssencial: [
      highlight(
        'arvore-ou-escada-essencial-1',
        'A ideia principal',
        'A evolução não é uma fila que sobe em direção aos humanos. Ela se parece mais com uma árvore: populações se separam, ramos coexistem e muitos terminam sem deixar descendentes atuais.',
      ),
      paragraph(
        'arvore-ou-escada-essencial-2',
        'Como ler o desenho',
        'As pontas representam os grupos estudados; os encontros entre galhos representam ancestrais comuns inferidos. A posição no alto ou à direita não significa ser melhor, mais inteligente ou “mais evoluído”.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'arvore-ou-escada-aprofundar-1',
        'A fila parece simples — e por isso engana',
        'Talvez você já tenha visto uma sequência que começa com um animal curvado e termina em uma pessoa andando ereta. A imagem parece contar uma história clara, mas mistura parentesco, passagem do tempo e uma ideia de progresso. Evolução não possui uma linha de chegada. Populações vivem em ambientes concretos, acumulam diferenças e às vezes se dividem. Enquanto um ramo muda, outros continuam existindo. Uma fila apaga essa coexistência e transforma parentes próximos em degraus.',
      ),
      paragraph(
        'arvore-ou-escada-aprofundar-2',
        'Um galho é uma hipótese que pode ser testada',
        'Para construir uma filogenia, pesquisadores comparam características herdadas. Em fósseis, podem ser detalhes dos dentes, do crânio, da bacia ou dos membros; em organismos atuais e em alguns fósseis recentes, sequências de DNA também entram na análise. Programas calculam quais arranjos explicam melhor o conjunto de semelhanças e diferenças. Novas espécies, novos fósseis ou outro método podem mudar o desenho. Isso não torna a árvore inútil: mostra que ela registra a melhor hipótese sustentada pelos dados disponíveis.',
      ),
      paragraph(
        'arvore-ou-escada-aprofundar-3',
        'O nó não é uma espécie conhecida',
        'Quando dois galhos se encontram, o nó representa o ancestral comum mais recente inferido para aqueles grupos. Em geral, não sabemos qual população fóssil ocupava exatamente esse ponto. Por isso o Dinopad não apresenta Tyrannosaurus como ancestral de uma ave atual nem um australopiteco conhecido como “o avô” de Homo sapiens. Uma espécie fóssil pode estar perto do ramo ancestral sem ser, necessariamente, a ancestral direta.',
      ),
      paragraph(
        'arvore-ou-escada-aprofundar-4',
        'Primos podem viver ao mesmo tempo',
        'Parentesco não obriga uma espécie a desaparecer quando outra surge. Homo sapiens conviveu com Neandertais e com populações denisovanas; em períodos mais antigos, várias espécies de australopitecos e de Paranthropus também ocuparam intervalos sobrepostos. O mesmo vale para a história dos dinossauros: dois ramos próximos podem dividir uma paisagem ou viver separados por oceanos. A árvore diz quem compartilha ancestrais mais recentes; a linha do tempo diz quando houve coexistência.',
      ),
      paragraph(
        'arvore-ou-escada-aprofundar-5',
        'Quando a resposta ainda tem mais de uma forma',
        'Às vezes os dados sustentam um grupo, mas não resolvem qual separação ocorreu primeiro. O desenho então pode mostrar uma polytomia, com três ou mais galhos partindo do mesmo ponto. Isso não afirma que as separações aconteceram no mesmo instante. É uma maneira honesta de registrar que a ordem continua incerta. Galhos tracejados e notas de debate cumprem função parecida: deixam a dúvida visível em vez de escondê-la.',
      ),
      paragraph(
        'arvore-ou-escada-aprofundar-6',
        'Uma árvore de genes pode contar outra história',
        'Cada trecho de DNA percorre sua própria genealogia. Por recombinação, acaso e fluxo gênico, uma árvore construída com um gene pode discordar da história predominante das populações. Pesquisadores comparam muitos trechos e somam fósseis, geografia e datação. É por isso que as conexões entre humanos modernos, Neandertais e Denisovanos aparecem sobre a árvore do Dinopad: houve troca de genes, mas isso não transforma a relação em uma escada nem em um único galho.',
      ),
      list(
        'arvore-ou-escada-aprofundar-7',
        'Três perguntas para levar a qualquer árvore',
        [
          'Quais organismos ou fósseis foram comparados e quais evidências sustentam os galhos?',
          'O comprimento dos ramos representa tempo, quantidade de mudança ou apenas espaço para organizar o desenho?',
          'Onde a incerteza está registrada — em polytomias, linhas tracejadas, notas ou diferentes hipóteses?',
        ],
      ),
    ],
  },
  'familia-humana': {
    minutosLeitura: 8,
    fonteIds: ['mdd-hominidae', 'smithsonian-human-species'],
    camadaEssencial: [
      highlight(
        'familia-humana-essencial-1',
        'Uma família compartilhada',
        'Hominidae reúne os grandes símios atuais — orangotangos, gorilas, chimpanzés, bonobos e humanos — e seus parentes extintos. “Hominídeo” não é sinônimo de “humano antigo”.',
      ),
      paragraph(
        'familia-humana-essencial-2',
        'Um ramo mais estreito',
        'Hominínios, no uso adotado pelo Dinopad, são os membros do ramo humano depois da separação do ramo de chimpanzés e bonobos. A posição de fósseis muito antigos ainda pode ser debatida.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'familia-humana-aprofundar-1',
        'Nossa família começa maior do que parece',
        'Na linguagem cotidiana, “família humana” pode sugerir somente pessoas. Na classificação biológica, porém, a família Hominidae inclui todos os grandes símios atuais. Isso quer dizer que humanos não estão fora da natureza nem no topo de uma classificação: somos uma das espécies desse conjunto. A Mammal Diversity Database reconhece hoje oito espécies viventes na família, distribuídas entre Homo, Pan, Gorilla e Pongo.',
      ),
      paragraph(
        'familia-humana-aprofundar-2',
        'Grupos dentro de grupos',
        'Os nomes funcionam como caixas aninhadas. Hominidae contém os grandes símios. Homininae reúne gorilas, chimpanzés, bonobos, humanos e parentes mais próximos, deixando os orangotangos em outro ramo. Hominini aproxima o ramo de Pan do ramo humano. Hominina, ou hominínios em português, designa o ramo humano depois da separação em relação a Pan. Por fim, Homo é apenas um gênero dentro dessa história muito mais antiga.',
      ),
      paragraph(
        'familia-humana-aprofundar-3',
        'Por que as palavras confundem',
        'Hominídeo, hominíneo e hominínio diferem por poucas letras e nem todos os livros traduzem os níveis da mesma forma. Em textos antigos, “hominídeo” muitas vezes foi usado para o que hoje se chama hominínio. O caminho mais seguro é observar o nome científico do grupo — Hominidae, Homininae ou Hominina — e a definição dada pelo autor. O glossário do Dinopad informa o uso escolhido sem fingir que a terminologia histórica sempre foi uniforme.',
      ),
      paragraph(
        'familia-humana-aprofundar-4',
        'Onde entram os fósseis',
        'Espécies fósseis são posicionadas pela combinação de idade, lugar e anatomia preservada. Sahelanthropus, Orrorin e Ardipithecus estão próximos da base do ramo humano, mas suas posições exatas continuam discutidas. Australopithecus e Paranthropus mostram outra dificuldade: uma espécie pode combinar traços semelhantes aos de grupos diferentes. Um crânio, um dente ou uma bacia não recebe sozinho o poder de resolver toda a árvore.',
      ),
      paragraph(
        'familia-humana-aprofundar-5',
        '“Humano” pode ter dois sentidos',
        'Em conversa, humano normalmente significa Homo sapiens, a única espécie humana viva. Em paleoantropologia, alguns autores usam “humanos” para todo o gênero Homo, incluindo Neandertais, Homo erectus e outras espécies. O contexto precisa deixar claro qual sentido está em jogo. Chamar um fóssil de humano também não significa que ele pensava, falava ou vivia exatamente como nós; cada afirmação comportamental exige evidência própria.',
      ),
      paragraph(
        'familia-humana-aprofundar-6',
        'Classificar não é distribuir medalhas',
        'Categorias taxonômicas descrevem parentesco, não valor, inteligência ou importância. Chimpanzés atuais não são nossos ancestrais: eles e nós descendemos de populações ancestrais compartilhadas. Gorilas não são versões “anteriores” de chimpanzés. E fósseis com cérebros menores não ocupam automaticamente posições mais antigas. O tamanho do cérebro, a postura e a fabricação de ferramentas tiveram histórias diferentes e não formam um pacote que avança em uma só direção.',
      ),
      paragraph(
        'familia-humana-aprofundar-7',
        'Uma classificação é uma fotografia revisável',
        'Novos fósseis podem revelar combinações inesperadas; novos genomas podem mostrar fluxo gênico; revisões podem unir ou separar espécies propostas. Bases taxonômicas registram decisões atuais, enquanto artigos explicam as evidências e divergências. No Dinopad, uma mudança de nome ou de posição deve trazer fonte e data de revisão. A árvore fica mais útil quando mostra tanto o que é bem sustentado quanto o que continua em debate.',
      ),
    ],
  },
  'eva-mitocondrial-explicada': {
    minutosLeitura: 8,
    fonteIds: ['cann-mtdna-1987', 'smithsonian-human-genetics'],
    camadaEssencial: [
      highlight(
        'eva-mitocondrial-explicada-essencial-1',
        'Uma ancestral de uma linha genética',
        'Seguindo para trás o DNA das mitocôndrias de pessoas atuais, as linhagens acabam convergindo em uma ancestral comum. O apelido “Eva mitocondrial” descreve esse resultado genealógico.',
      ),
      paragraph(
        'eva-mitocondrial-explicada-essencial-2',
        'O apelido não diz',
        'Ela não foi a primeira mulher, a única mulher viva nem nossa única ancestral. Outras pessoas de seu tempo podem ser ancestrais de todos nós por milhares de outros caminhos no genoma.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'eva-mitocondrial-explicada-aprofundar-1',
        'Comece pelas mitocôndrias',
        'Quase todas as células do corpo possuem mitocôndrias, estruturas que ajudam a liberar energia dos alimentos. Elas carregam um pequeno genoma próprio, separado da maior parte do DNA que fica no núcleo. Em humanos, esse DNA mitocondrial costuma ser transmitido pela mãe. Filhos e filhas o recebem, mas em geral apenas as filhas continuam essa linha de transmissão. Essa regra cria uma trilha genealógica particular, não um retrato de toda a ancestralidade.',
      ),
      paragraph(
        'eva-mitocondrial-explicada-aprofundar-2',
        'Voltar no tempo é juntar linhas',
        'Imagine várias cópias atuais de DNA mitocondrial. Ao seguir suas transmissões para trás, algumas linhas se encontram em mães compartilhadas; continuando, todas as linhas amostradas convergem em uma mulher. Esse encontro recebe o nome de coalescência. A identidade exata da pessoa é desconhecida: o resultado é uma posição calculada em uma genealogia genética, estimada com amostras, modelos de mutação e hipóteses sobre populações.',
      ),
      paragraph(
        'eva-mitocondrial-explicada-aprofundar-3',
        'Por que ela não era a única mulher',
        'Uma linhagem mitocondrial pode terminar mesmo quando a família continua. Basta que, em algum ponto, uma mulher tenha apenas filhos homens, ou que suas filhas não transmitam aquela linhagem adiante. Outras mulheres que viveram na mesma época podem ter deixado muitos descendentes por cromossomos nucleares, mas nenhuma linha mitocondrial contínua até as pessoas amostradas hoje. “Ancestral comum desta linhagem” é muito diferente de “única ancestral”.',
      ),
      paragraph(
        'eva-mitocondrial-explicada-aprofundar-4',
        'Seu genoma contém muitas genealogias',
        'O DNA nuclear mistura cópias recebidas de mães e pais e é embaralhado pela recombinação. Por isso, cada trecho pode chegar a ancestrais comuns em épocas diferentes. O cromossomo Y, quando transmitido de pai para filho, permite seguir outra linha específica e produz outro ancestral comum. Nenhum desses resultados identifica um casal original. Quanto mais partes do genoma observamos, mais percebemos uma rede enorme de ancestrais sobrepostos.',
      ),
      paragraph(
        'eva-mitocondrial-explicada-aprofundar-5',
        'O que o estudo de 1987 realmente fez',
        'Cann, Stoneking e Wilson compararam DNA mitocondrial de 147 pessoas associadas a diferentes populações geográficas usando técnicas disponíveis antes do sequenciamento genômico atual. As amostras africanas apresentaram maior diversidade, e a árvore calculada apoiou uma origem africana recente para as linhagens mitocondriais estudadas. O trabalho foi historicamente importante, mas suas amostras, métodos e datas foram revistos por pesquisas posteriores.',
      ),
      paragraph(
        'eva-mitocondrial-explicada-aprofundar-6',
        'Datas genéticas vêm com condições',
        'Para transformar diferenças de DNA em tempo, é preciso estimar a velocidade com que mutações se acumulam e usar modelos sobre tamanho e história das populações. Mudanças na taxa, nas amostras ou no modelo deslocam o resultado. Por isso estudos atuais apresentam intervalos de incerteza, e não o aniversário de uma pessoa. “Eva mitocondrial” pode até mudar de posição à medida que novas linhagens são amostradas ou antigas deixam de ter descendentes.',
      ),
      paragraph(
        'eva-mitocondrial-explicada-aprofundar-7',
        'O melhor jeito de usar o apelido',
        'O nome é memorável, mas carrega uma comparação bíblica que facilmente cria conclusões erradas. Ao encontrá-lo, complete mentalmente a frase: “ancestral comum mais recente, pela linha materna mitocondrial, das pessoas incluídas na análise”. A expressão fica menos misteriosa e mais científica. Ela conta uma história importante sobre uma parte do DNA, não uma origem solitária de toda a humanidade.',
      ),
    ],
  },
  'migracoes-e-encontros': {
    minutosLeitura: 9,
    fonteIds: ['green-neanderthal-2010', 'reich-denisovan-2010', 'smithsonian-human-genetics'],
    camadaEssencial: [
      highlight(
        'migracoes-e-encontros-essencial-1',
        'Movimentos em muitas direções',
        'Homo sapiens surgiu na África, mas a história posterior não foi uma única saída em linha reta. Populações se expandiram, se separaram, voltaram e encontraram outros grupos humanos.',
      ),
      paragraph(
        'migracoes-e-encontros-essencial-2',
        'Ramos que voltaram a se tocar',
        'Genomas antigos mostraram fluxo gênico entre ancestrais de humanos modernos, Neandertais e Denisovanos. A árvore descreve separações; conexões adicionais registram os reencontros.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'migracoes-e-encontros-aprofundar-1',
        'A origem africana não cabe em uma única seta',
        'Os fósseis mais antigos atribuídos a Homo sapiens são africanos, e a diversidade genética atual também sustenta raízes profundas no continente. Isso não significa que uma pequena população surgiu em um ponto isolado e marchou diretamente para ocupar o mundo. Diferentes populações africanas trocaram pessoas e genes por longos períodos. Fora da África também houve expansões, recuos e novas dispersões. Um mapa com uma seta é um resumo útil, mas nunca a viagem inteira.',
      ),
      paragraph(
        'migracoes-e-encontros-aprofundar-2',
        'O genoma Neandertal mudou a pergunta',
        'Antes de 2010, fósseis já mostravam que Neandertais e humanos modernos haviam vivido em regiões próximas. O rascunho do genoma Neandertal permitiu comparar milhões de posições de DNA. Populações atuais fora da África compartilhavam mais variantes com Neandertais do que as populações africanas usadas naquela análise. O padrão foi interpretado como fluxo gênico entre Neandertais e ancestrais de parte dos humanos modernos depois de uma dispersão para fora da África.',
      ),
      paragraph(
        'migracoes-e-encontros-aprofundar-3',
        'Denisova revelou uma população quase invisível aos ossos',
        'Um pequeno fragmento de falange encontrado na caverna de Denisova preservou DNA suficiente para revelar uma linhagem diferente. O genoma publicado em 2010 mostrou parentesco próximo com Neandertais, mas uma história populacional própria. Também encontrou contribuição denisovana em ancestrais de populações atuais da Melanésia estudadas naquele momento. Depois, outras amostras e genomas mostraram que os encontros foram mais variados do que um único episódio.',
      ),
      paragraph(
        'migracoes-e-encontros-aprofundar-4',
        'Ter um segmento não é ser uma porcentagem de outra espécie',
        'Quando pessoas dizem que alguém é “dois por cento Neandertal”, estão resumindo segmentos do genoma cuja história se aproxima de genomas neandertais de referência. Indivíduos carregam conjuntos diferentes, e uma população pode preservar coletivamente muito mais variação do que qualquer pessoa sozinha. Esses segmentos não dividem uma identidade em fatias nem dizem como alguém se parece, pensa ou vive. Eles registram ancestrais e recombinações em uma genealogia complexa.',
      ),
      paragraph(
        'migracoes-e-encontros-aprofundar-5',
        'Como o DNA separa encontro de semelhança antiga',
        'Espécies próximas compartilham DNA porque herdaram variantes de ancestrais comuns. Para detectar fluxo gênico posterior, pesquisadores procuram padrões assimétricos em muitas regiões do genoma: um grupo compartilha variantes demais com outro para que apenas a separação antiga explique o resultado. Testes repetidos, amostras diferentes e modelos populacionais ajudam a distinguir introgressão de contaminação, erro de sequenciamento ou estrutura antiga das populações.',
      ),
      paragraph(
        'migracoes-e-encontros-aprofundar-6',
        'A geografia também muda',
        'Climas, desertos, geleiras, rios e níveis do mar alteraram rotas possíveis. Um lugar ocupado durante milhares de anos pode ter funcionado como passagem em um período e como barreira em outro. Além disso, o mapa atual não é o mapa vivido pelas populações antigas. Por isso datas e sítios arqueológicos precisam acompanhar qualquer narrativa genética. Genes indicam conexões; fósseis, sedimentos e objetos ajudam a situá-las no espaço e no tempo.',
      ),
      paragraph(
        'migracoes-e-encontros-aprofundar-7',
        'Árvore para os ramos, rede para os encontros',
        'Uma árvore continua útil para representar as separações principais entre populações. O problema surge quando ela é obrigada a esconder todo reencontro. No Dinopad, conexões sobrepostas mostram fluxo gênico sem transformar Neandertais, Denisovanos e Homo sapiens em degraus. A imagem mais fiel é uma árvore com alguns galhos que, depois de separados, voltaram a trocar sementes.',
      ),
    ],
  },
  'fosseis-e-dna-antigo': {
    minutosLeitura: 9,
    fonteIds: ['smithsonian-human-fossils', 'green-neanderthal-2010', 'reich-denisovan-2010'],
    camadaEssencial: [
      highlight(
        'fosseis-e-dna-antigo-essencial-1',
        'Evidências diferentes se completam',
        'Fósseis registram anatomia e, quando o contexto é preservado, lugar e idade. DNA antigo pode revelar parentesco e fluxo gênico. Nenhuma dessas linhas responde sozinha a todas as perguntas.',
      ),
      paragraph(
        'fosseis-e-dna-antigo-essencial-2',
        'Preservação decide o que podemos perguntar',
        'DNA se quebra, sofre alterações químicas e recebe contaminação moderna. Calor e umidade aceleram a perda, portanto muitos fósseis importantes jamais fornecerão um genoma utilizável.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'fosseis-e-dna-antigo-aprofundar-1',
        'Um fóssil começa antes de sair do chão',
        'O osso ou dente chama atenção, mas seu contexto também é evidência. A camada de sedimento, a posição no sítio, objetos próximos, marcas de transporte e minerais ajudam a reconstruir o que aconteceu. Se uma peça perde sua localização exata, parte da informação desaparece para sempre. Escavação científica é lenta porque registra relações: fotografias, coordenadas, profundidade, amostras de solo e a sequência das camadas acompanham cada retirada.',
      ),
      paragraph(
        'fosseis-e-dna-antigo-aprofundar-2',
        'A idade não vem escrita no osso',
        'Alguns materiais podem ser datados diretamente; outros dependem de cinzas vulcânicas, sedimentos ou objetos associados. Cada método funciona apenas em determinados intervalos e materiais. Pesquisadores cruzam resultados e verificam se a amostra foi deslocada. Uma forma anatômica considerada “primitiva” não prova idade antiga. Homo naledi mostrou isso com clareza: sua combinação de traços parecia inesperada quando fósseis foram depois datados entre cerca de 236 e 335 mil anos.',
      ),
      paragraph(
        'fosseis-e-dna-antigo-aprofundar-3',
        'Anatomia transforma fragmentos em comparações',
        'Crânios, dentes, mãos, pés e outras partes não mudam todos no mesmo ritmo. Pesquisadores descrevem medidas e formas, procuram variações dentro de uma espécie e comparam indivíduos de idades diferentes. Um único dente pode ser informativo, mas raramente conta toda a história. Quanto mais partes e indivíduos um conjunto preserva, melhor é possível distinguir uma característica da espécie de uma diferença por idade, sexo, doença ou variação individual.',
      ),
      paragraph(
        'fosseis-e-dna-antigo-aprofundar-4',
        'DNA antigo chega como um quebra-cabeça danificado',
        'Depois da morte, enzimas, água, calor e microrganismos quebram as moléculas em pedaços curtos. Algumas bases sofrem alterações químicas previsíveis. Ao mesmo tempo, DNA de quem escavou, manipulou ou analisou o material pode se misturar à amostra. O laboratório não encontra um cromossomo intacto: encontra milhões de fragmentos e precisa identificar quais são antigos, quais pertencem ao organismo e como se sobrepõem.',
      ),
      paragraph(
        'fosseis-e-dna-antigo-aprofundar-5',
        'Como testar autenticidade',
        'Laboratórios usam áreas limpas, roupas de proteção, superfícies descontaminadas e controles sem amostra. Depois procuram sinais típicos de moléculas antigas, como fragmentos curtos e padrões de dano nas extremidades. Resultados importantes são comparados com DNA das pessoas envolvidas e, quando possível, repetidos em outra porção ou outro laboratório. Nenhum sinal isolado basta: autenticidade nasce da concordância entre controles e padrões independentes.',
      ),
      paragraph(
        'fosseis-e-dna-antigo-aprofundar-6',
        'Uma amostra minúscula pode ampliar a árvore',
        'Denisova 3 era apenas um fragmento de falange, mas seu DNA revelou uma população humana arcaica que os ossos disponíveis não permitiam reconhecer. Esse sucesso não torna o DNA superior ao fóssil. Sem o sítio, a datação e o próprio fragmento, faltaria contexto. Em outros casos, a molécula não sobrevive e a anatomia é a única janela. A pergunta científica deve se adaptar ao material preservado, e não o contrário.',
      ),
      paragraph(
        'fosseis-e-dna-antigo-aprofundar-7',
        'Conhecimento forte é uma convergência',
        'Uma conclusão ganha confiança quando anatomia, geologia, datação, arqueologia e genética apontam para uma explicação compatível. Quando discordam, a discordância vira uma nova pergunta: a camada foi misturada? a amostra está contaminada? a característica evoluiu mais de uma vez? Ciência não é completar lacunas com certeza; é tornar visíveis os testes, os limites e as alternativas.',
      ),
    ],
  },
  'leitura-cann-1987': {
    minutosLeitura: 9,
    fonteIds: ['cann-mtdna-1987', 'smithsonian-human-genetics'],
    camadaEssencial: [
      highlight(
        'leitura-cann-1987-essencial-1',
        'A pergunta',
        'O estudo investigou se diferenças no DNA mitocondrial de pessoas vivas poderiam reconstruir a genealogia materna recente de nossa espécie e indicar onde ela tinha maior profundidade.',
      ),
      paragraph(
        'leitura-cann-1987-essencial-2',
        'O lugar do artigo na história',
        'A análise apoiou raízes africanas para as linhagens mitocondriais amostradas. Foi influente, mas não descobriu a primeira mulher e não encerrou a discussão sobre amostras, modelos ou datas.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'leitura-cann-1987-aprofundar-1',
        'Leia primeiro a pergunta, não o apelido',
        'Cann, Stoneking e Wilson queriam saber o que a variação do DNA mitocondrial de pessoas vivas podia revelar sobre a história recente de Homo sapiens. Como esse pequeno genoma costuma ser transmitido pela linha materna e passa por pouca recombinação, ele oferecia uma trilha mais simples do que o genoma nuclear para as técnicas de 1987. A pergunta era sobre linhagens genéticas; “Eva mitocondrial” foi um apelido popular posterior, não a hipótese de uma primeira mulher solitária.',
      ),
      paragraph(
        'leitura-cann-1987-aprofundar-2',
        'O material e a técnica disponíveis',
        'O trabalho comparou DNA mitocondrial de 147 pessoas associadas a diferentes populações geográficas. Em vez de sequenciar genomas completos, os autores observaram padrões produzidos por enzimas que cortavam a molécula em pontos específicos. Diferenças nesses fragmentos funcionavam como marcadores. Era uma tecnologia importante para a época, mas registrava uma parte muito menor da variação do que o sequenciamento atual.',
      ),
      paragraph(
        'leitura-cann-1987-aprofundar-3',
        'Da diferença à árvore',
        'Os autores calcularam relações entre os padrões e construíram uma árvore das amostras. As linhagens africanas apresentaram maior diversidade e ocuparam posições profundas na análise. A interpretação foi que o ancestral comum das linhagens mitocondriais estudadas viveu na África e que parte da diversidade fora do continente derivava de uma expansão posterior. Observe a diferença: a árvore descrevia moléculas herdadas, não todas as relações entre todas as pessoas.',
      ),
      paragraph(
        'leitura-cann-1987-aprofundar-4',
        'O resultado histórico e seus limites',
        'O artigo ajudou a consolidar modelos de origem africana recente para Homo sapiens, mas recebeu críticas sobre procedência das amostras, suposições estatísticas, enraizamento da árvore e calibração do relógio molecular. Pesquisas seguintes ampliaram amostras e métodos. Esse percurso é instrutivo: um trabalho pode ser transformador sem ser a última palavra, e revisões não apagam sua importância histórica.',
      ),
      paragraph(
        'leitura-cann-1987-aprofundar-5',
        'O que o artigo não demonstrou',
        'A ancestral comum daquela linha não foi a primeira mulher, a única mulher viva ou a única ancestral das pessoas atuais. Mulheres de sua época podem ter deixado descendentes por partes do DNA nuclear mesmo que sua linha mitocondrial tenha terminado. O estudo também não analisou genomas de pessoas antigas. Ele inferiu o passado a partir da variação presente e de um modelo de mudança molecular.',
      ),
      paragraph(
        'leitura-cann-1987-aprofundar-6',
        'Como ler a estimativa de idade',
        'Uma data genética depende de quantas diferenças são observadas, da taxa de mutação escolhida e do modelo populacional. Taxas não são relógios perfeitos e podem ser calibradas de maneiras diferentes. Por isso é mais correto falar em intervalos e incerteza do que em um ano exato. O valor também se refere ao encontro das linhagens amostradas: novas amostras podem alterar a estimativa e a forma da árvore.',
      ),
      list(
        'leitura-cann-1987-aprofundar-7',
        'Perguntas para estudar o artigo',
        [
          'Qual parte do DNA foi analisada e qual genealogia ela consegue representar?',
          'Como as amostras foram agrupadas e quais limitações essa escolha introduziu?',
          'Quais conclusões pertencem aos dados e quais foram acrescentadas pela divulgação posterior?',
          'Que resultados atuais refinam o artigo sem transformar sua hipótese em uma história de uma única mulher?',
        ],
      ),
    ],
  },
  'leitura-green-2010': {
    minutosLeitura: 9,
    fonteIds: ['green-neanderthal-2010', 'smithsonian-human-genetics'],
    camadaEssencial: [
      highlight(
        'leitura-green-2010-essencial-1',
        'A mudança de visão',
        'O rascunho do genoma Neandertal mostrou que a separação entre populações humanas não impediu reencontros: houve fluxo gênico com ancestrais de humanos modernos.',
      ),
      paragraph(
        'leitura-green-2010-essencial-2',
        'Por que a evidência foi forte',
        'O resultado veio de padrões repetidos em muitas posições do genoma, controles de dano e contaminação e comparações entre Neandertais, humanos atuais e chimpanzés.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'leitura-green-2010-aprofundar-1',
        'Uma pergunta difícil escondida em ossos antigos',
        'Fósseis mostravam que Neandertais viveram na Eurásia e se sobrepuseram no tempo a humanos anatomicamente modernos. Mas convivência não prova que populações tiveram descendentes férteis. Green e colaboradores buscaram uma resposta no DNA nuclear, onde milhões de posições poderiam registrar tanto separação antiga quanto encontros posteriores.',
      ),
      paragraph(
        'leitura-green-2010-aprofundar-2',
        'Produzir o rascunho exigiu separar sinais',
        'A equipe trabalhou principalmente com ossos Neandertais da caverna Vindija, na Croácia. DNA antigo chega fragmentado e misturado a grande quantidade de DNA microbiano; também pode receber DNA humano moderno durante escavação e laboratório. Os autores examinaram padrões de dano, estimaram contaminação e compararam resultados de bibliotecas diferentes. A confiabilidade não veio de uma leitura perfeita, mas de controles convergentes.',
      ),
      paragraph(
        'leitura-green-2010-aprofundar-3',
        'A comparação decisiva',
        'Em cada posição informativa, era possível perguntar se o alelo Neandertal combinava mais frequentemente com uma população humana atual do que com outra, usando o chimpanzé para indicar a condição mais antiga. Populações não africanas incluídas no estudo compartilhavam mais variantes derivadas com Neandertais do que as populações africanas comparadas. Repetido ao longo do genoma, esse desequilíbrio era difícil de explicar apenas por uma separação populacional limpa.',
      ),
      paragraph(
        'leitura-green-2010-aprofundar-4',
        'Semelhança sozinha não bastaria',
        'Neandertais e humanos modernos já eram parentes próximos, portanto muito DNA compartilhado era esperado. O argumento dependia de uma assimetria: certos humanos atuais se pareciam com Neandertais mais do que outros de uma maneira consistente. Modelos de estrutura populacional antiga também foram considerados. A conclusão preferida foi fluxo gênico entre Neandertais e ancestrais de populações fora da África, embora trabalhos posteriores tenham refinado épocas, lugares e múltiplos episódios.',
      ),
      paragraph(
        'leitura-green-2010-aprofundar-5',
        'O que mudou na árvore',
        'O estudo não apagou os ramos Neandertal e Homo sapiens. Ele mostrou que ramos separados podem voltar a trocar genes. Essa é a diferença entre uma árvore e uma rede: a primeira resume separações predominantes; conexões adicionais registram introgressão. Também não significa que toda pessoa fora da África possua os mesmos segmentos. Recombinação e acaso distribuíram partes diferentes entre indivíduos e populações.',
      ),
      paragraph(
        'leitura-green-2010-aprofundar-6',
        'Leia números populacionais com cuidado',
        'Estimativas de ancestralidade Neandertal são médias construídas com amostras e genomas de referência. Elas mudam conforme o método, a população e a cobertura do genoma. Um percentual não mede identidade nem transforma características complexas em “Neandertais” ou “modernas”. A força do artigo está no padrão populacional e histórico, não em classificar pessoas atuais por uma fração de espécie.',
      ),
      list(
        'leitura-green-2010-aprofundar-7',
        'Ao acompanhar a evidência, procure',
        [
          'Quais ossos produziram DNA, qual era a cobertura e como a contaminação foi estimada?',
          'Quais populações atuais participaram da comparação e quais não estavam representadas?',
          'Que padrão diferencia fluxo gênico de ancestralidade compartilhada mais antiga?',
          'Quais conclusões foram refinadas por genomas Neandertais e humanos publicados depois de 2010?',
        ],
      ),
    ],
  },
  'leitura-reich-2010': {
    minutosLeitura: 9,
    fonteIds: ['reich-denisovan-2010', 'smithsonian-human-genetics'],
    camadaEssencial: [
      highlight(
        'leitura-reich-2010-essencial-1',
        'Uma população reconhecida pelo DNA',
        'Um pequeno fragmento de dedo encontrado na caverna de Denisova preservou um genoma que não pertencia nem a humanos modernos nem a Neandertais.',
      ),
      paragraph(
        'leitura-reich-2010-essencial-2',
        'O que a comparação revelou',
        'A linhagem era próxima dos Neandertais e contribuiu geneticamente para ancestrais de algumas populações atuais. O artigo evitou transformar automaticamente a linhagem em uma espécie formal.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'leitura-reich-2010-aprofundar-1',
        'Comece pelo tamanho da evidência',
        'Denisova 3 é a falange distal de um dedo encontrada na caverna de Denisova, na Sibéria. Sua anatomia isolada não permitia reconhecer um novo grupo humano. O que mudou a história foi a preservação molecular. Esse contraste é importante: uma peça pequena pode responder uma pergunta grande quando conserva um tipo raro de evidência, mas continua dependendo do contexto arqueológico e de controles laboratoriais.',
      ),
      paragraph(
        'leitura-reich-2010-aprofundar-2',
        'Do DNA mitocondrial ao genoma nuclear',
        'Uma análise inicial do DNA mitocondrial já havia indicado uma linhagem inesperada. O artigo de Reich e colaboradores publicou um rascunho do genoma nuclear com cobertura média de aproximadamente 1,9 vez. O genoma nuclear reúne milhares de genealogias e permitiu comparar Denisova 3 com Neandertais, pessoas atuais e chimpanzés com muito mais informação do que uma única linha mitocondrial.',
      ),
      paragraph(
        'leitura-reich-2010-aprofundar-3',
        'Parente dos Neandertais, mas com história própria',
        'As comparações indicaram que a população de Denisova 3 compartilhava um ancestral mais recente com Neandertais do que com humanos modernos. Ainda assim, o ramo denisovano havia acumulado sua própria história depois da separação. “Grupo irmão” não significa população idêntica: descreve quais linhagens compartilham a separação mais recente na árvore analisada.',
      ),
      paragraph(
        'leitura-reich-2010-aprofundar-4',
        'A conexão com pessoas atuais',
        'No conjunto estudado em 2010, os autores estimaram contribuição denisovana de cerca de 4% a 6% nos ancestrais das populações melanésias comparadas. O número não deve ser universalizado para toda pessoa da Melanésia nem para o presente sem considerar novas amostras e métodos. Pesquisas posteriores encontraram histórias de introgressão diferentes em populações da Ásia e da Oceania, tornando o quadro mais ramificado.',
      ),
      paragraph(
        'leitura-reich-2010-aprofundar-5',
        'Linhagem genética não vira espécie por atalho',
        'O artigo descreveu um grupo humano arcaico e evitou atribuir um nome formal de espécie. Genomas podem revelar uma população distinta, mas delimitar espécies fósseis também envolve anatomia, variação, reprodução e decisões conceituais. Como o material disponível era limitado, “Denisovanos” funciona no Dinopad como nome de uma linhagem genética. Essa escolha registra o que sabemos sem prometer mais do que a evidência sustenta.',
      ),
      paragraph(
        'leitura-reich-2010-aprofundar-6',
        'O estudo abriu perguntas, não apenas respostas',
        'Onde viviam populações denisovanas? Como variavam fisicamente? Quantos encontros tiveram com outros humanos? Em 2010, um dedo e um dente eram uma janela estreita. Novos fósseis, proteínas antigas e genomas ampliaram a distribuição conhecida, mas muitas perguntas continuam. A lição metodológica é poderosa: reconhecer um ramo é o começo de uma investigação, não seu encerramento.',
      ),
      list(
        'leitura-reich-2010-aprofundar-7',
        'Perguntas para estudar a descoberta',
        [
          'O que veio diretamente do fragmento e o que dependeu de modelos comparativos?',
          'Por que o genoma nuclear contou uma história mais ampla que o DNA mitocondrial?',
          'A quais populações atuais a estimativa de contribuição genética se referia?',
          'Por que os autores não deram imediatamente um nome de espécie à linhagem?',
        ],
      ),
    ],
  },
  'leitura-berger-2015': {
    minutosLeitura: 9,
    fonteIds: ['berger-naledi-2015', 'naledi-dating-2017'],
    camadaEssencial: [
      highlight(
        'leitura-berger-2015-essencial-1',
        'Um conjunto incomum',
        'A câmara Dinaledi preservou mais de 1.500 elementos fósseis atribuídos a pelo menos 15 indivíduos, permitindo comparar diferentes partes do corpo e fases da vida.',
      ),
      paragraph(
        'leitura-berger-2015-essencial-2',
        'A lição que veio depois',
        'A descrição reconheceu uma anatomia em mosaico e propôs Homo naledi. A idade ainda era desconhecida em 2015; datações publicadas em 2017 situaram o material entre 236 e 335 mil anos.',
      ),
    ],
    camadaAprofundar: [
      paragraph(
        'leitura-berger-2015-aprofundar-1',
        'A descoberta não foi apenas um crânio',
        'O artigo de 2015 descreveu mais de 1.500 elementos fósseis da câmara Dinaledi, na África do Sul, representando pelo menos 15 indivíduos. Havia partes do crânio, dentes, mãos, pés, braços, pernas e tronco, além de indivíduos de diferentes idades. Essa abundância permitiu observar variação dentro do conjunto e reduziu o risco de definir uma espécie inteira a partir de uma única peça incomum.',
      ),
      paragraph(
        'leitura-berger-2015-aprofundar-2',
        'Uma anatomia em mosaico',
        'Homo naledi combinava características que, em uma narrativa de escada, pareceriam pertencer a etapas diferentes. Mãos e pés possuíam vários traços próximos aos de Homo, enquanto o tamanho cerebral e partes do ombro, tronco e pelve lembravam hominínios mais antigos. “Mosaico” não significa mistura de espécies: descreve partes do corpo com histórias evolutivas que não mudaram todas juntas.',
      ),
      paragraph(
        'leitura-berger-2015-aprofundar-3',
        'Por que a equipe propôs uma nova espécie',
        'Os autores compararam o conjunto com Australopithecus, Paranthropus e espécies de Homo. A combinação recorrente de características em vários indivíduos não se encaixava bem na variação conhecida. O nome Homo naledi organizou essa hipótese taxonômica. Como em toda descrição de espécie fóssil, outros pesquisadores podem testar a diagnose, ampliar comparações ou discordar da posição filogenética.',
      ),
      paragraph(
        'leitura-berger-2015-aprofundar-4',
        'Em 2015, a idade ainda estava em aberto',
        'A descrição anatômica foi publicada antes de uma datação segura. Sem idade, era tentador imaginar que características aparentemente antigas significavam grande antiguidade. O artigo foi cuidadoso ao separar a descrição da cronologia. Essa incerteza era central, não um detalhe ausente: sem saber quando viveu, era difícil avaliar quais outras populações poderiam ter coexistido com Homo naledi.',
      ),
      paragraph(
        'leitura-berger-2015-aprofundar-5',
        'A datação de 2017 mudou o cenário',
        'Análises independentes de dentes e sedimentos situaram os fósseis entre aproximadamente 236 e 335 mil anos. Homo naledi viveu, portanto, muito mais recentemente do que uma leitura baseada apenas em traços “primitivos” poderia sugerir. O caso mostra por que anatomia não funciona como relógio: características podem persistir, mudar em ritmos diferentes ou surgir em combinações inesperadas.',
      ),
      paragraph(
        'leitura-berger-2015-aprofundar-6',
        'Descrição não resolve comportamento',
        'A concentração de fósseis em uma câmara de acesso difícil gerou hipóteses sobre como os corpos chegaram ali. A descrição de 2015 documentou o material e discutiu o contexto, mas inferências sobre deposição deliberada exigem evidências adicionais e continuam debatidas. É importante distinguir três perguntas: o que foi encontrado, como foi classificado e qual comportamento poderia explicar o depósito.',
      ),
      list(
        'leitura-berger-2015-aprofundar-7',
        'Como estudar a descrição',
        [
          'Quais partes do corpo sustentam a diagnose e em quantos indivíduos elas aparecem?',
          'Onde os autores descrevem dados e onde passam a interpretar parentesco ou comportamento?',
          'Que conclusões não podiam ser feitas antes da datação publicada em 2017?',
          'Como a anatomia em mosaico desafia uma visão de evolução em escada?',
        ],
      ),
    ],
  },
};

const translationIntroductions: Record<string, BlocoEditorial[]> = {
  'revolucao-dna-antigo': [
    highlight(
      'revolucao-dna-antigo-contexto-dinopad',
      'Antes da tradução — contexto Dinopad',
      'Este artigo foi publicado em 2019 para leitores jovens. Ele apresenta ideias centrais do DNA antigo com exemplos de Neandertais, Denisovanos e mamutes. A tradução integral começa no bloco “Resumo”; os dois blocos iniciais são uma preparação editorial do Dinopad.',
    ),
    paragraph(
      'revolucao-dna-antigo-guia-dinopad',
      'O que observar durante a leitura',
      'Separe três etapas: recuperar fragmentos antigos, testar se eles são autênticos e interpretar diferenças entre genomas. A tecnologia avançou rapidamente desde a publicação, mas os limites básicos continuam: preservação desigual, contaminação, amostras pequenas e modelos que precisam declarar incerteza. Afirmações sobre aparência ou comportamento exigem mais cautela do que relações de parentesco bem repetidas no genoma.',
    ),
  ],
  'dna-neandertal': [
    highlight(
      'dna-neandertal-contexto-dinopad',
      'Antes da tradução — contexto Dinopad',
      'O texto de 2019 explica introgressão com comparações acessíveis. A tradução integral começa em “Resumo”. Esta introdução ajuda a evitar um atalho: possuir segmentos herdados de Neandertais não divide uma pessoa em porcentagens de identidade ou de comportamento.',
    ),
    paragraph(
      'dna-neandertal-guia-dinopad',
      'Como adaptar as metáforas',
      'Misturar tintas ajuda a imaginar segmentos de DNA, mas genomas não se tornam uma cor uniforme. A recombinação recorta e redistribui trechos a cada geração; seleção e acaso alteram suas frequências. Efeitos associados a variantes são resultados populacionais, dependem do ambiente e raramente permitem prever sozinho uma característica individual.',
    ),
  ],
  'dna-historia-humana': [
    highlight(
      'dna-historia-humana-contexto-dinopad',
      'Antes da tradução — contexto Dinopad',
      'O artigo de 2020 mostra que um genoma contém muitas genealogias. A tradução integral começa em “Resumo”. Leia os exemplos regionais como demonstrações de método, não como histórias completas de todos os povos envolvidos.',
    ),
    paragraph(
      'dna-historia-humana-guia-dinopad',
      'Do dado à narrativa',
      'Uma diferença genética precisa ser combinada a amostragem, estatística, datação e contexto histórico. Populações usadas em um estudo não representam automaticamente continentes inteiros, e rótulos atuais não existiam necessariamente no passado. O DNA registra parentescos e encontros; arqueologia, linguística, documentos e memória das comunidades ajudam a interpretar quem se moveu e em quais circunstâncias.',
    ),
  ],
};

const publications = JSON.parse(readFileSync(publicationsPath, 'utf8')) as Publicacao[];
const revised = publications.map((publication) => {
  const revision = revisions[publication.id];
  const introductions = translationIntroductions[publication.id];
  const introductionIds = new Set(introductions?.map(({ id }) => id) ?? []);
  return {
    ...publication,
    ...(revision ?? {}),
    ...(introductions
      ? {
          camadaAprofundar: [
            ...introductions,
            ...publication.camadaAprofundar.filter(({ id }) => !introductionIds.has(id)),
          ],
        }
      : {}),
    revisao: {
      ...publication.revisao,
      revisadoEm: reviewedAt,
      observacoes: revision
        ? 'Texto revisto para leitura contínua: contexto, evidência, limites e conclusão.'
        : introductions
          ? 'Tradução preservada com preparação editorial Dinopad claramente separada.'
          : publication.revisao.observacoes,
    },
  };
});

writeFileSync(publicationsPath, `${JSON.stringify(revised, null, 2)}\n`, 'utf8');
