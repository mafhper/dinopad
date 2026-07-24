/* Arquivo gerado por npm run content:build. Não editar manualmente. */
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

const organismoIds = new Set(["tyrannosaurus-rex","triceratops","stegosaurus","coelophysis","plateosaurus","staurikosaurus","buriolestes","allosaurus","diplodocus","brachiosaurus","archaeopteryx","velociraptor","spinosaurus","ankylosaurus","parasaurolophus","iguanodon","irritator","berthasaura","austroposeidon","uberabatitan","dimetrodon","pteranodon","mosasaurus","smilodon-populator","gnathovorax","carnotaurus","deinonychus","psittacosaurus","edmontosaurus","tapejara","pleuromeia","dicroidium","araucaria-mirabilis","ginkgoites-huttonii","archaefructus","duartenia","gorilla-beringei","gorilla-gorilla","homo-sapiens","pan-paniscus","pan-troglodytes","pongo-abelii","pongo-pygmaeus","pongo-tapanuliensis","sahelanthropus-tchadensis","orrorin-tugenensis","ardipithecus-kadabba","ardipithecus-ramidus","australopithecus-anamensis","australopithecus-afarensis","australopithecus-africanus","australopithecus-garhi","australopithecus-sediba","paranthropus-aethiopicus","paranthropus-boisei","paranthropus-robustus","kenyanthropus-platyops","homo-habilis","homo-rudolfensis","homo-erectus","homo-heidelbergensis","homo-neanderthalensis","homo-naledi","homo-floresiensis","dickinsonia-costata","anomalocaris-canadensis","tiktaalik-roseae","acanthostega-gunnari","rhynia-gwynne-vaughanii","calamites-suckowii","glossopteris-indica","cycadeoidea"]);
const mediaIds = new Set(["tyrannosaurus-rex-evidencia","tyrannosaurus-rex-interpretacao","tyrannosaurus-rex-escala","triceratops-evidencia","triceratops-interpretacao","triceratops-escala","stegosaurus-evidencia","stegosaurus-interpretacao","stegosaurus-escala","coelophysis-evidencia","coelophysis-interpretacao","coelophysis-escala","plateosaurus-evidencia","plateosaurus-interpretacao","plateosaurus-escala","staurikosaurus-evidencia","staurikosaurus-interpretacao","staurikosaurus-escala","buriolestes-evidencia","buriolestes-interpretacao","buriolestes-escala","allosaurus-evidencia","allosaurus-interpretacao","allosaurus-escala","diplodocus-evidencia","diplodocus-interpretacao","diplodocus-escala","brachiosaurus-evidencia","brachiosaurus-interpretacao","brachiosaurus-escala","archaeopteryx-evidencia","archaeopteryx-interpretacao","archaeopteryx-escala","velociraptor-evidencia","velociraptor-interpretacao","velociraptor-escala","spinosaurus-evidencia","spinosaurus-interpretacao","spinosaurus-escala","ankylosaurus-evidencia","ankylosaurus-interpretacao","ankylosaurus-escala","parasaurolophus-evidencia","parasaurolophus-interpretacao","parasaurolophus-escala","iguanodon-evidencia","iguanodon-interpretacao","iguanodon-escala","berthasaura-evidencia","berthasaura-interpretacao","berthasaura-escala","austroposeidon-evidencia","austroposeidon-interpretacao","austroposeidon-escala","uberabatitan-evidencia","uberabatitan-interpretacao","uberabatitan-escala","pteranodon-evidencia","pteranodon-interpretacao","pteranodon-escala","mosasaurus-evidencia","mosasaurus-interpretacao","mosasaurus-escala","gnathovorax-evidencia","gnathovorax-interpretacao","gnathovorax-escala","carnotaurus-evidencia","carnotaurus-interpretacao","carnotaurus-escala","deinonychus-evidencia","deinonychus-interpretacao","deinonychus-escala","psittacosaurus-evidencia","psittacosaurus-interpretacao","psittacosaurus-escala","edmontosaurus-evidencia","edmontosaurus-interpretacao","edmontosaurus-escala","tapejara-evidencia","tapejara-interpretacao","tapejara-escala","pleuromeia-evidencia","pleuromeia-interpretacao","pleuromeia-morfologia","araucaria-mirabilis-evidencia","araucaria-mirabilis-interpretacao","araucaria-mirabilis-morfologia","ginkgoites-huttonii-evidencia","ginkgoites-huttonii-interpretacao","ginkgoites-huttonii-morfologia","archaefructus-evidencia","archaefructus-interpretacao","archaefructus-morfologia","duartenia-evidencia","duartenia-interpretacao","duartenia-morfologia","gorilla-beringei-evidencia","gorilla-beringei-interpretacao","gorilla-beringei-escala","gorilla-gorilla-evidencia","gorilla-gorilla-interpretacao","gorilla-gorilla-escala","homo-sapiens-evidencia","homo-sapiens-interpretacao","homo-sapiens-escala","pan-paniscus-evidencia","pan-paniscus-interpretacao","pan-paniscus-escala","pan-troglodytes-evidencia","pan-troglodytes-interpretacao","pan-troglodytes-escala","pongo-abelii-evidencia","pongo-abelii-interpretacao","pongo-abelii-escala","pongo-pygmaeus-evidencia","pongo-pygmaeus-interpretacao","pongo-pygmaeus-escala","pongo-tapanuliensis-evidencia","pongo-tapanuliensis-interpretacao","pongo-tapanuliensis-escala","sahelanthropus-tchadensis-evidencia","sahelanthropus-tchadensis-interpretacao","sahelanthropus-tchadensis-escala","orrorin-tugenensis-evidencia","orrorin-tugenensis-interpretacao","orrorin-tugenensis-escala","ardipithecus-kadabba-evidencia","ardipithecus-kadabba-interpretacao","ardipithecus-kadabba-escala","australopithecus-anamensis-evidencia","australopithecus-anamensis-interpretacao","australopithecus-anamensis-escala","australopithecus-afarensis-evidencia","australopithecus-afarensis-interpretacao","australopithecus-afarensis-escala","australopithecus-africanus-evidencia","australopithecus-africanus-interpretacao","australopithecus-africanus-escala","australopithecus-sediba-evidencia","australopithecus-sediba-interpretacao","australopithecus-sediba-escala","paranthropus-aethiopicus-evidencia","paranthropus-aethiopicus-interpretacao","paranthropus-aethiopicus-escala","paranthropus-boisei-evidencia","paranthropus-boisei-interpretacao","paranthropus-boisei-escala","paranthropus-robustus-evidencia","paranthropus-robustus-interpretacao","paranthropus-robustus-escala","kenyanthropus-platyops-evidencia","kenyanthropus-platyops-interpretacao","kenyanthropus-platyops-escala","homo-habilis-evidencia","homo-habilis-interpretacao","homo-habilis-escala","homo-erectus-evidencia","homo-erectus-interpretacao","homo-erectus-escala","homo-heidelbergensis-evidencia","homo-heidelbergensis-interpretacao","homo-heidelbergensis-escala","homo-neanderthalensis-evidencia","homo-neanderthalensis-interpretacao","homo-neanderthalensis-escala","homo-naledi-evidencia","homo-naledi-interpretacao","homo-naledi-escala","dickinsonia-costata-evidencia","dickinsonia-costata-interpretacao","dickinsonia-costata-escala","anomalocaris-canadensis-evidencia","anomalocaris-canadensis-interpretacao","anomalocaris-canadensis-escala","acanthostega-gunnari-evidencia","acanthostega-gunnari-interpretacao","acanthostega-gunnari-escala","rhynia-gwynne-vaughanii-evidencia","rhynia-gwynne-vaughanii-interpretacao","rhynia-gwynne-vaughanii-morfologia","glossopteris-indica-evidencia","glossopteris-indica-interpretacao","glossopteris-indica-morfologia","denisovanos-evidencia","irritator-evidencia","irritator-interpretacao","irritator-escala","dimetrodon-evidencia","dimetrodon-interpretacao","dimetrodon-escala","smilodon-populator-evidencia","smilodon-populator-interpretacao","smilodon-populator-escala","dicroidium-evidencia","dicroidium-interpretacao","dicroidium-morfologia","ardipithecus-ramidus-evidencia","ardipithecus-ramidus-interpretacao","ardipithecus-ramidus-escala","australopithecus-garhi-evidencia","australopithecus-garhi-interpretacao","australopithecus-garhi-escala","homo-rudolfensis-evidencia","homo-rudolfensis-interpretacao","homo-rudolfensis-escala","homo-floresiensis-evidencia","homo-floresiensis-interpretacao","homo-floresiensis-escala","calamites-suckowii-evidencia","calamites-suckowii-interpretacao","calamites-suckowii-morfologia","cycadeoidea-evidencia","cycadeoidea-interpretacao","cycadeoidea-morfologia","tiktaalik-roseae-evidencia","tiktaalik-roseae-interpretacao","tiktaalik-roseae-escala"]);
const especimeIds = new Set(["sue-t-rex","dippy-cm-84","archaeopteryx-berlim","staurikosaurus-holotipo","buriolestes-holotipo","irritator-holotipo","toumai","ardi","lucy","taung-1","little-foot","oh-7","turkana-boy","dmanisi-5","neanderthal-1","denisova-3","lb1","dh1"]);

export const catalogo = {
  versaoEscalaGeologica: "ICS 2026/06",
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

export const indicesConteudo = {
  "busca": [
    {
      "id": "tyrannosaurus-rex",
      "texto": "tiranossauro tyrannosaurus rex tyrannosaurus rex lagarto tirano rei carnivoria um enorme teropode do fim do cretaceo norte americano tinha cranio robusto dentes espessos e uma mordida capaz de danificar ossos seus fosseis aparecem nos ultimos dois milhoes de anos do mesozoico fauna dinossauro t rex t rex rei dos dinossauros cretaceo superior estados unidos montana dakota do norte e dakota do sul hell creek estados unidos wyoming lance"
    },
    {
      "id": "triceratops",
      "texto": "triceratopo triceratops horridus triceratops rosto com tres chifres herbivoria um herbivoro de bico gola ossea e tres chifres seu bico cortava vegetacao e uma bateria de dentes triturava o alimento a gola e os chifres provavelmente tiveram mais de uma funcao incluindo exibicao e defesa fauna dinossauro tres chifres tres chifres cretaceo superior estados unidos oeste da america do norte hell creek estados unidos wyoming lance"
    },
    {
      "id": "stegosaurus",
      "texto": "estegossauro stegosaurus stenops stegosaurus lagarto com telhado herbivoria um herbivoro jurassico com placas dorsais e espinhos na cauda as placas continham vasos sanguineos e podem ter participado de exibicao e controle termico os espinhos da cauda eram uma defesa capaz de ferir predadores fauna dinossauro placas nas costas jurassico superior estados unidos oeste dos estados unidos morrison"
    },
    {
      "id": "coelophysis",
      "texto": "celofise coelophysis bauri coelophysis forma oca carnivoria um teropode leve dos primeiros capitulos da historia dos dinossauros tinha pernas longas corpo esguio e dentes recurvados muitos individuos foram encontrados juntos em ghost ranch mas isso nao prova sozinho que cacavam em grupo fauna dinossauro coelophysis triassico estados unidos novo mexico chinle"
    },
    {
      "id": "plateosaurus",
      "texto": "plateossauro plateosaurus engelhardti plateosaurus lagarto largo herbivoria um sauropodomorfo anterior aos gigantes do jurassico podia andar sobre duas pernas e usar as maos para alcancar ou manipular vegetacao seu ramo evolutivo inclui parentes que se tornariam enormes sauropodes fauna dinossauro triassico alemanha baden wurttemberg trossingen"
    },
    {
      "id": "staurikosaurus",
      "texto": "estauricossauro staurikosaurus pricei staurikosaurus lagarto do cruzeiro do sul carnivoria um dos dinossauros mais antigos conhecidos encontrado no brasil o holotipo preserva partes da coluna mandibula pelve e membros posteriores como o material e incompleto reconstrucoes precisam mostrar claramente onde comeca a interpretacao fauna dinossauro dinossauro do cruzeiro do sul triassico brasil rio grande do sul santa maria"
    },
    {
      "id": "buriolestes",
      "texto": "buriolestes buriolestes schultzi buriolestes ladrao da familia buriol carnivoria um sauropodomorfo muito antigo que ainda tinha dentes adequados a carne seu cranio ajuda a estudar os primeiros passos do ramo que mais tarde produziria sauropodes herbivoros gigantes a dieta dos primeiros membros desse ramo ainda e uma area importante de pesquisa fauna dinossauro triassico brasil sao joao do polesine rio grande do sul santa maria"
    },
    {
      "id": "allosaurus",
      "texto": "alossauro allosaurus fragilis allosaurus lagarto diferente carnivoria um grande predador do jurassico superior tinha bracos maiores em proporcao que os de t rex e tres dedos com garras marcas em ossos e dentes ajudam a reconstruir sua alimentacao mas cada encontro especifico exige evidencia propria fauna dinossauro jurassico superior estados unidos oeste dos estados unidos morrison"
    },
    {
      "id": "diplodocus",
      "texto": "diplodoco diplodocus carnegii diplodocus viga dupla herbivoria um sauropode muito comprido com cauda e pescoco extensos dentes estreitos ficavam na frente das mandibulas e retiravam vegetacao replicas do esqueleto cm 84 ajudaram a tornar o animal conhecido em museus de varios paises fauna dinossauro dippy jurassico superior estados unidos wyoming e estados vizinhos morrison"
    },
    {
      "id": "brachiosaurus",
      "texto": "braquiossauro brachiosaurus altithorax brachiosaurus lagarto braco herbivoria um sauropode alto com membros anteriores relativamente longos a postura deixava os ombros mais altos que a pelve e ajudava a alcancar vegetacao elevada seu cranio e menos conhecido que o restante do esqueleto fauna dinossauro jurassico superior estados unidos colorado e utah morrison"
    },
    {
      "id": "archaeopteryx",
      "texto": "arqueopterix archaeopteryx lithographica archaeopteryx asa antiga carnivoria um pequeno dinossauro com penas e asas do jurassico superior combina penas de voo com dentes cauda ossea longa e dedos com garras e um avialano antigo mas nao deve ser tratado como o unico ancestral direto de todas as aves fauna dinossauro ave jurassica jurassico superior alemanha baviera calcario de solnhofen"
    },
    {
      "id": "velociraptor",
      "texto": "velociraptor velociraptor mongoliensis velociraptor ladrao veloz carnivoria um pequeno dromeossaurideo emplumado do deserto de gobi tinha uma garra curva ampliada em cada pe estruturas no antebraco mostram ligacao com penas embora seu tamanho e bracos nao permitissem voo ativo fauna dinossauro raptor cretaceo superior mongolia deserto de gobi djadochta"
    },
    {
      "id": "spinosaurus",
      "texto": "espinossauro spinosaurus aegyptiacus spinosaurus lagarto espinho carnivoria um teropode de focinho alongado associado a rios do cretaceo dentes conicos e focinho comprido eram adequados para capturar peixes quanto tempo passava na agua e como nadava continuam sendo questoes debatidas fauna dinossauro dinossauro de vela cretaceo egito e marrocos norte da africa bahariya e kem kem"
    },
    {
      "id": "ankylosaurus",
      "texto": "anquilossauro ankylosaurus magniventris ankylosaurus lagarto fundido de barriga grande herbivoria um grande herbivoro blindado com clava ossea na cauda placas osseas protegiam o dorso e a clava da cauda podia ser usada em defesa o cranio largo terminava em um bico adequado a vegetacao baixa fauna dinossauro dinossauro blindado cretaceo superior estados unidos e canada oeste da america do norte hell creek e lance"
    },
    {
      "id": "parasaurolophus",
      "texto": "parassaurolofo parasaurolophus walkeri parasaurolophus proximo ao saurolophus herbivoria um hadrossauro com uma crista tubular longa passagens de ar percorriam a crista modelos acusticos sugerem que ela podia modificar sons mas nao podemos escutar exatamente como eram fauna dinossauro dinossauro de crista longa cretaceo superior canada alberta dinosaur park"
    },
    {
      "id": "iguanodon",
      "texto": "iguanodonte iguanodon bernissartensis iguanodon dente de iguana herbivoria um grande herbivoro conhecido por espinhos nos polegares os primeiros estudos colocaram o espinho do polegar no nariz novos esqueletos articulados corrigiram a montagem um otimo exemplo de ciencia se aperfeicoando fauna dinossauro polegar em espinho cretaceo belgica bernissart sainte barbe clays"
    },
    {
      "id": "irritator",
      "texto": "irritator irritator challengeri irritator o irritante de challenger carnivoria um espinossaurideo brasileiro conhecido por um cranio notavel o focinho alongado e os dentes conicos sugerem alimentacao com peixes e outras presas partes do cranio foram modificadas antes de chegar aos cientistas exigindo reconstrucao cuidadosa fauna dinossauro espinossaurideo brasileiro cretaceo brasil bacia do araripe romualdo"
    },
    {
      "id": "berthasaura",
      "texto": "bertassauro berthasaura leopoldinae berthasaura lagarto de bertha e leopoldina herbivoria um pequeno ceratossauro brasileiro sem dentes o bico sem dentes torna sua dieta uma questao interessante herbivoria e uma hipotese plausivel mas a ficha preserva a incerteza em vez de tratar a interpretacao como certeza fauna dinossauro cretaceo superior brasil cruzeiro do oeste parana goio ere"
    },
    {
      "id": "austroposeidon",
      "texto": "austroposeidon austroposeidon magnificus austroposeidon magnifico poseidon do sul herbivoria um dos maiores dinossauros descritos no brasil e conhecido principalmente por vertebras do pescoco e do dorso tomografias revelaram uma estrutura interna cheia de pequenas camaras de ar comum em grandes sauropodes fauna dinossauro gigante brasileiro cretaceo superior brasil sao paulo presidente prudente"
    },
    {
      "id": "uberabatitan",
      "texto": "uberabatita uberabatitan ribeiroi uberabatitan tita de uberaba herbivoria um titanossauro do fim do cretaceo mineiro mais de um individuo foi encontrado no mesmo local incluindo partes de coluna cintura e membros o cranio ainda nao e conhecido fauna dinossauro cretaceo superior brasil uberaba minas gerais serra da galga"
    },
    {
      "id": "dimetrodon",
      "texto": "dimetrodonte dimetrodon dimetrodon dois tipos de dentes carnivoria um sinapsideo predador que viveu antes dos dinossauros a abertura no cranio atras de cada olho o coloca no ramo dos sinapsideos o mesmo grande ramo dos mamiferos a vela dorsal pode ter participado de exibicao e controle termico fauna nao e dinossauro animal de vela do permiano permiano estados unidos texas red beds do texas"
    },
    {
      "id": "pteranodon",
      "texto": "pteranodonte pteranodon longiceps pteranodon asa sem dentes carnivoria um pterossauro marinho de grande envergadura e sem dentes voava sobre o mar interior ocidental e provavelmente capturava peixes pterossauros sao parentes proximos dos dinossauros mas formam outro ramo fauna nao e dinossauro reptil voador cretaceo superior estados unidos kansas e estados vizinhos niobrara chalk"
    },
    {
      "id": "mosasaurus",
      "texto": "mosassauro mosasaurus hoffmannii mosasaurus lagarto do rio mosa carnivoria um enorme lagarto marinho do fim do cretaceo era um escamado adaptado a vida no mar com membros transformados em nadadeiras e uma cauda poderosa nao era dinossauro nem parente proximo dos golfinhos fauna nao e dinossauro lagarto marinho cretaceo superior paises baixos limburgo maastricht"
    },
    {
      "id": "smilodon-populator",
      "texto": "dente de sabre smilodon populator south american sabre toothed cat faca de dois gumes devastadora carnivoria um grande felino sul americano com caninos muito alongados tinha membros anteriores robustos e caninos frageis a forcas laterais provavelmente imobilizava grandes presas antes de usar uma mordida precisa fauna nao e dinossauro smilodon tigre dente de sabre quaternario brasil minas gerais e outras regioes depositos de cavernas do quaternario"
    },
    {
      "id": "gnathovorax",
      "texto": "gnatovorax gnathovorax cabreirai gnathovorax mandibula voraz de cabreira carnivoria um herrerassaurideo brasileiro preservado em um esqueleto excepcional o cranio quase completo e os dentes recurvados ajudam a investigar os primeiros dinossauros predadores sua posicao mostra que varios experimentos evolutivos ja existiam no triassico fauna dinossauro dinossauro predador brasileiro triassico brasil rio grande do sul formacao santa maria sequencia candelaria"
    },
    {
      "id": "carnotaurus",
      "texto": "carnotauro carnotaurus sastrei carnotaurus touro carnivoro de sastre carnivoria um predador sul americano de cranio curto chifres e bracos minusculos o holotipo preserva grande parte do esqueleto e impressoes de pele a cauda robusta sustentava musculos potentes embora as articulacoes sugiram menor agilidade em curvas fechadas fauna dinossauro dinossauro de chifres cretaceo superior argentina chubut la colonia"
    },
    {
      "id": "deinonychus",
      "texto": "deinonico deinonychus antirrhopus deinonychus garra terrivel que contrabalanca carnivoria o dromeossaurideo que ajudou a mudar a imagem dos dinossauros como animais ativos a grande garra curva do segundo dedo e o esqueleto leve chamaram atencao para locomocao equilibrio e parentesco com aves encontrar varios individuos proximos nao prova sozinho caca em grupo fauna dinossauro garra terrivel cretaceo estados unidos montana e wyoming cloverly"
    },
    {
      "id": "psittacosaurus",
      "texto": "psitacossauro psittacosaurus mongoliensis psittacosaurus lagarto papagaio da mongolia herbivoria um ceratopsiano inicial pequeno e bipede muito diferente de triceratops seu bico lembrava o de um papagaio mas ainda nao havia a grande gola nem os tres chifres ossos de idades diferentes ajudam a estudar como o corpo mudava durante o crescimento fauna dinossauro lagarto papagaio cretaceo mongolia deserto de gobi oosh"
    },
    {
      "id": "edmontosaurus",
      "texto": "edmontossauro edmontosaurus regalis edmontosaurus lagarto de edmonton real herbivoria um grande hadrossaurideo de bico largo e sem a crista tubular de parasaurolophus baterias de dentes substituiveis trituravam plantas cranios bem preservados permitem separar especies e acompanhar mudancas durante o crescimento fauna dinossauro hadrossauro sem crista tubular cretaceo superior canada alberta horseshoe canyon"
    },
    {
      "id": "tapejara",
      "texto": "tapejara tapejara wellnhoferi tapejara senhor do caminho em tupi dedicado a wellnhofer onivoria um pterossauro brasileiro de bico curto e grande crista ossea nao era dinossauro pertencia ao ramo irmao pterosauria a alimentacao exata continua incerta o bico sem dentes permite hipoteses mas nao preserva sozinho o cardapio fauna nao e dinossauro pterossauro brasileiro de crista cretaceo brasil bacia do araripe santana membro romualdo"
    },
    {
      "id": "pleuromeia",
      "texto": "pleuromeia pleuromeia sternbergii pleuromeia nome historico dedicado a forma da planta fotossintese uma licofita de caule simples que prosperou em paisagens estressadas apos a maior extincao em massa folhas em espiral cobriam o caule e um estrobilo produzia esporos no topo sua abundancia conta uma historia de ecossistemas pouco diversos tentando se recompor flora planta fossil fotossintese licofita do triassico triassico alemanha europa central buntsandstein"
    },
    {
      "id": "dicroidium",
      "texto": "dicroidium dicroidium zuberi dicroidium folha dividida em dois fotossintese uma folha bifurcada tipica de floras gondwanicas do triassico dicroidium e um genero de folhas fosseis associado a plantas com sementes hoje extintas ligar folhas madeira e estruturas reprodutivas exige fosseis encontrados em associacao por isso o ramo e marcado como interpretado flora planta fossil fotossintese samambaia com sementes do gondwana triassico brasil rio grande do sul santa maria membro passo das tropas"
    },
    {
      "id": "araucaria-mirabilis",
      "texto": "araucaria mirabilis araucaria mirabilis araucaria mirabilis araucaria admiravel fotossintese uma conifera jurassica conhecida por cones petrificados preservados em detalhe celular cinzas vulcanicas e silica conservaram cones sementes e madeira tomografias modernas revelam como as escamas se organizavam sem destruir o fossil flora planta fossil fotossintese cone petrificado da patagonia jurassico argentina santa cruz patagonia la matilde cerro cuadrado"
    },
    {
      "id": "ginkgoites-huttonii",
      "texto": "ginkgoites ginkgoites huttonii hutton s ginkgo folha semelhante a de ginkgo dedicada a william hutton fotossintese folhas em leque mostram que o ramo dos ginkgos ja fazia parte das paisagens jurassicas as nervuras se dividem repetidamente e ajudam a reconhecer essas folhas como folhas isoladas podem enganar o nome ginkgoites funciona como um genero forma e a ligacao com a planta inteira e apresentada com cautela flora planta fossil fotossintese ginkgo huttonii folha fossil de ginkgo jurassico reino unido yorkshire flora de yorkshire medio jurassico"
    },
    {
      "id": "archaefructus",
      "texto": "arqueofruto archaefructus liaoningensis archaefructus fruto antigo de liaoning fotossintese uma planta aquatica do cretaceo conhecida quase inteira inclusive com estruturas reprodutivas archaefructus foi importante no debate sobre as primeiras angiospermas a forma do eixo fertil e a ausencia aparente de petalas nao a transformam automaticamente na ancestral direta das flores modernas flora planta fossil fotossintese planta aquatica de liaoning cretaceo china liaoning yixian"
    },
    {
      "id": "duartenia",
      "texto": "duartenia duartenia araripensis duartenia planta do araripe dedicada ao paleobotanico lelio duarte fotossintese uma gimnosperma brasileira de ramos bifurcados adaptada a ambientes secos do cretaceo o eixo lenhoso e a ramificacao ajudam a reconhecer duartenia sua possivel ligacao com cheirolepidiaceae continua incerta o galho tracejado da arvore comunica essa duvida flora planta fossil fotossintese conifera da formacao crato cretaceo brasil bacia do araripe ceara crato"
    },
    {
      "id": "gorilla-beringei",
      "texto": "gorila oriental gorilla beringei gorilla beringei gorila de beringe herbivoria frugivoria folivoria gorila oriental integra o ramo gorilla da arvore da vida uma das duas especies atuais de gorila populacoes vivem em florestas de montanha e de planicie na africa centro oriental fauna nao e dinossauro quaternario republica democratica do congo ruanda e uganda africa centro oriental populacoes atuais"
    },
    {
      "id": "gorilla-gorilla",
      "texto": "gorila ocidental gorilla gorilla gorilla gorilla gorila herbivoria frugivoria folivoria gorila ocidental integra o ramo gorilla da arvore da vida especie atual de gorila das florestas da africa ocidental e central com populacoes e habitats distintos fauna nao e dinossauro quaternario gabao camaroes e paises vizinhos africa centro ocidental populacoes atuais"
    },
    {
      "id": "homo-sapiens",
      "texto": "humano moderno homo sapiens homo sapiens humano sabio onivoria humano moderno integra o ramo homo da arvore da vida nossa especie surgiu na africa e hoje vive em todos os continentes populacoes humanas sempre estiveram conectadas por migracoes e encontros fauna nao e dinossauro quaternario global origem africana distribuicao global atual registros fosseis e populacoes atuais"
    },
    {
      "id": "pan-paniscus",
      "texto": "bonobo pan paniscus pan paniscus pan pequeno frugivoria folivoria onivoria bonobo integra o ramo pan da arvore da vida grande simio atual do genero pan distinto do chimpanze comum e restrito a bacia central do congo fauna nao e dinossauro quaternario republica democratica do congo bacia do congo ao sul do rio congo populacoes atuais"
    },
    {
      "id": "pan-troglodytes",
      "texto": "chimpanze comum pan troglodytes pan troglodytes pan habitante de cavernas frugivoria folivoria onivoria chimpanze comum integra o ramo pan da arvore da vida especie atual de grande simio africano compartilha conosco um ancestral comum mas nao e um ancestral humano fauna nao e dinossauro quaternario varios paises africanos africa equatorial populacoes atuais"
    },
    {
      "id": "pongo-abelii",
      "texto": "orangotango de sumatra pongo abelii pongo abelii pongo de abel frugivoria folivoria orangotango de sumatra integra o ramo pongo da arvore da vida uma das tres especies atuais de orangotango adaptada a vida nas florestas de sumatra fauna nao e dinossauro quaternario indonesia norte de sumatra populacoes atuais"
    },
    {
      "id": "pongo-pygmaeus",
      "texto": "orangotango de borneu pongo pygmaeus pongo pygmaeus pongo pigmeu frugivoria folivoria orangotango de borneu integra o ramo pongo da arvore da vida especie atual de orangotango de borneu o desmatamento ameaca populacoes que dependem da floresta fauna nao e dinossauro quaternario indonesia e malasia ilha de borneu populacoes atuais"
    },
    {
      "id": "pongo-tapanuliensis",
      "texto": "orangotango de tapanuli pongo tapanuliensis pongo tapanuliensis pongo de tapanuli frugivoria folivoria orangotango de tapanuli integra o ramo pongo da arvore da vida especie reconhecida em 2017 a partir de evidencias morfologicas e geneticas de uma pequena populacao de sumatra fauna nao e dinossauro quaternario indonesia batang toru sumatra populacoes atuais"
    },
    {
      "id": "sahelanthropus-tchadensis",
      "texto": "sahelanthropus sahelanthropus tchadensis sahelanthropus tchadensis homem do sahel onivoria sahelanthropus integra o ramo sahelanthropus lineage da arvore da vida cranio e partes cranianas mostram uma combinacao antiga de caracteristicas sua posicao exata perto da base dos homininios continua debatida fauna nao e dinossauro neogeno africa central africa central chade"
    },
    {
      "id": "orrorin-tugenensis",
      "texto": "orrorin orrorin tugenensis orrorin tugenensis homem original de tugen onivoria orrorin integra o ramo orrorin lineage da arvore da vida ossos do femur e dentes sao usados para discutir locomocao e dieta com relacoes filogeneticas ainda incertas fauna nao e dinossauro neogeno quenia quenia formacao lukeino"
    },
    {
      "id": "ardipithecus-kadabba",
      "texto": "ardipithecus kadabba ardipithecus kadabba ardipithecus kadabba ardipithecus ancestral basal onivoria ardipithecus kadabba integra o ramo ardipithecus da arvore da vida conhecido por dentes e partes do esqueleto representa um ramo muito antigo proximo a origem dos homininios fauna nao e dinossauro neogeno etiopia etiopia afar"
    },
    {
      "id": "ardipithecus-ramidus",
      "texto": "ardi ardipithecus ramidus ardipithecus ramidus simio do chao na raiz onivoria ardi integra o ramo ardipithecus da arvore da vida o esqueleto parcial ardi combina adaptacoes para subir em arvores e deslocar se no solo fauna nao e dinossauro neogeno etiopia etiopia aramis"
    },
    {
      "id": "australopithecus-anamensis",
      "texto": "australopithecus anamensis australopithecus anamensis australopithecus anamensis simio austral do lago onivoria australopithecus anamensis integra o ramo australopithecus da arvore da vida mandibulas dentes e ossos de membros registram um australopiteco muito antigo fauna nao e dinossauro neogeno quenia e etiopia quenia e etiopia kanapoi e allia bay"
    },
    {
      "id": "australopithecus-afarensis",
      "texto": "australopithecus afarensis australopithecus afarensis australopithecus afarensis simio austral de afar onivoria australopithecus afarensis integra o ramo australopithecus da arvore da vida inclui lucy e fosseis associados a locomocao bipede embora ainda conservasse adaptacoes para escalar fauna nao e dinossauro neogeno etiopia e tanzania etiopia e tanzania hadar e laetoli"
    },
    {
      "id": "australopithecus-africanus",
      "texto": "australopithecus africanus australopithecus africanus australopithecus africanus simio austral africano onivoria australopithecus africanus integra o ramo australopithecus da arvore da vida cranios e esqueletos mostram bipedalismo e um mosaico de caracteristicas faciais e dentarias fauna nao e dinossauro neogeno africa do sul africa do sul taung sterkfontein e makapansgat"
    },
    {
      "id": "australopithecus-garhi",
      "texto": "australopithecus garhi australopithecus garhi australopithecus garhi simio austral surpresa onivoria australopithecus garhi integra o ramo australopithecus da arvore da vida especie conhecida por poucos fosseis sua relacao com homo permanece incerta fauna nao e dinossauro quaternario etiopia etiopia bouri"
    },
    {
      "id": "australopithecus-sediba",
      "texto": "australopithecus sediba australopithecus sediba australopithecus sediba simio austral da fonte onivoria australopithecus sediba integra o ramo australopithecus da arvore da vida esqueletos bem preservados combinam caracteristicas australopitecineas e outras semelhantes as de homo fauna nao e dinossauro quaternario africa do sul africa do sul malapa"
    },
    {
      "id": "paranthropus-aethiopicus",
      "texto": "paranthropus aethiopicus paranthropus aethiopicus paranthropus aethiopicus parente do homem da etiopia onivoria paranthropus aethiopicus integra o ramo paranthropus da arvore da vida cranio e mandibulas robustas ajudam a estudar a diversificacao dos parantropos fauna nao e dinossauro neogeno etiopia e quenia etiopia e quenia omo e turkana"
    },
    {
      "id": "paranthropus-boisei",
      "texto": "paranthropus boisei paranthropus boisei paranthropus boisei parente do homem de boise onivoria paranthropus boisei integra o ramo paranthropus da arvore da vida grandes dentes posteriores e uma face robusta indicam especializacoes mastigatorias sem definir sozinhos uma dieta unica fauna nao e dinossauro quaternario africa oriental africa oriental olduvai koobi fora e omo"
    },
    {
      "id": "paranthropus-robustus",
      "texto": "paranthropus robustus paranthropus robustus paranthropus robustus parente robusto do homem onivoria paranthropus robustus integra o ramo paranthropus da arvore da vida fosseis cranianos e dentarios registram um ramo robusto sul africano fauna nao e dinossauro quaternario africa do sul africa do sul swartkrans kromdraai e drimolen"
    },
    {
      "id": "kenyanthropus-platyops",
      "texto": "kenyanthropus kenyanthropus platyops kenyanthropus platyops homem de face plana do quenia onivoria kenyanthropus integra o ramo kenyanthropus da arvore da vida a face relativamente plana motivou um novo genero mas a deformacao do fossil e sua posicao continuam debatidas fauna nao e dinossauro neogeno quenia quenia lomekwi"
    },
    {
      "id": "homo-habilis",
      "texto": "homo habilis homo habilis homo habilis humano habilidoso onivoria homo habilis integra o ramo homo da arvore da vida fosseis variados foram reunidos sob este nome limites com outras especies de homo ainda sao discutidos fauna nao e dinossauro quaternario tanzania e quenia tanzania e quenia olduvai e koobi fora"
    },
    {
      "id": "homo-rudolfensis",
      "texto": "homo rudolfensis homo rudolfensis homo rudolfensis humano do lago rudolf onivoria homo rudolfensis integra o ramo homo da arvore da vida cranios atribuidos a especie diferem de h habilis mas a amostra e a classificacao continuam debatidas fauna nao e dinossauro quaternario quenia quenia koobi fora"
    },
    {
      "id": "homo-erectus",
      "texto": "homo erectus homo erectus homo erectus humano ereto onivoria homo erectus integra o ramo homo da arvore da vida foi um dos homininios mais duradouros e geograficamente amplos com grande variacao entre fosseis fauna nao e dinossauro quaternario africa e eurasia africa e eurasia africa caucaso e asia"
    },
    {
      "id": "homo-heidelbergensis",
      "texto": "homo heidelbergensis homo heidelbergensis homo heidelbergensis humano de heidelberg onivoria homo heidelbergensis integra o ramo homo da arvore da vida nome usado para fosseis do pleistoceno medio quais exemplares pertencem a especie e tema de debate fauna nao e dinossauro quaternario africa e europa africa e europa sitios da africa e europa"
    },
    {
      "id": "homo-neanderthalensis",
      "texto": "neandertal homo neanderthalensis homo neanderthalensis humano do vale de neander onivoria neandertal integra o ramo homo da arvore da vida parentes humanos proximos adaptados a ambientes variados e ligados a humanos modernos por fluxo genico fauna nao e dinossauro quaternario europa e asia ocidental europa e asia ocidental cavernas e sitios da eurasia ocidental"
    },
    {
      "id": "homo-naledi",
      "texto": "homo naledi homo naledi homo naledi humano estrela onivoria homo naledi integra o ramo homo da arvore da vida muitos ossos revelam uma combinacao incomum de caracteristicas sua posicao na arvore de homo permanece incerta fauna nao e dinossauro quaternario africa do sul africa do sul dinaledi e lesedi"
    },
    {
      "id": "homo-floresiensis",
      "texto": "homo floresiensis homo floresiensis homo floresiensis humano de flores onivoria homo floresiensis integra o ramo homo da arvore da vida fosseis de pequeno porte encontrados na ilha de flores mostram uma historia insular singular fauna nao e dinossauro quaternario indonesia indonesia caverna liang bua"
    },
    {
      "id": "dickinsonia-costata",
      "texto": "dickinsonia dickinsonia costata dickinsonia costata organismo de dickinson desconhecida dickinsonia integra o ramo dickinsoniidae da arvore da vida corpo achatado e segmentado conhecido por impressoes biomarcadores apoiam afinidade animal mas sua posicao exata continua incerta fauna nao e dinossauro ediacarano australia australia do sul e outros registros ediacaranos ediacara member"
    },
    {
      "id": "anomalocaris-canadensis",
      "texto": "anomalocaris anomalocaris canadensis anomalocaris canadensis camarao estranho do canada carnivoria anomalocaris integra o ramo anomalocarididae da arvore da vida radiodonte marinho com apendices frontais olhos compostos e boca circular reconstruido a partir de partes antes confundidas com animais separados fauna nao e dinossauro cambriano canada columbia britanica burgess shale"
    },
    {
      "id": "tiktaalik-roseae",
      "texto": "tiktaalik tiktaalik roseae tiktaalik roseae grande peixe de agua rasa carnivoria tiktaalik integra o ramo elpistostegalia da arvore da vida peixe de nadadeiras lobadas com pescoco movel e ossos de nadadeira comparaveis aos membros dos tetrapodes fauna nao e dinossauro devoniano canada ilha ellesmere nunavut fram formation"
    },
    {
      "id": "acanthostega-gunnari",
      "texto": "acanthostega acanthostega gunnari acanthostega gunnari teto espinhoso de gunnar carnivoria acanthostega integra o ramo acanthostegidae da arvore da vida tetrapode inicial com oito dedos em cada membro e muitas adaptacoes aquaticas fauna nao e dinossauro devoniano groenlandia groenlandia oriental aina dal formation"
    },
    {
      "id": "rhynia-gwynne-vaughanii",
      "texto": "rhynia rhynia gwynne vaughanii rhynia gwynne vaughanii planta de rhynie fotossintese rhynia integra o ramo rhyniaceae da arvore da vida planta vascular pequena sem folhas verdadeiras preservada em silica com detalhes celulares extraordinarios flora planta fossil fotossintese devoniano reino unido aberdeenshire escocia rhynie chert"
    },
    {
      "id": "calamites-suckowii",
      "texto": "calamites calamites suckowii calamites suckowii caule semelhante a junco fotossintese calamites integra o ramo calamitaceae da arvore da vida parente arborescente das cavalinhas com caules articulados e crescimento em florestas pantanosas flora planta fossil fotossintese carbonifero registros na europa e america do norte laurussia tropical depositos de carvao do carbonifero"
    },
    {
      "id": "glossopteris-indica",
      "texto": "glossopteris glossopteris indica glossopteris indica folha em forma de lingua da india fotossintese glossopteris integra o ramo glossopteridaceae da arvore da vida planta com sementes conhecida por folhas em forma de lingua sua ampla distribuicao ajudou a demonstrar a antiga uniao dos continentes austrais flora planta fossil fotossintese permiano gondwana america do sul africa india antartica e australia camadas permianas de gondwana"
    },
    {
      "id": "cycadeoidea",
      "texto": "cycadeoidea cycadeoidea cycadeoidea semelhante a uma cicadacea fotossintese cycadeoidea integra o ramo bennettitaceae da arvore da vida genero de bennettitales com troncos robustos e estruturas reprodutivas complexas superficialmente parecido com cicadaceas flora planta fossil fotossintese jurassico distribuicao ampla registros em varios continentes depositos jurassicos e cretaceos"
    }
  ],
  "buscaEditorial": [
    {
      "id": "arvore-ou-escada",
      "tipo": "publicacao",
      "slug": "arvore-ou-escada",
      "titulo": "Árvore ou escada?",
      "texto": "arvore ou escada equipe editorial dinopad a ideia principal a evolucao nao e uma fila que sobe em direcao aos humanos ela se parece mais com uma arvore populacoes se separam ramos coexistem e muitos terminam sem deixar descendentes atuais como ler o desenho as pontas representam os grupos estudados os encontros entre galhos representam ancestrais comuns inferidos a posicao no alto ou a direita nao significa ser melhor mais inteligente ou mais evoluido"
    },
    {
      "id": "familia-humana",
      "tipo": "publicacao",
      "slug": "familia-humana",
      "titulo": "Quem pertence à família humana?",
      "texto": "quem pertence a familia humana equipe editorial dinopad uma familia compartilhada hominidae reune os grandes simios atuais orangotangos gorilas chimpanzes bonobos e humanos e seus parentes extintos hominideo nao e sinonimo de humano antigo um ramo mais estreito homininios no uso adotado pelo dinopad sao os membros do ramo humano depois da separacao do ramo de chimpanzes e bonobos a posicao de fosseis muito antigos ainda pode ser debatida"
    },
    {
      "id": "eva-mitocondrial-explicada",
      "tipo": "publicacao",
      "slug": "eva-mitocondrial-explicada",
      "titulo": "O que “Eva mitocondrial” realmente significa?",
      "texto": "o que eva mitocondrial realmente significa equipe editorial dinopad uma ancestral de uma linha genetica seguindo para tras o dna das mitocondrias de pessoas atuais as linhagens acabam convergindo em uma ancestral comum o apelido eva mitocondrial descreve esse resultado genealogico o apelido nao diz ela nao foi a primeira mulher a unica mulher viva nem nossa unica ancestral outras pessoas de seu tempo podem ser ancestrais de todos nos por milhares de outros caminhos no genoma"
    },
    {
      "id": "migracoes-e-encontros",
      "tipo": "publicacao",
      "slug": "migracoes-e-encontros",
      "titulo": "Migrações e encontros entre diferentes humanos",
      "texto": "migracoes e encontros entre diferentes humanos equipe editorial dinopad movimentos em muitas direcoes homo sapiens surgiu na africa mas a historia posterior nao foi uma unica saida em linha reta populacoes se expandiram se separaram voltaram e encontraram outros grupos humanos ramos que voltaram a se tocar genomas antigos mostraram fluxo genico entre ancestrais de humanos modernos neandertais e denisovanos a arvore descreve separacoes conexoes adicionais registram os reencontros"
    },
    {
      "id": "fosseis-e-dna-antigo",
      "tipo": "publicacao",
      "slug": "fosseis-e-dna-antigo",
      "titulo": "Como fósseis e DNA antigo produzem conhecimento",
      "texto": "como fosseis e dna antigo produzem conhecimento equipe editorial dinopad evidencias diferentes se completam fosseis registram anatomia e quando o contexto e preservado lugar e idade dna antigo pode revelar parentesco e fluxo genico nenhuma dessas linhas responde sozinha a todas as perguntas preservacao decide o que podemos perguntar dna se quebra sofre alteracoes quimicas e recebe contaminacao moderna calor e umidade aceleram a perda portanto muitos fosseis importantes jamais fornecerao um genoma utilizavel"
    },
    {
      "id": "revolucao-dna-antigo",
      "tipo": "publicacao",
      "slug": "revolucao-dna-antigo",
      "titulo": "A revolução do DNA antigo — o que a genética conta sobre o passado?",
      "texto": "a revolucao do dna antigo o que a genetica conta sobre o passado yoav mathov liran carmel resumo o dna contem instrucoes para construir e manter organismos novas tecnicas permitem recuperar dna de restos antigos e investigar mudancas evolutivas neandertais denisovanos e extincoes a grande ideia sequenciar dna antigo abre uma janela independente dos ossos e objetos mas moleculas degradadas e contaminacao exigem metodos rigorosos"
    },
    {
      "id": "dna-neandertal",
      "tipo": "publicacao",
      "slug": "dna-neandertal",
      "titulo": "Por que alguns humanos têm DNA neandertal?",
      "texto": "por que alguns humanos tem dna neandertal jente ottenburghs resumo humanos modernos e neandertais tiveram descendentes esse fluxo de dna e chamado introgressao e alguns segmentos arcaicos permanecem em populacoes atuais selecao segmentos podem diminuir por cruzamentos e acaso persistir sem efeito ou mudar de frequencia quando afetam reproducao e sobrevivencia"
    },
    {
      "id": "dna-historia-humana",
      "tipo": "publicacao",
      "slug": "dna-historia-humana",
      "titulo": "O que nosso DNA pode contar sobre a história humana",
      "texto": "o que nosso dna pode contar sobre a historia humana leo speidel clare bycroft resumo trechos de dna passam por caminhos diferentes de ancestrais matematica estatistica e computadores ajudam a reconstruir arvores genealogicas de cada trecho tres escalas essas arvores informam a historia antiga diferencas regionais recentes e misturas entre populacoes em movimento"
    },
    {
      "id": "leitura-cann-1987",
      "tipo": "publicacao",
      "slug": "leitura-cann-1987",
      "titulo": "Leitura guiada: Cann, Stoneking e Wilson (1987)",
      "texto": "leitura guiada cann stoneking e wilson 1987 equipe editorial dinopad a pergunta o estudo investigou se diferencas no dna mitocondrial de pessoas vivas poderiam reconstruir a genealogia materna recente de nossa especie e indicar onde ela tinha maior profundidade o lugar do artigo na historia a analise apoiou raizes africanas para as linhagens mitocondriais amostradas foi influente mas nao descobriu a primeira mulher e nao encerrou a discussao sobre amostras modelos ou datas"
    },
    {
      "id": "leitura-green-2010",
      "tipo": "publicacao",
      "slug": "leitura-green-2010",
      "titulo": "Leitura guiada: o genoma Neandertal (2010)",
      "texto": "leitura guiada o genoma neandertal 2010 equipe editorial dinopad a mudanca de visao o rascunho do genoma neandertal mostrou que a separacao entre populacoes humanas nao impediu reencontros houve fluxo genico com ancestrais de humanos modernos por que a evidencia foi forte o resultado veio de padroes repetidos em muitas posicoes do genoma controles de dano e contaminacao e comparacoes entre neandertais humanos atuais e chimpanzes"
    },
    {
      "id": "leitura-reich-2010",
      "tipo": "publicacao",
      "slug": "leitura-reich-2010",
      "titulo": "Leitura guiada: Denisovanos (2010)",
      "texto": "leitura guiada denisovanos 2010 equipe editorial dinopad uma populacao reconhecida pelo dna um pequeno fragmento de dedo encontrado na caverna de denisova preservou um genoma que nao pertencia nem a humanos modernos nem a neandertais o que a comparacao revelou a linhagem era proxima dos neandertais e contribuiu geneticamente para ancestrais de algumas populacoes atuais o artigo evitou transformar automaticamente a linhagem em uma especie formal"
    },
    {
      "id": "leitura-berger-2015",
      "tipo": "publicacao",
      "slug": "leitura-berger-2015",
      "titulo": "Leitura guiada: a descrição de Homo naledi (2015)",
      "texto": "leitura guiada a descricao de homo naledi 2015 equipe editorial dinopad um conjunto incomum a camara dinaledi preservou mais de 1 500 elementos fosseis atribuidos a pelo menos 15 individuos permitindo comparar diferentes partes do corpo e fases da vida a licao que veio depois a descricao reconheceu uma anatomia em mosaico e propos homo naledi a idade ainda era desconhecida em 2015 datacoes publicadas em 2017 situaram o material entre 236 e 335 mil anos"
    },
    {
      "id": "termos-familia-humana",
      "tipo": "dossie",
      "slug": "termos-familia-humana",
      "titulo": "Hominídeo, hominíneo, hominínio e humano",
      "texto": "hominideo hominineo homininio e humano palavras parecidas apontam para ramos diferentes quatro nomes quatro grupos hominideo inclui os grandes simios e seus parentes hominineo e um ramo interno homininio reune humanos e fosseis mais proximos de nos do que de chimpanzes o que esses nomes nao medem os nomes indicam inclusao em grupos nao graus de inteligencia valor ou progresso hominideo por exemplo inclui orangotangos gorilas chimpanzes humanos e seus parentes fosseis como conferir na arvore comece em hominidae e siga os grupos aninhados ate hominini e homo cada nome delimita um ramo nenhum deles representa uma fila de especies"
    },
    {
      "id": "arvore-nao-escada",
      "tipo": "dossie",
      "slug": "arvore-nao-escada",
      "titulo": "Árvore, não escada evolutiva",
      "texto": "arvore nao escada evolutiva evolucao produz ramificacoes nao uma fila rumo ao presente por que a evolucao se ramifica especies podem coexistir extinguir se ou deixar descendentes um fossil semelhante a nos nao precisa ser nosso ancestral direto parecido nao significa ancestral direto um fossil pode compartilhar caracteristicas com nossa linhagem e ainda pertencer a um ramo lateral ancestralidade direta exige evidencias mais especificas do que semelhanca como a incerteza aparece galhos tracejados indicam relacoes provaveis ou debatidas quando a ordem das separacoes nao esta resolvida varios galhos partem do mesmo ponto em uma polytomia"
    },
    {
      "id": "eva-mitocondrial",
      "tipo": "dossie",
      "slug": "eva-mitocondrial",
      "titulo": "“Eva mitocondrial”: significado e limites",
      "texto": "eva mitocondrial significado e limites um apelido para um resultado genealogico nao para a primeira mulher uma linhagem materna ao seguir apenas o dna mitocondrial atual para tras as linhagens convergem em uma ancestral comum outras mulheres viveram no mesmo tempo e tambem podem ser ancestrais genealogicas nossas muitas mulheres tambem deixaram descendentes a ancestral mitocondrial comum nao vivia sozinha e nao era a primeira mulher outras mulheres do mesmo periodo podem ser ancestrais genealogicas de pessoas atuais mesmo que suas linhas exclusivamente maternas tenham terminado cada parte do genoma conta uma historia o dna mitocondrial e apenas uma pequena parte da heranca outros genes coalescem em pessoas e datas diferentes por isso nao existe uma unica eva evolutiva que concentre toda a origem humana"
    },
    {
      "id": "ancestral-y",
      "tipo": "dossie",
      "slug": "ancestral-y",
      "titulo": "Ancestral patrilinear do cromossomo Y",
      "texto": "ancestral patrilinear do cromossomo y o cromossomo y tambem permite seguir uma linha especifica de heranca uma linha paterna especifica as linhagens atuais do y coalescem em um ancestral comum mas a data estimada depende das amostras modelos e mutacoes usadas nao e um casal fundador o ancestral do y e a ancestral mitocondrial podem ter vivido em epocas diferentes eles nao precisam ter se encontrado e nao concentram o restante da ancestralidade humana por que a estimativa pode mudar novas amostras taxas de mutacao e modelos populacionais alteram a data calculada para a coalescencia o conceito permanece mas o intervalo numerico e revisavel"
    },
    {
      "id": "coalescencia",
      "tipo": "dossie",
      "slug": "coalescencia",
      "titulo": "Coalescência e genealogias diferentes",
      "texto": "coalescencia e genealogias diferentes cada trecho de dna pode contar uma genealogia propria voltar no tempo por um trecho de dna recombinacao mistura trechos herdados ao voltar no tempo as copias de um trecho coalescem em ancestrais comuns em datas que variam de trecho para trecho arvore de gene e arvore de especies uma arvore feita com um trecho de dna nao deve ser confundida automaticamente com a historia completa das populacoes ou das especies por que varias genealogias sao necessarias recombinacao e acaso fazem diferentes trechos seguirem caminhos distintos pesquisadores comparam muitas regioes do genoma e testam se o conjunto apoia a mesma hipotese"
    },
    {
      "id": "origem-africana-dispersoes",
      "tipo": "dossie",
      "slug": "origem-africana-dispersoes",
      "titulo": "Origem africana e dispersões de Homo",
      "texto": "origem africana e dispersoes de homo a historia humana envolve multiplos movimentos encontros e retornos origem africana muitos movimentos homo sapiens surgiu na africa populacoes se dispersaram para fora do continente em ondas enquanto movimentos de volta e encontros conectaram novamente regioes dispersao nao foi uma viagem unica populacoes avancaram recuaram se separaram e voltaram a se encontrar uma seta em um mapa resume processos que ocorreram durante muitas geracoes como interpretar os mapas fronteiras atuais nao existiam na pre historia datas sitios fosseis e dna delimitam rotas possiveis nao trajetos exatos percorridos por uma unica familia"
    },
    {
      "id": "neandertais-denisovanos",
      "tipo": "dossie",
      "slug": "neandertais-denisovanos",
      "titulo": "Neandertais, Denisovanos e fluxo gênico",
      "texto": "neandertais denisovanos e fluxo genico ramos distintos puderam trocar genes quando populacoes se encontraram o que os genomas revelaram genomas antigos mostraram que a historia nao foi substituicao total segmentos neandertais e denisovanos permanecem em populacoes atuais em frequencias variadas ramos distintos ainda podem se encontrar separacao populacional nao impede todo contato posterior as conexoes de fluxo genico aparecem sobre a arvore porque representam encontros nao novos galhos principais um fragmento pode guardar uma populacao denisova 3 era apenas parte de uma falange o dna preservado permitiu reconhecer uma linhagem antes que houvesse um esqueleto completo associado a ela"
    },
    {
      "id": "dna-antigo-metodo",
      "tipo": "dossie",
      "slug": "dna-antigo-metodo",
      "titulo": "Recuperação e interpretação de DNA antigo",
      "texto": "recuperacao e interpretacao de dna antigo dna antigo e fragmentado raro e vulneravel a contaminacao como reconhecer dna realmente antigo laboratorios usam salas limpas controles e padroes de dano molecular para distinguir sequencias antigas de dna moderno uma sequencia nao fala sozinha contexto arqueologico datacao anatomia e modelos populacionais precisam concordar um resultado isolado deve sobreviver a controles e tentativas de repeticao o caminho ate uma conclusao amostragem extracao sequenciamento comparacao e revisao deixam registros verificaveis contaminacao e dano molecular sao medidos nao apenas mencionados como possibilidades"
    }
  ],
  "filogenia": {
    "raizId": "eukaryota",
    "organismosPorNo": {
      "eukaryota": [],
      "archaeplastida": [],
      "viridiplantae": [],
      "tracheophyta": [],
      "lycophyta": [],
      "isoetales": [],
      "pleuromeiaceae": [
        "pleuromeia"
      ],
      "spermatophyta": [],
      "corystospermales": [
        "dicroidium"
      ],
      "gymnospermae": [],
      "coniferales": [],
      "araucariaceae": [
        "araucaria-mirabilis"
      ],
      "gnetophyta": [],
      "angiospermae": [],
      "magnoliales": [],
      "monocotyledoneae": [],
      "opisthokonta": [],
      "metazoa": [],
      "chordata": [],
      "amniota": [],
      "synapsida": [],
      "sphenacodontidae": [
        "dimetrodon"
      ],
      "mammalia": [],
      "carnivora": [],
      "felidae": [],
      "machairodontinae": [
        "smilodon-populator"
      ],
      "sauropsida": [],
      "lepidosauromorpha": [],
      "squamata": [],
      "mosasauroidea": [
        "mosasaurus"
      ],
      "archosauromorpha": [],
      "archosauria": [],
      "pterosauria": [],
      "pterodactyloidea": [],
      "pteranodontidae": [
        "pteranodon"
      ],
      "tapejaridae": [
        "tapejara"
      ],
      "dinosauria": [],
      "saurischia": [],
      "herrerasauria": [],
      "herrerasauridae": [
        "staurikosaurus",
        "gnathovorax"
      ],
      "eusaurischia": [],
      "sauropodomorpha": [],
      "buriolestidae": [
        "buriolestes"
      ],
      "plateosauridae": [
        "plateosaurus"
      ],
      "sauropoda": [],
      "diplodocidae": [
        "diplodocus"
      ],
      "macronaria": [],
      "brachiosauridae": [
        "brachiosaurus"
      ],
      "titanosauria": [
        "austroposeidon",
        "uberabatitan"
      ],
      "theropoda": [],
      "coelophysoidea": [
        "coelophysis"
      ],
      "ceratosauria": [],
      "noasauridae": [
        "berthasaura"
      ],
      "abelisauridae": [
        "carnotaurus"
      ],
      "tetanurae": [],
      "megalosauroidea": [],
      "spinosauridae": [
        "spinosaurus",
        "irritator"
      ],
      "avetheropoda": [],
      "allosauroidea": [
        "allosaurus"
      ],
      "coelurosauria": [],
      "tyrannosauroidea": [
        "tyrannosaurus-rex"
      ],
      "maniraptora": [],
      "dromaeosauridae": [
        "velociraptor",
        "deinonychus"
      ],
      "avialae": [
        "archaeopteryx"
      ],
      "ornithischia": [],
      "thyreophora": [],
      "stegosauria": [
        "stegosaurus"
      ],
      "ankylosauria": [
        "ankylosaurus"
      ],
      "neornithischia": [],
      "marginocephalia": [],
      "ceratopsia": [],
      "psittacosauridae": [
        "psittacosaurus"
      ],
      "ceratopsidae": [
        "triceratops"
      ],
      "ornithopoda": [],
      "iguanodontia": [],
      "iguanodontidae": [
        "iguanodon"
      ],
      "hadrosauridae": [],
      "saurolophinae": [
        "edmontosaurus"
      ],
      "lambeosaurinae": [
        "parasaurolophus"
      ],
      "ginkgoales": [],
      "ginkgoites-lineage": [
        "ginkgoites-huttonii"
      ],
      "archaefructaceae": [],
      "archaefructus-lineage": [
        "archaefructus"
      ],
      "duartenia-lineage": [
        "duartenia"
      ],
      "vertebrata": [],
      "tetrapodomorpha": [],
      "elpistostegalia": [
        "tiktaalik-roseae"
      ],
      "tetrapoda": [],
      "acanthostegidae": [
        "acanthostega-gunnari"
      ],
      "arthropoda": [],
      "radiodonta": [],
      "anomalocarididae": [
        "anomalocaris-canadensis"
      ],
      "dickinsoniidae": [
        "dickinsonia-costata"
      ],
      "primates": [],
      "haplorhini": [],
      "simiiformes": [],
      "catarrhini": [],
      "hominoidea": [],
      "hominidae": [],
      "ponginae": [],
      "pongo": [
        "pongo-abelii",
        "pongo-pygmaeus",
        "pongo-tapanuliensis"
      ],
      "homininae": [],
      "gorillini": [],
      "gorilla": [
        "gorilla-beringei",
        "gorilla-gorilla"
      ],
      "hominini": [],
      "panina": [],
      "pan": [
        "pan-paniscus",
        "pan-troglodytes"
      ],
      "hominina": [],
      "sahelanthropus-lineage": [
        "sahelanthropus-tchadensis"
      ],
      "orrorin-lineage": [
        "orrorin-tugenensis"
      ],
      "ardipithecus": [
        "ardipithecus-kadabba",
        "ardipithecus-ramidus"
      ],
      "australopithecina": [],
      "australopithecus": [
        "australopithecus-anamensis",
        "australopithecus-afarensis",
        "australopithecus-africanus",
        "australopithecus-garhi",
        "australopithecus-sediba"
      ],
      "kenyanthropus": [
        "kenyanthropus-platyops"
      ],
      "paranthropus": [
        "paranthropus-aethiopicus",
        "paranthropus-boisei",
        "paranthropus-robustus"
      ],
      "homo": [
        "homo-sapiens",
        "homo-habilis",
        "homo-rudolfensis",
        "homo-erectus",
        "homo-heidelbergensis",
        "homo-neanderthalensis",
        "homo-naledi",
        "homo-floresiensis"
      ],
      "euphyllophyta": [],
      "rhyniopsida": [],
      "rhyniaceae": [
        "rhynia-gwynne-vaughanii"
      ],
      "sphenopsida": [],
      "calamitaceae": [
        "calamites-suckowii"
      ],
      "glossopteridales": [],
      "glossopteridaceae": [
        "glossopteris-indica"
      ],
      "bennettitales": [],
      "bennettitaceae": [
        "cycadeoidea"
      ]
    },
    "nos": [
      {
        "id": "eukaryota",
        "paiId": null,
        "filhoIds": [
          "archaeplastida",
          "opisthokonta"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pleuromeia",
          "rhynia-gwynne-vaughanii",
          "calamites-suckowii",
          "dicroidium",
          "glossopteris-indica",
          "araucaria-mirabilis",
          "duartenia",
          "ginkgoites-huttonii",
          "cycadeoidea",
          "archaefructus",
          "anomalocaris-canadensis",
          "dickinsonia-costata",
          "tiktaalik-roseae",
          "acanthostega-gunnari",
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota"
        ]
      },
      {
        "id": "archaeplastida",
        "paiId": "eukaryota",
        "filhoIds": [
          "viridiplantae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pleuromeia",
          "rhynia-gwynne-vaughanii",
          "calamites-suckowii",
          "dicroidium",
          "glossopteris-indica",
          "araucaria-mirabilis",
          "duartenia",
          "ginkgoites-huttonii",
          "cycadeoidea",
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida"
        ]
      },
      {
        "id": "viridiplantae",
        "paiId": "archaeplastida",
        "filhoIds": [
          "tracheophyta"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pleuromeia",
          "rhynia-gwynne-vaughanii",
          "calamites-suckowii",
          "dicroidium",
          "glossopteris-indica",
          "araucaria-mirabilis",
          "duartenia",
          "ginkgoites-huttonii",
          "cycadeoidea",
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae"
        ]
      },
      {
        "id": "tracheophyta",
        "paiId": "viridiplantae",
        "filhoIds": [
          "lycophyta",
          "rhyniopsida",
          "euphyllophyta"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pleuromeia",
          "rhynia-gwynne-vaughanii",
          "calamites-suckowii",
          "dicroidium",
          "glossopteris-indica",
          "araucaria-mirabilis",
          "duartenia",
          "ginkgoites-huttonii",
          "cycadeoidea",
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta"
        ]
      },
      {
        "id": "lycophyta",
        "paiId": "tracheophyta",
        "filhoIds": [
          "isoetales"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pleuromeia"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "lycophyta"
        ]
      },
      {
        "id": "isoetales",
        "paiId": "lycophyta",
        "filhoIds": [
          "pleuromeiaceae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pleuromeia"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "lycophyta",
          "isoetales"
        ]
      },
      {
        "id": "pleuromeiaceae",
        "paiId": "isoetales",
        "filhoIds": [],
        "organismoIds": [
          "pleuromeia"
        ],
        "descendenteIds": [
          "pleuromeia"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "lycophyta",
          "isoetales",
          "pleuromeiaceae"
        ]
      },
      {
        "id": "spermatophyta",
        "paiId": "euphyllophyta",
        "filhoIds": [
          "corystospermales",
          "glossopteridales",
          "gymnospermae",
          "angiospermae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "dicroidium",
          "glossopteris-indica",
          "araucaria-mirabilis",
          "duartenia",
          "ginkgoites-huttonii",
          "cycadeoidea",
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta"
        ]
      },
      {
        "id": "corystospermales",
        "paiId": "spermatophyta",
        "filhoIds": [],
        "organismoIds": [
          "dicroidium"
        ],
        "descendenteIds": [
          "dicroidium"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "corystospermales"
        ]
      },
      {
        "id": "gymnospermae",
        "paiId": "spermatophyta",
        "filhoIds": [
          "coniferales",
          "gnetophyta",
          "ginkgoales",
          "bennettitales"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "araucaria-mirabilis",
          "duartenia",
          "ginkgoites-huttonii",
          "cycadeoidea"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae"
        ]
      },
      {
        "id": "coniferales",
        "paiId": "gymnospermae",
        "filhoIds": [
          "araucariaceae",
          "duartenia-lineage"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "araucaria-mirabilis",
          "duartenia"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "coniferales"
        ]
      },
      {
        "id": "araucariaceae",
        "paiId": "coniferales",
        "filhoIds": [],
        "organismoIds": [
          "araucaria-mirabilis"
        ],
        "descendenteIds": [
          "araucaria-mirabilis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "coniferales",
          "araucariaceae"
        ]
      },
      {
        "id": "gnetophyta",
        "paiId": "gymnospermae",
        "filhoIds": [],
        "organismoIds": [],
        "descendenteIds": [],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "gnetophyta"
        ]
      },
      {
        "id": "angiospermae",
        "paiId": "spermatophyta",
        "filhoIds": [
          "magnoliales",
          "monocotyledoneae",
          "archaefructaceae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "angiospermae"
        ]
      },
      {
        "id": "magnoliales",
        "paiId": "angiospermae",
        "filhoIds": [],
        "organismoIds": [],
        "descendenteIds": [],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "angiospermae",
          "magnoliales"
        ]
      },
      {
        "id": "monocotyledoneae",
        "paiId": "angiospermae",
        "filhoIds": [],
        "organismoIds": [],
        "descendenteIds": [],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "angiospermae",
          "monocotyledoneae"
        ]
      },
      {
        "id": "opisthokonta",
        "paiId": "eukaryota",
        "filhoIds": [
          "metazoa"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "anomalocaris-canadensis",
          "dickinsonia-costata",
          "tiktaalik-roseae",
          "acanthostega-gunnari",
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta"
        ]
      },
      {
        "id": "metazoa",
        "paiId": "opisthokonta",
        "filhoIds": [
          "arthropoda",
          "dickinsoniidae",
          "chordata"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "anomalocaris-canadensis",
          "dickinsonia-costata",
          "tiktaalik-roseae",
          "acanthostega-gunnari",
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa"
        ]
      },
      {
        "id": "chordata",
        "paiId": "metazoa",
        "filhoIds": [
          "vertebrata"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "tiktaalik-roseae",
          "acanthostega-gunnari",
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata"
        ]
      },
      {
        "id": "amniota",
        "paiId": "tetrapoda",
        "filhoIds": [
          "synapsida",
          "sauropsida"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota"
        ]
      },
      {
        "id": "synapsida",
        "paiId": "amniota",
        "filhoIds": [
          "sphenacodontidae",
          "mammalia"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida"
        ]
      },
      {
        "id": "sphenacodontidae",
        "paiId": "synapsida",
        "filhoIds": [],
        "organismoIds": [
          "dimetrodon"
        ],
        "descendenteIds": [
          "dimetrodon"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "sphenacodontidae"
        ]
      },
      {
        "id": "mammalia",
        "paiId": "synapsida",
        "filhoIds": [
          "carnivora",
          "primates"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia"
        ]
      },
      {
        "id": "carnivora",
        "paiId": "mammalia",
        "filhoIds": [
          "felidae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "smilodon-populator"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "carnivora"
        ]
      },
      {
        "id": "felidae",
        "paiId": "carnivora",
        "filhoIds": [
          "machairodontinae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "smilodon-populator"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "carnivora",
          "felidae"
        ]
      },
      {
        "id": "machairodontinae",
        "paiId": "felidae",
        "filhoIds": [],
        "organismoIds": [
          "smilodon-populator"
        ],
        "descendenteIds": [
          "smilodon-populator"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "carnivora",
          "felidae",
          "machairodontinae"
        ]
      },
      {
        "id": "sauropsida",
        "paiId": "amniota",
        "filhoIds": [
          "lepidosauromorpha",
          "archosauromorpha"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida"
        ]
      },
      {
        "id": "lepidosauromorpha",
        "paiId": "sauropsida",
        "filhoIds": [
          "squamata"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "mosasaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "lepidosauromorpha"
        ]
      },
      {
        "id": "squamata",
        "paiId": "lepidosauromorpha",
        "filhoIds": [
          "mosasauroidea"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "mosasaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "lepidosauromorpha",
          "squamata"
        ]
      },
      {
        "id": "mosasauroidea",
        "paiId": "squamata",
        "filhoIds": [],
        "organismoIds": [
          "mosasaurus"
        ],
        "descendenteIds": [
          "mosasaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "lepidosauromorpha",
          "squamata",
          "mosasauroidea"
        ]
      },
      {
        "id": "archosauromorpha",
        "paiId": "sauropsida",
        "filhoIds": [
          "archosauria"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha"
        ]
      },
      {
        "id": "archosauria",
        "paiId": "archosauromorpha",
        "filhoIds": [
          "pterosauria",
          "dinosauria"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria"
        ]
      },
      {
        "id": "pterosauria",
        "paiId": "archosauria",
        "filhoIds": [
          "pterodactyloidea"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pteranodon",
          "tapejara"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "pterosauria"
        ]
      },
      {
        "id": "pterodactyloidea",
        "paiId": "pterosauria",
        "filhoIds": [
          "pteranodontidae",
          "tapejaridae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pteranodon",
          "tapejara"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "pterosauria",
          "pterodactyloidea"
        ]
      },
      {
        "id": "pteranodontidae",
        "paiId": "pterodactyloidea",
        "filhoIds": [],
        "organismoIds": [
          "pteranodon"
        ],
        "descendenteIds": [
          "pteranodon"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "pterosauria",
          "pterodactyloidea",
          "pteranodontidae"
        ]
      },
      {
        "id": "tapejaridae",
        "paiId": "pterodactyloidea",
        "filhoIds": [],
        "organismoIds": [
          "tapejara"
        ],
        "descendenteIds": [
          "tapejara"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "pterosauria",
          "pterodactyloidea",
          "tapejaridae"
        ]
      },
      {
        "id": "dinosauria",
        "paiId": "archosauria",
        "filhoIds": [
          "saurischia",
          "ornithischia"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria"
        ]
      },
      {
        "id": "saurischia",
        "paiId": "dinosauria",
        "filhoIds": [
          "herrerasauria",
          "eusaurischia"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia"
        ]
      },
      {
        "id": "herrerasauria",
        "paiId": "saurischia",
        "filhoIds": [
          "herrerasauridae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "staurikosaurus",
          "gnathovorax"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "herrerasauria"
        ]
      },
      {
        "id": "herrerasauridae",
        "paiId": "herrerasauria",
        "filhoIds": [],
        "organismoIds": [
          "staurikosaurus",
          "gnathovorax"
        ],
        "descendenteIds": [
          "staurikosaurus",
          "gnathovorax"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "herrerasauria",
          "herrerasauridae"
        ]
      },
      {
        "id": "eusaurischia",
        "paiId": "saurischia",
        "filhoIds": [
          "sauropodomorpha",
          "theropoda"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia"
        ]
      },
      {
        "id": "sauropodomorpha",
        "paiId": "eusaurischia",
        "filhoIds": [
          "buriolestidae",
          "plateosauridae",
          "sauropoda"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha"
        ]
      },
      {
        "id": "buriolestidae",
        "paiId": "sauropodomorpha",
        "filhoIds": [],
        "organismoIds": [
          "buriolestes"
        ],
        "descendenteIds": [
          "buriolestes"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "buriolestidae"
        ]
      },
      {
        "id": "plateosauridae",
        "paiId": "sauropodomorpha",
        "filhoIds": [],
        "organismoIds": [
          "plateosaurus"
        ],
        "descendenteIds": [
          "plateosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "plateosauridae"
        ]
      },
      {
        "id": "sauropoda",
        "paiId": "sauropodomorpha",
        "filhoIds": [
          "diplodocidae",
          "macronaria"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda"
        ]
      },
      {
        "id": "diplodocidae",
        "paiId": "sauropoda",
        "filhoIds": [],
        "organismoIds": [
          "diplodocus"
        ],
        "descendenteIds": [
          "diplodocus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "diplodocidae"
        ]
      },
      {
        "id": "macronaria",
        "paiId": "sauropoda",
        "filhoIds": [
          "brachiosauridae",
          "titanosauria"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "macronaria"
        ]
      },
      {
        "id": "brachiosauridae",
        "paiId": "macronaria",
        "filhoIds": [],
        "organismoIds": [
          "brachiosaurus"
        ],
        "descendenteIds": [
          "brachiosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "macronaria",
          "brachiosauridae"
        ]
      },
      {
        "id": "titanosauria",
        "paiId": "macronaria",
        "filhoIds": [],
        "organismoIds": [
          "austroposeidon",
          "uberabatitan"
        ],
        "descendenteIds": [
          "austroposeidon",
          "uberabatitan"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "macronaria",
          "titanosauria"
        ]
      },
      {
        "id": "theropoda",
        "paiId": "eusaurischia",
        "filhoIds": [
          "coelophysoidea",
          "ceratosauria",
          "tetanurae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda"
        ]
      },
      {
        "id": "coelophysoidea",
        "paiId": "theropoda",
        "filhoIds": [],
        "organismoIds": [
          "coelophysis"
        ],
        "descendenteIds": [
          "coelophysis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "coelophysoidea"
        ]
      },
      {
        "id": "ceratosauria",
        "paiId": "theropoda",
        "filhoIds": [
          "noasauridae",
          "abelisauridae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "berthasaura",
          "carnotaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "ceratosauria"
        ]
      },
      {
        "id": "noasauridae",
        "paiId": "ceratosauria",
        "filhoIds": [],
        "organismoIds": [
          "berthasaura"
        ],
        "descendenteIds": [
          "berthasaura"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "ceratosauria",
          "noasauridae"
        ]
      },
      {
        "id": "abelisauridae",
        "paiId": "ceratosauria",
        "filhoIds": [],
        "organismoIds": [
          "carnotaurus"
        ],
        "descendenteIds": [
          "carnotaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "ceratosauria",
          "abelisauridae"
        ]
      },
      {
        "id": "tetanurae",
        "paiId": "theropoda",
        "filhoIds": [
          "megalosauroidea",
          "avetheropoda"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae"
        ]
      },
      {
        "id": "megalosauroidea",
        "paiId": "tetanurae",
        "filhoIds": [
          "spinosauridae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "spinosaurus",
          "irritator"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "megalosauroidea"
        ]
      },
      {
        "id": "spinosauridae",
        "paiId": "megalosauroidea",
        "filhoIds": [],
        "organismoIds": [
          "spinosaurus",
          "irritator"
        ],
        "descendenteIds": [
          "spinosaurus",
          "irritator"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "megalosauroidea",
          "spinosauridae"
        ]
      },
      {
        "id": "avetheropoda",
        "paiId": "tetanurae",
        "filhoIds": [
          "allosauroidea",
          "coelurosauria"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda"
        ]
      },
      {
        "id": "allosauroidea",
        "paiId": "avetheropoda",
        "filhoIds": [],
        "organismoIds": [
          "allosaurus"
        ],
        "descendenteIds": [
          "allosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "allosauroidea"
        ]
      },
      {
        "id": "coelurosauria",
        "paiId": "avetheropoda",
        "filhoIds": [
          "tyrannosauroidea",
          "maniraptora"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria"
        ]
      },
      {
        "id": "tyrannosauroidea",
        "paiId": "coelurosauria",
        "filhoIds": [],
        "organismoIds": [
          "tyrannosaurus-rex"
        ],
        "descendenteIds": [
          "tyrannosaurus-rex"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "tyrannosauroidea"
        ]
      },
      {
        "id": "maniraptora",
        "paiId": "coelurosauria",
        "filhoIds": [
          "dromaeosauridae",
          "avialae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "velociraptor",
          "deinonychus",
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "maniraptora"
        ]
      },
      {
        "id": "dromaeosauridae",
        "paiId": "maniraptora",
        "filhoIds": [],
        "organismoIds": [
          "velociraptor",
          "deinonychus"
        ],
        "descendenteIds": [
          "velociraptor",
          "deinonychus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "maniraptora",
          "dromaeosauridae"
        ]
      },
      {
        "id": "avialae",
        "paiId": "maniraptora",
        "filhoIds": [],
        "organismoIds": [
          "archaeopteryx"
        ],
        "descendenteIds": [
          "archaeopteryx"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "maniraptora",
          "avialae"
        ]
      },
      {
        "id": "ornithischia",
        "paiId": "dinosauria",
        "filhoIds": [
          "thyreophora",
          "neornithischia"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia"
        ]
      },
      {
        "id": "thyreophora",
        "paiId": "ornithischia",
        "filhoIds": [
          "stegosauria",
          "ankylosauria"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "stegosaurus",
          "ankylosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "thyreophora"
        ]
      },
      {
        "id": "stegosauria",
        "paiId": "thyreophora",
        "filhoIds": [],
        "organismoIds": [
          "stegosaurus"
        ],
        "descendenteIds": [
          "stegosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "thyreophora",
          "stegosauria"
        ]
      },
      {
        "id": "ankylosauria",
        "paiId": "thyreophora",
        "filhoIds": [],
        "organismoIds": [
          "ankylosaurus"
        ],
        "descendenteIds": [
          "ankylosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "thyreophora",
          "ankylosauria"
        ]
      },
      {
        "id": "neornithischia",
        "paiId": "ornithischia",
        "filhoIds": [
          "marginocephalia",
          "ornithopoda"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia"
        ]
      },
      {
        "id": "marginocephalia",
        "paiId": "neornithischia",
        "filhoIds": [
          "ceratopsia"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "psittacosaurus",
          "triceratops"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "marginocephalia"
        ]
      },
      {
        "id": "ceratopsia",
        "paiId": "marginocephalia",
        "filhoIds": [
          "psittacosauridae",
          "ceratopsidae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "psittacosaurus",
          "triceratops"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "marginocephalia",
          "ceratopsia"
        ]
      },
      {
        "id": "psittacosauridae",
        "paiId": "ceratopsia",
        "filhoIds": [],
        "organismoIds": [
          "psittacosaurus"
        ],
        "descendenteIds": [
          "psittacosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "marginocephalia",
          "ceratopsia",
          "psittacosauridae"
        ]
      },
      {
        "id": "ceratopsidae",
        "paiId": "ceratopsia",
        "filhoIds": [],
        "organismoIds": [
          "triceratops"
        ],
        "descendenteIds": [
          "triceratops"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "marginocephalia",
          "ceratopsia",
          "ceratopsidae"
        ]
      },
      {
        "id": "ornithopoda",
        "paiId": "neornithischia",
        "filhoIds": [
          "iguanodontia"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda"
        ]
      },
      {
        "id": "iguanodontia",
        "paiId": "ornithopoda",
        "filhoIds": [
          "iguanodontidae",
          "hadrosauridae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia"
        ]
      },
      {
        "id": "iguanodontidae",
        "paiId": "iguanodontia",
        "filhoIds": [],
        "organismoIds": [
          "iguanodon"
        ],
        "descendenteIds": [
          "iguanodon"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia",
          "iguanodontidae"
        ]
      },
      {
        "id": "hadrosauridae",
        "paiId": "iguanodontia",
        "filhoIds": [
          "saurolophinae",
          "lambeosaurinae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia",
          "hadrosauridae"
        ]
      },
      {
        "id": "saurolophinae",
        "paiId": "hadrosauridae",
        "filhoIds": [],
        "organismoIds": [
          "edmontosaurus"
        ],
        "descendenteIds": [
          "edmontosaurus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia",
          "hadrosauridae",
          "saurolophinae"
        ]
      },
      {
        "id": "lambeosaurinae",
        "paiId": "hadrosauridae",
        "filhoIds": [],
        "organismoIds": [
          "parasaurolophus"
        ],
        "descendenteIds": [
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia",
          "hadrosauridae",
          "lambeosaurinae"
        ]
      },
      {
        "id": "ginkgoales",
        "paiId": "gymnospermae",
        "filhoIds": [
          "ginkgoites-lineage"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "ginkgoites-huttonii"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "ginkgoales"
        ]
      },
      {
        "id": "ginkgoites-lineage",
        "paiId": "ginkgoales",
        "filhoIds": [],
        "organismoIds": [
          "ginkgoites-huttonii"
        ],
        "descendenteIds": [
          "ginkgoites-huttonii"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "ginkgoales",
          "ginkgoites-lineage"
        ]
      },
      {
        "id": "archaefructaceae",
        "paiId": "angiospermae",
        "filhoIds": [
          "archaefructus-lineage"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "angiospermae",
          "archaefructaceae"
        ]
      },
      {
        "id": "archaefructus-lineage",
        "paiId": "archaefructaceae",
        "filhoIds": [],
        "organismoIds": [
          "archaefructus"
        ],
        "descendenteIds": [
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "angiospermae",
          "archaefructaceae",
          "archaefructus-lineage"
        ]
      },
      {
        "id": "duartenia-lineage",
        "paiId": "coniferales",
        "filhoIds": [],
        "organismoIds": [
          "duartenia"
        ],
        "descendenteIds": [
          "duartenia"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "coniferales",
          "duartenia-lineage"
        ]
      },
      {
        "id": "vertebrata",
        "paiId": "chordata",
        "filhoIds": [
          "tetrapodomorpha"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "tiktaalik-roseae",
          "acanthostega-gunnari",
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata"
        ]
      },
      {
        "id": "tetrapodomorpha",
        "paiId": "vertebrata",
        "filhoIds": [
          "elpistostegalia",
          "tetrapoda"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "tiktaalik-roseae",
          "acanthostega-gunnari",
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha"
        ]
      },
      {
        "id": "elpistostegalia",
        "paiId": "tetrapodomorpha",
        "filhoIds": [],
        "organismoIds": [
          "tiktaalik-roseae"
        ],
        "descendenteIds": [
          "tiktaalik-roseae"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "elpistostegalia"
        ]
      },
      {
        "id": "tetrapoda",
        "paiId": "tetrapodomorpha",
        "filhoIds": [
          "acanthostegidae",
          "amniota"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "acanthostega-gunnari",
          "dimetrodon",
          "smilodon-populator",
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis",
          "mosasaurus",
          "pteranodon",
          "tapejara",
          "staurikosaurus",
          "gnathovorax",
          "buriolestes",
          "plateosaurus",
          "diplodocus",
          "brachiosaurus",
          "austroposeidon",
          "uberabatitan",
          "coelophysis",
          "berthasaura",
          "carnotaurus",
          "spinosaurus",
          "irritator",
          "allosaurus",
          "tyrannosaurus-rex",
          "velociraptor",
          "deinonychus",
          "archaeopteryx",
          "stegosaurus",
          "ankylosaurus",
          "psittacosaurus",
          "triceratops",
          "iguanodon",
          "edmontosaurus",
          "parasaurolophus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda"
        ]
      },
      {
        "id": "acanthostegidae",
        "paiId": "tetrapoda",
        "filhoIds": [],
        "organismoIds": [
          "acanthostega-gunnari"
        ],
        "descendenteIds": [
          "acanthostega-gunnari"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "acanthostegidae"
        ]
      },
      {
        "id": "arthropoda",
        "paiId": "metazoa",
        "filhoIds": [
          "radiodonta"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "anomalocaris-canadensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "arthropoda"
        ]
      },
      {
        "id": "radiodonta",
        "paiId": "arthropoda",
        "filhoIds": [
          "anomalocarididae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "anomalocaris-canadensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "arthropoda",
          "radiodonta"
        ]
      },
      {
        "id": "anomalocarididae",
        "paiId": "radiodonta",
        "filhoIds": [],
        "organismoIds": [
          "anomalocaris-canadensis"
        ],
        "descendenteIds": [
          "anomalocaris-canadensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "arthropoda",
          "radiodonta",
          "anomalocarididae"
        ]
      },
      {
        "id": "dickinsoniidae",
        "paiId": "metazoa",
        "filhoIds": [],
        "organismoIds": [
          "dickinsonia-costata"
        ],
        "descendenteIds": [
          "dickinsonia-costata"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "dickinsoniidae"
        ]
      },
      {
        "id": "primates",
        "paiId": "mammalia",
        "filhoIds": [
          "haplorhini"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates"
        ]
      },
      {
        "id": "haplorhini",
        "paiId": "primates",
        "filhoIds": [
          "simiiformes"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini"
        ]
      },
      {
        "id": "simiiformes",
        "paiId": "haplorhini",
        "filhoIds": [
          "catarrhini"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes"
        ]
      },
      {
        "id": "catarrhini",
        "paiId": "simiiformes",
        "filhoIds": [
          "hominoidea"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini"
        ]
      },
      {
        "id": "hominoidea",
        "paiId": "catarrhini",
        "filhoIds": [
          "hominidae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea"
        ]
      },
      {
        "id": "hominidae",
        "paiId": "hominoidea",
        "filhoIds": [
          "ponginae",
          "homininae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis",
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae"
        ]
      },
      {
        "id": "ponginae",
        "paiId": "hominidae",
        "filhoIds": [
          "pongo"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "ponginae"
        ]
      },
      {
        "id": "pongo",
        "paiId": "ponginae",
        "filhoIds": [],
        "organismoIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis"
        ],
        "descendenteIds": [
          "pongo-abelii",
          "pongo-pygmaeus",
          "pongo-tapanuliensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "ponginae",
          "pongo"
        ]
      },
      {
        "id": "homininae",
        "paiId": "hominidae",
        "filhoIds": [
          "gorillini",
          "hominini"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "gorilla-beringei",
          "gorilla-gorilla",
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae"
        ]
      },
      {
        "id": "gorillini",
        "paiId": "homininae",
        "filhoIds": [
          "gorilla"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "gorilla-beringei",
          "gorilla-gorilla"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "gorillini"
        ]
      },
      {
        "id": "gorilla",
        "paiId": "gorillini",
        "filhoIds": [],
        "organismoIds": [
          "gorilla-beringei",
          "gorilla-gorilla"
        ],
        "descendenteIds": [
          "gorilla-beringei",
          "gorilla-gorilla"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "gorillini",
          "gorilla"
        ]
      },
      {
        "id": "hominini",
        "paiId": "homininae",
        "filhoIds": [
          "panina",
          "hominina"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pan-paniscus",
          "pan-troglodytes",
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini"
        ]
      },
      {
        "id": "panina",
        "paiId": "hominini",
        "filhoIds": [
          "pan"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "pan-paniscus",
          "pan-troglodytes"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "panina"
        ]
      },
      {
        "id": "pan",
        "paiId": "panina",
        "filhoIds": [],
        "organismoIds": [
          "pan-paniscus",
          "pan-troglodytes"
        ],
        "descendenteIds": [
          "pan-paniscus",
          "pan-troglodytes"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "panina",
          "pan"
        ]
      },
      {
        "id": "hominina",
        "paiId": "hominini",
        "filhoIds": [
          "sahelanthropus-lineage",
          "orrorin-lineage",
          "ardipithecus",
          "australopithecina"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "sahelanthropus-tchadensis",
          "orrorin-tugenensis",
          "ardipithecus-kadabba",
          "ardipithecus-ramidus",
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina"
        ]
      },
      {
        "id": "sahelanthropus-lineage",
        "paiId": "hominina",
        "filhoIds": [],
        "organismoIds": [
          "sahelanthropus-tchadensis"
        ],
        "descendenteIds": [
          "sahelanthropus-tchadensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "sahelanthropus-lineage"
        ]
      },
      {
        "id": "orrorin-lineage",
        "paiId": "hominina",
        "filhoIds": [],
        "organismoIds": [
          "orrorin-tugenensis"
        ],
        "descendenteIds": [
          "orrorin-tugenensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "orrorin-lineage"
        ]
      },
      {
        "id": "ardipithecus",
        "paiId": "hominina",
        "filhoIds": [],
        "organismoIds": [
          "ardipithecus-kadabba",
          "ardipithecus-ramidus"
        ],
        "descendenteIds": [
          "ardipithecus-kadabba",
          "ardipithecus-ramidus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "ardipithecus"
        ]
      },
      {
        "id": "australopithecina",
        "paiId": "hominina",
        "filhoIds": [
          "australopithecus",
          "kenyanthropus",
          "paranthropus",
          "homo"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba",
          "kenyanthropus-platyops",
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus",
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina"
        ]
      },
      {
        "id": "australopithecus",
        "paiId": "australopithecina",
        "filhoIds": [],
        "organismoIds": [
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba"
        ],
        "descendenteIds": [
          "australopithecus-anamensis",
          "australopithecus-afarensis",
          "australopithecus-africanus",
          "australopithecus-garhi",
          "australopithecus-sediba"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "australopithecus"
        ]
      },
      {
        "id": "kenyanthropus",
        "paiId": "australopithecina",
        "filhoIds": [],
        "organismoIds": [
          "kenyanthropus-platyops"
        ],
        "descendenteIds": [
          "kenyanthropus-platyops"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "kenyanthropus"
        ]
      },
      {
        "id": "paranthropus",
        "paiId": "australopithecina",
        "filhoIds": [],
        "organismoIds": [
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus"
        ],
        "descendenteIds": [
          "paranthropus-aethiopicus",
          "paranthropus-boisei",
          "paranthropus-robustus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "paranthropus"
        ]
      },
      {
        "id": "homo",
        "paiId": "australopithecina",
        "filhoIds": [],
        "organismoIds": [
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "descendenteIds": [
          "homo-sapiens",
          "homo-habilis",
          "homo-rudolfensis",
          "homo-erectus",
          "homo-heidelbergensis",
          "homo-neanderthalensis",
          "homo-naledi",
          "homo-floresiensis"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo"
        ]
      },
      {
        "id": "euphyllophyta",
        "paiId": "tracheophyta",
        "filhoIds": [
          "sphenopsida",
          "spermatophyta"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "calamites-suckowii",
          "dicroidium",
          "glossopteris-indica",
          "araucaria-mirabilis",
          "duartenia",
          "ginkgoites-huttonii",
          "cycadeoidea",
          "archaefructus"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta"
        ]
      },
      {
        "id": "rhyniopsida",
        "paiId": "tracheophyta",
        "filhoIds": [
          "rhyniaceae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "rhynia-gwynne-vaughanii"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "rhyniopsida"
        ]
      },
      {
        "id": "rhyniaceae",
        "paiId": "rhyniopsida",
        "filhoIds": [],
        "organismoIds": [
          "rhynia-gwynne-vaughanii"
        ],
        "descendenteIds": [
          "rhynia-gwynne-vaughanii"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "rhyniopsida",
          "rhyniaceae"
        ]
      },
      {
        "id": "sphenopsida",
        "paiId": "euphyllophyta",
        "filhoIds": [
          "calamitaceae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "calamites-suckowii"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "sphenopsida"
        ]
      },
      {
        "id": "calamitaceae",
        "paiId": "sphenopsida",
        "filhoIds": [],
        "organismoIds": [
          "calamites-suckowii"
        ],
        "descendenteIds": [
          "calamites-suckowii"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "sphenopsida",
          "calamitaceae"
        ]
      },
      {
        "id": "glossopteridales",
        "paiId": "spermatophyta",
        "filhoIds": [
          "glossopteridaceae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "glossopteris-indica"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "glossopteridales"
        ]
      },
      {
        "id": "glossopteridaceae",
        "paiId": "glossopteridales",
        "filhoIds": [],
        "organismoIds": [
          "glossopteris-indica"
        ],
        "descendenteIds": [
          "glossopteris-indica"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "glossopteridales",
          "glossopteridaceae"
        ]
      },
      {
        "id": "bennettitales",
        "paiId": "gymnospermae",
        "filhoIds": [
          "bennettitaceae"
        ],
        "organismoIds": [],
        "descendenteIds": [
          "cycadeoidea"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "bennettitales"
        ]
      },
      {
        "id": "bennettitaceae",
        "paiId": "bennettitales",
        "filhoIds": [],
        "organismoIds": [
          "cycadeoidea"
        ],
        "descendenteIds": [
          "cycadeoidea"
        ],
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "bennettitales",
          "bennettitaceae"
        ]
      }
    ],
    "folhas": [
      {
        "organismoId": "tyrannosaurus-rex",
        "noId": "tyrannosauroidea",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "tyrannosauroidea",
          "tyrannosaurus-rex"
        ]
      },
      {
        "organismoId": "triceratops",
        "noId": "ceratopsidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "marginocephalia",
          "ceratopsia",
          "ceratopsidae",
          "triceratops"
        ]
      },
      {
        "organismoId": "stegosaurus",
        "noId": "stegosauria",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "thyreophora",
          "stegosauria",
          "stegosaurus"
        ]
      },
      {
        "organismoId": "coelophysis",
        "noId": "coelophysoidea",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "coelophysoidea",
          "coelophysis"
        ]
      },
      {
        "organismoId": "plateosaurus",
        "noId": "plateosauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "plateosauridae",
          "plateosaurus"
        ]
      },
      {
        "organismoId": "staurikosaurus",
        "noId": "herrerasauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "herrerasauria",
          "herrerasauridae",
          "staurikosaurus"
        ]
      },
      {
        "organismoId": "buriolestes",
        "noId": "buriolestidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "buriolestidae",
          "buriolestes"
        ]
      },
      {
        "organismoId": "allosaurus",
        "noId": "allosauroidea",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "allosauroidea",
          "allosaurus"
        ]
      },
      {
        "organismoId": "diplodocus",
        "noId": "diplodocidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "diplodocidae",
          "diplodocus"
        ]
      },
      {
        "organismoId": "brachiosaurus",
        "noId": "brachiosauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "macronaria",
          "brachiosauridae",
          "brachiosaurus"
        ]
      },
      {
        "organismoId": "archaeopteryx",
        "noId": "avialae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "maniraptora",
          "avialae",
          "archaeopteryx"
        ]
      },
      {
        "organismoId": "velociraptor",
        "noId": "dromaeosauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "maniraptora",
          "dromaeosauridae",
          "velociraptor"
        ]
      },
      {
        "organismoId": "spinosaurus",
        "noId": "spinosauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "megalosauroidea",
          "spinosauridae",
          "spinosaurus"
        ]
      },
      {
        "organismoId": "ankylosaurus",
        "noId": "ankylosauria",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "thyreophora",
          "ankylosauria",
          "ankylosaurus"
        ]
      },
      {
        "organismoId": "parasaurolophus",
        "noId": "lambeosaurinae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia",
          "hadrosauridae",
          "lambeosaurinae",
          "parasaurolophus"
        ]
      },
      {
        "organismoId": "iguanodon",
        "noId": "iguanodontidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia",
          "iguanodontidae",
          "iguanodon"
        ]
      },
      {
        "organismoId": "irritator",
        "noId": "spinosauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "megalosauroidea",
          "spinosauridae",
          "irritator"
        ]
      },
      {
        "organismoId": "berthasaura",
        "noId": "noasauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "ceratosauria",
          "noasauridae",
          "berthasaura"
        ]
      },
      {
        "organismoId": "austroposeidon",
        "noId": "titanosauria",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "macronaria",
          "titanosauria",
          "austroposeidon"
        ]
      },
      {
        "organismoId": "uberabatitan",
        "noId": "titanosauria",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "sauropodomorpha",
          "sauropoda",
          "macronaria",
          "titanosauria",
          "uberabatitan"
        ]
      },
      {
        "organismoId": "dimetrodon",
        "noId": "sphenacodontidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "sphenacodontidae",
          "dimetrodon"
        ]
      },
      {
        "organismoId": "pteranodon",
        "noId": "pteranodontidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "pterosauria",
          "pterodactyloidea",
          "pteranodontidae",
          "pteranodon"
        ]
      },
      {
        "organismoId": "mosasaurus",
        "noId": "mosasauroidea",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "lepidosauromorpha",
          "squamata",
          "mosasauroidea",
          "mosasaurus"
        ]
      },
      {
        "organismoId": "smilodon-populator",
        "noId": "machairodontinae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "carnivora",
          "felidae",
          "machairodontinae",
          "smilodon-populator"
        ]
      },
      {
        "organismoId": "gnathovorax",
        "noId": "herrerasauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "herrerasauria",
          "herrerasauridae",
          "gnathovorax"
        ]
      },
      {
        "organismoId": "carnotaurus",
        "noId": "abelisauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "ceratosauria",
          "abelisauridae",
          "carnotaurus"
        ]
      },
      {
        "organismoId": "deinonychus",
        "noId": "dromaeosauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "saurischia",
          "eusaurischia",
          "theropoda",
          "tetanurae",
          "avetheropoda",
          "coelurosauria",
          "maniraptora",
          "dromaeosauridae",
          "deinonychus"
        ]
      },
      {
        "organismoId": "psittacosaurus",
        "noId": "psittacosauridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "marginocephalia",
          "ceratopsia",
          "psittacosauridae",
          "psittacosaurus"
        ]
      },
      {
        "organismoId": "edmontosaurus",
        "noId": "saurolophinae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "dinosauria",
          "ornithischia",
          "neornithischia",
          "ornithopoda",
          "iguanodontia",
          "hadrosauridae",
          "saurolophinae",
          "edmontosaurus"
        ]
      },
      {
        "organismoId": "tapejara",
        "noId": "tapejaridae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "sauropsida",
          "archosauromorpha",
          "archosauria",
          "pterosauria",
          "pterodactyloidea",
          "tapejaridae",
          "tapejara"
        ]
      },
      {
        "organismoId": "pleuromeia",
        "noId": "pleuromeiaceae",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "lycophyta",
          "isoetales",
          "pleuromeiaceae",
          "pleuromeia"
        ]
      },
      {
        "organismoId": "dicroidium",
        "noId": "corystospermales",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "corystospermales",
          "dicroidium"
        ]
      },
      {
        "organismoId": "araucaria-mirabilis",
        "noId": "araucariaceae",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "coniferales",
          "araucariaceae",
          "araucaria-mirabilis"
        ]
      },
      {
        "organismoId": "ginkgoites-huttonii",
        "noId": "ginkgoites-lineage",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "ginkgoales",
          "ginkgoites-lineage",
          "ginkgoites-huttonii"
        ]
      },
      {
        "organismoId": "archaefructus",
        "noId": "archaefructus-lineage",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "angiospermae",
          "archaefructaceae",
          "archaefructus-lineage",
          "archaefructus"
        ]
      },
      {
        "organismoId": "duartenia",
        "noId": "duartenia-lineage",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "coniferales",
          "duartenia-lineage",
          "duartenia"
        ]
      },
      {
        "organismoId": "gorilla-beringei",
        "noId": "gorilla",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "gorillini",
          "gorilla",
          "gorilla-beringei"
        ]
      },
      {
        "organismoId": "gorilla-gorilla",
        "noId": "gorilla",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "gorillini",
          "gorilla",
          "gorilla-gorilla"
        ]
      },
      {
        "organismoId": "homo-sapiens",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-sapiens"
        ]
      },
      {
        "organismoId": "pan-paniscus",
        "noId": "pan",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "panina",
          "pan",
          "pan-paniscus"
        ]
      },
      {
        "organismoId": "pan-troglodytes",
        "noId": "pan",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "panina",
          "pan",
          "pan-troglodytes"
        ]
      },
      {
        "organismoId": "pongo-abelii",
        "noId": "pongo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "ponginae",
          "pongo",
          "pongo-abelii"
        ]
      },
      {
        "organismoId": "pongo-pygmaeus",
        "noId": "pongo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "ponginae",
          "pongo",
          "pongo-pygmaeus"
        ]
      },
      {
        "organismoId": "pongo-tapanuliensis",
        "noId": "pongo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "ponginae",
          "pongo",
          "pongo-tapanuliensis"
        ]
      },
      {
        "organismoId": "sahelanthropus-tchadensis",
        "noId": "sahelanthropus-lineage",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "sahelanthropus-lineage",
          "sahelanthropus-tchadensis"
        ]
      },
      {
        "organismoId": "orrorin-tugenensis",
        "noId": "orrorin-lineage",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "orrorin-lineage",
          "orrorin-tugenensis"
        ]
      },
      {
        "organismoId": "ardipithecus-kadabba",
        "noId": "ardipithecus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "ardipithecus",
          "ardipithecus-kadabba"
        ]
      },
      {
        "organismoId": "ardipithecus-ramidus",
        "noId": "ardipithecus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "ardipithecus",
          "ardipithecus-ramidus"
        ]
      },
      {
        "organismoId": "australopithecus-anamensis",
        "noId": "australopithecus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "australopithecus",
          "australopithecus-anamensis"
        ]
      },
      {
        "organismoId": "australopithecus-afarensis",
        "noId": "australopithecus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "australopithecus",
          "australopithecus-afarensis"
        ]
      },
      {
        "organismoId": "australopithecus-africanus",
        "noId": "australopithecus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "australopithecus",
          "australopithecus-africanus"
        ]
      },
      {
        "organismoId": "australopithecus-garhi",
        "noId": "australopithecus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "australopithecus",
          "australopithecus-garhi"
        ]
      },
      {
        "organismoId": "australopithecus-sediba",
        "noId": "australopithecus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "australopithecus",
          "australopithecus-sediba"
        ]
      },
      {
        "organismoId": "paranthropus-aethiopicus",
        "noId": "paranthropus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "paranthropus",
          "paranthropus-aethiopicus"
        ]
      },
      {
        "organismoId": "paranthropus-boisei",
        "noId": "paranthropus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "paranthropus",
          "paranthropus-boisei"
        ]
      },
      {
        "organismoId": "paranthropus-robustus",
        "noId": "paranthropus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "paranthropus",
          "paranthropus-robustus"
        ]
      },
      {
        "organismoId": "kenyanthropus-platyops",
        "noId": "kenyanthropus",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "kenyanthropus",
          "kenyanthropus-platyops"
        ]
      },
      {
        "organismoId": "homo-habilis",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-habilis"
        ]
      },
      {
        "organismoId": "homo-rudolfensis",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-rudolfensis"
        ]
      },
      {
        "organismoId": "homo-erectus",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-erectus"
        ]
      },
      {
        "organismoId": "homo-heidelbergensis",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-heidelbergensis"
        ]
      },
      {
        "organismoId": "homo-neanderthalensis",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-neanderthalensis"
        ]
      },
      {
        "organismoId": "homo-naledi",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-naledi"
        ]
      },
      {
        "organismoId": "homo-floresiensis",
        "noId": "homo",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "amniota",
          "synapsida",
          "mammalia",
          "primates",
          "haplorhini",
          "simiiformes",
          "catarrhini",
          "hominoidea",
          "hominidae",
          "homininae",
          "hominini",
          "hominina",
          "australopithecina",
          "homo",
          "homo-floresiensis"
        ]
      },
      {
        "organismoId": "dickinsonia-costata",
        "noId": "dickinsoniidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "dickinsoniidae",
          "dickinsonia-costata"
        ]
      },
      {
        "organismoId": "anomalocaris-canadensis",
        "noId": "anomalocarididae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "arthropoda",
          "radiodonta",
          "anomalocarididae",
          "anomalocaris-canadensis"
        ]
      },
      {
        "organismoId": "tiktaalik-roseae",
        "noId": "elpistostegalia",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "elpistostegalia",
          "tiktaalik-roseae"
        ]
      },
      {
        "organismoId": "acanthostega-gunnari",
        "noId": "acanthostegidae",
        "caminhoRaiz": [
          "eukaryota",
          "opisthokonta",
          "metazoa",
          "chordata",
          "vertebrata",
          "tetrapodomorpha",
          "tetrapoda",
          "acanthostegidae",
          "acanthostega-gunnari"
        ]
      },
      {
        "organismoId": "rhynia-gwynne-vaughanii",
        "noId": "rhyniaceae",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "rhyniopsida",
          "rhyniaceae",
          "rhynia-gwynne-vaughanii"
        ]
      },
      {
        "organismoId": "calamites-suckowii",
        "noId": "calamitaceae",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "sphenopsida",
          "calamitaceae",
          "calamites-suckowii"
        ]
      },
      {
        "organismoId": "glossopteris-indica",
        "noId": "glossopteridaceae",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "glossopteridales",
          "glossopteridaceae",
          "glossopteris-indica"
        ]
      },
      {
        "organismoId": "cycadeoidea",
        "noId": "bennettitaceae",
        "caminhoRaiz": [
          "eukaryota",
          "archaeplastida",
          "viridiplantae",
          "tracheophyta",
          "euphyllophyta",
          "spermatophyta",
          "gymnospermae",
          "bennettitales",
          "bennettitaceae",
          "cycadeoidea"
        ]
      }
    ]
  },
  "atlas": {
    "organismosPorPeriodo": {
      "cambriano": [
        "anomalocaris-canadensis"
      ],
      "ordoviciano": [],
      "siluriano": [],
      "devoniano": [
        "tiktaalik-roseae",
        "acanthostega-gunnari",
        "rhynia-gwynne-vaughanii"
      ],
      "carbonifero": [
        "calamites-suckowii"
      ],
      "permiano": [
        "dimetrodon",
        "glossopteris-indica"
      ],
      "triassico": [
        "coelophysis",
        "plateosaurus",
        "staurikosaurus",
        "buriolestes",
        "gnathovorax",
        "pleuromeia",
        "dicroidium"
      ],
      "jurasico": [
        "araucaria-mirabilis",
        "ginkgoites-huttonii",
        "cycadeoidea"
      ],
      "jurassico-superior": [
        "stegosaurus",
        "allosaurus",
        "diplodocus",
        "brachiosaurus",
        "archaeopteryx"
      ],
      "cretaceo": [
        "spinosaurus",
        "iguanodon",
        "irritator",
        "deinonychus",
        "psittacosaurus",
        "tapejara",
        "archaefructus",
        "duartenia"
      ],
      "cretaceo-superior": [
        "tyrannosaurus-rex",
        "triceratops",
        "velociraptor",
        "ankylosaurus",
        "parasaurolophus",
        "berthasaura",
        "austroposeidon",
        "uberabatitan",
        "pteranodon",
        "mosasaurus",
        "carnotaurus",
        "edmontosaurus"
      ],
      "paleogeno": [],
      "neogeno": [
        "sahelanthropus-tchadensis",
        "orrorin-tugenensis",
        "ardipithecus-kadabba",
        "ardipithecus-ramidus",
        "australopithecus-anamensis",
        "australopithecus-afarensis",
        "australopithecus-africanus",
        "paranthropus-aethiopicus",
        "kenyanthropus-platyops"
      ],
      "quaternario": [
        "smilodon-populator",
        "gorilla-beringei",
        "gorilla-gorilla",
        "homo-sapiens",
        "pan-paniscus",
        "pan-troglodytes",
        "pongo-abelii",
        "pongo-pygmaeus",
        "pongo-tapanuliensis",
        "australopithecus-garhi",
        "australopithecus-sediba",
        "paranthropus-boisei",
        "paranthropus-robustus",
        "homo-habilis",
        "homo-rudolfensis",
        "homo-erectus",
        "homo-heidelbergensis",
        "homo-neanderthalensis",
        "homo-naledi",
        "homo-floresiensis"
      ],
      "ediacarano": [
        "dickinsonia-costata"
      ]
    }
  },
  "comparacao": [
    {
      "id": "tyrannosaurus-rex",
      "inicioMa": 68,
      "fimMa": 66,
      "pontoMedioMa": 67
    },
    {
      "id": "triceratops",
      "inicioMa": 68,
      "fimMa": 66,
      "pontoMedioMa": 67
    },
    {
      "id": "stegosaurus",
      "inicioMa": 152,
      "fimMa": 145,
      "pontoMedioMa": 148.5
    },
    {
      "id": "coelophysis",
      "inicioMa": 216,
      "fimMa": 203,
      "pontoMedioMa": 209.5
    },
    {
      "id": "plateosaurus",
      "inicioMa": 214,
      "fimMa": 204,
      "pontoMedioMa": 209
    },
    {
      "id": "staurikosaurus",
      "inicioMa": 233.2,
      "fimMa": 228,
      "pontoMedioMa": 230.6
    },
    {
      "id": "buriolestes",
      "inicioMa": 233.2,
      "fimMa": 228,
      "pontoMedioMa": 230.6
    },
    {
      "id": "allosaurus",
      "inicioMa": 152,
      "fimMa": 145,
      "pontoMedioMa": 148.5
    },
    {
      "id": "diplodocus",
      "inicioMa": 152,
      "fimMa": 145,
      "pontoMedioMa": 148.5
    },
    {
      "id": "brachiosaurus",
      "inicioMa": 152,
      "fimMa": 145,
      "pontoMedioMa": 148.5
    },
    {
      "id": "archaeopteryx",
      "inicioMa": 150.8,
      "fimMa": 145,
      "pontoMedioMa": 147.9
    },
    {
      "id": "velociraptor",
      "inicioMa": 74,
      "fimMa": 70,
      "pontoMedioMa": 72
    },
    {
      "id": "spinosaurus",
      "inicioMa": 99,
      "fimMa": 94,
      "pontoMedioMa": 96.5
    },
    {
      "id": "ankylosaurus",
      "inicioMa": 68,
      "fimMa": 66,
      "pontoMedioMa": 67
    },
    {
      "id": "parasaurolophus",
      "inicioMa": 77,
      "fimMa": 73,
      "pontoMedioMa": 75
    },
    {
      "id": "iguanodon",
      "inicioMa": 140,
      "fimMa": 110,
      "pontoMedioMa": 125
    },
    {
      "id": "irritator",
      "inicioMa": 113,
      "fimMa": 110,
      "pontoMedioMa": 111.5
    },
    {
      "id": "berthasaura",
      "inicioMa": 72,
      "fimMa": 66,
      "pontoMedioMa": 69
    },
    {
      "id": "austroposeidon",
      "inicioMa": 83.6,
      "fimMa": 66,
      "pontoMedioMa": 74.8
    },
    {
      "id": "uberabatitan",
      "inicioMa": 70,
      "fimMa": 66,
      "pontoMedioMa": 68
    },
    {
      "id": "dimetrodon",
      "inicioMa": 295,
      "fimMa": 272,
      "pontoMedioMa": 283.5
    },
    {
      "id": "pteranodon",
      "inicioMa": 86,
      "fimMa": 84,
      "pontoMedioMa": 85
    },
    {
      "id": "mosasaurus",
      "inicioMa": 82,
      "fimMa": 66,
      "pontoMedioMa": 74
    },
    {
      "id": "smilodon-populator",
      "inicioMa": 1,
      "fimMa": 0.01,
      "pontoMedioMa": 0.505
    },
    {
      "id": "gnathovorax",
      "inicioMa": 233.6,
      "fimMa": 227.3,
      "pontoMedioMa": 230.45
    },
    {
      "id": "carnotaurus",
      "inicioMa": 72.2,
      "fimMa": 66,
      "pontoMedioMa": 69.1
    },
    {
      "id": "deinonychus",
      "inicioMa": 121.4,
      "fimMa": 113.2,
      "pontoMedioMa": 117.30000000000001
    },
    {
      "id": "psittacosaurus",
      "inicioMa": 121.4,
      "fimMa": 113.2,
      "pontoMedioMa": 117.30000000000001
    },
    {
      "id": "edmontosaurus",
      "inicioMa": 83.6,
      "fimMa": 72.2,
      "pontoMedioMa": 77.9
    },
    {
      "id": "tapejara",
      "inicioMa": 119.57,
      "fimMa": 113.2,
      "pontoMedioMa": 116.38499999999999
    },
    {
      "id": "pleuromeia",
      "inicioMa": 251.902,
      "fimMa": 249.9,
      "pontoMedioMa": 250.901
    },
    {
      "id": "dicroidium",
      "inicioMa": 246.7,
      "fimMa": 227.3,
      "pontoMedioMa": 237
    },
    {
      "id": "araucaria-mirabilis",
      "inicioMa": 165,
      "fimMa": 161,
      "pontoMedioMa": 163
    },
    {
      "id": "ginkgoites-huttonii",
      "inicioMa": 174.7,
      "fimMa": 161.5,
      "pontoMedioMa": 168.1
    },
    {
      "id": "archaefructus",
      "inicioMa": 125.77,
      "fimMa": 121.4,
      "pontoMedioMa": 123.58500000000001
    },
    {
      "id": "duartenia",
      "inicioMa": 119.57,
      "fimMa": 113.2,
      "pontoMedioMa": 116.38499999999999
    },
    {
      "id": "gorilla-beringei",
      "inicioMa": 0.001,
      "fimMa": 0,
      "pontoMedioMa": 0.0005
    },
    {
      "id": "gorilla-gorilla",
      "inicioMa": 0.001,
      "fimMa": 0,
      "pontoMedioMa": 0.0005
    },
    {
      "id": "homo-sapiens",
      "inicioMa": 0.315,
      "fimMa": 0,
      "pontoMedioMa": 0.1575
    },
    {
      "id": "pan-paniscus",
      "inicioMa": 0.001,
      "fimMa": 0,
      "pontoMedioMa": 0.0005
    },
    {
      "id": "pan-troglodytes",
      "inicioMa": 0.001,
      "fimMa": 0,
      "pontoMedioMa": 0.0005
    },
    {
      "id": "pongo-abelii",
      "inicioMa": 0.001,
      "fimMa": 0,
      "pontoMedioMa": 0.0005
    },
    {
      "id": "pongo-pygmaeus",
      "inicioMa": 0.001,
      "fimMa": 0,
      "pontoMedioMa": 0.0005
    },
    {
      "id": "pongo-tapanuliensis",
      "inicioMa": 0.001,
      "fimMa": 0,
      "pontoMedioMa": 0.0005
    },
    {
      "id": "sahelanthropus-tchadensis",
      "inicioMa": 7,
      "fimMa": 6,
      "pontoMedioMa": 6.5
    },
    {
      "id": "orrorin-tugenensis",
      "inicioMa": 6.2,
      "fimMa": 5.8,
      "pontoMedioMa": 6
    },
    {
      "id": "ardipithecus-kadabba",
      "inicioMa": 5.8,
      "fimMa": 5.2,
      "pontoMedioMa": 5.5
    },
    {
      "id": "ardipithecus-ramidus",
      "inicioMa": 4.5,
      "fimMa": 4.3,
      "pontoMedioMa": 4.4
    },
    {
      "id": "australopithecus-anamensis",
      "inicioMa": 4.2,
      "fimMa": 3.8,
      "pontoMedioMa": 4
    },
    {
      "id": "australopithecus-afarensis",
      "inicioMa": 3.85,
      "fimMa": 2.95,
      "pontoMedioMa": 3.4000000000000004
    },
    {
      "id": "australopithecus-africanus",
      "inicioMa": 3.3,
      "fimMa": 2.1,
      "pontoMedioMa": 2.7
    },
    {
      "id": "australopithecus-garhi",
      "inicioMa": 2.55,
      "fimMa": 2.45,
      "pontoMedioMa": 2.5
    },
    {
      "id": "australopithecus-sediba",
      "inicioMa": 1.99,
      "fimMa": 1.97,
      "pontoMedioMa": 1.98
    },
    {
      "id": "paranthropus-aethiopicus",
      "inicioMa": 2.7,
      "fimMa": 2.3,
      "pontoMedioMa": 2.5
    },
    {
      "id": "paranthropus-boisei",
      "inicioMa": 2.3,
      "fimMa": 1.2,
      "pontoMedioMa": 1.75
    },
    {
      "id": "paranthropus-robustus",
      "inicioMa": 2,
      "fimMa": 1.2,
      "pontoMedioMa": 1.6
    },
    {
      "id": "kenyanthropus-platyops",
      "inicioMa": 3.5,
      "fimMa": 3.2,
      "pontoMedioMa": 3.35
    },
    {
      "id": "homo-habilis",
      "inicioMa": 2.4,
      "fimMa": 1.4,
      "pontoMedioMa": 1.9
    },
    {
      "id": "homo-rudolfensis",
      "inicioMa": 1.9,
      "fimMa": 1.8,
      "pontoMedioMa": 1.85
    },
    {
      "id": "homo-erectus",
      "inicioMa": 1.89,
      "fimMa": 0.11,
      "pontoMedioMa": 1
    },
    {
      "id": "homo-heidelbergensis",
      "inicioMa": 0.7,
      "fimMa": 0.2,
      "pontoMedioMa": 0.44999999999999996
    },
    {
      "id": "homo-neanderthalensis",
      "inicioMa": 0.4,
      "fimMa": 0.04,
      "pontoMedioMa": 0.22
    },
    {
      "id": "homo-naledi",
      "inicioMa": 0.335,
      "fimMa": 0.236,
      "pontoMedioMa": 0.2855
    },
    {
      "id": "homo-floresiensis",
      "inicioMa": 0.1,
      "fimMa": 0.05,
      "pontoMedioMa": 0.07500000000000001
    },
    {
      "id": "dickinsonia-costata",
      "inicioMa": 558,
      "fimMa": 555,
      "pontoMedioMa": 556.5
    },
    {
      "id": "anomalocaris-canadensis",
      "inicioMa": 509,
      "fimMa": 505,
      "pontoMedioMa": 507
    },
    {
      "id": "tiktaalik-roseae",
      "inicioMa": 375,
      "fimMa": 374,
      "pontoMedioMa": 374.5
    },
    {
      "id": "acanthostega-gunnari",
      "inicioMa": 365,
      "fimMa": 363,
      "pontoMedioMa": 364
    },
    {
      "id": "rhynia-gwynne-vaughanii",
      "inicioMa": 411,
      "fimMa": 407,
      "pontoMedioMa": 409
    },
    {
      "id": "calamites-suckowii",
      "inicioMa": 323,
      "fimMa": 299,
      "pontoMedioMa": 311
    },
    {
      "id": "glossopteris-indica",
      "inicioMa": 299,
      "fimMa": 252,
      "pontoMedioMa": 275.5
    },
    {
      "id": "cycadeoidea",
      "inicioMa": 161,
      "fimMa": 100,
      "pontoMedioMa": 130.5
    }
  ],
  "timeline": {
    "organismoIds": [
      "dickinsonia-costata",
      "anomalocaris-canadensis",
      "rhynia-gwynne-vaughanii",
      "tiktaalik-roseae",
      "acanthostega-gunnari",
      "calamites-suckowii",
      "glossopteris-indica",
      "dimetrodon",
      "pleuromeia",
      "dicroidium",
      "gnathovorax",
      "staurikosaurus",
      "buriolestes",
      "coelophysis",
      "plateosaurus",
      "ginkgoites-huttonii",
      "araucaria-mirabilis",
      "cycadeoidea",
      "stegosaurus",
      "allosaurus",
      "diplodocus",
      "brachiosaurus",
      "archaeopteryx",
      "iguanodon",
      "archaefructus",
      "deinonychus",
      "psittacosaurus",
      "tapejara",
      "duartenia",
      "irritator",
      "spinosaurus",
      "pteranodon",
      "austroposeidon",
      "edmontosaurus",
      "mosasaurus",
      "parasaurolophus",
      "velociraptor",
      "carnotaurus",
      "berthasaura",
      "uberabatitan",
      "tyrannosaurus-rex",
      "triceratops",
      "ankylosaurus",
      "sahelanthropus-tchadensis",
      "orrorin-tugenensis",
      "ardipithecus-kadabba",
      "ardipithecus-ramidus",
      "australopithecus-anamensis",
      "australopithecus-afarensis",
      "kenyanthropus-platyops",
      "australopithecus-africanus",
      "paranthropus-aethiopicus",
      "australopithecus-garhi",
      "homo-habilis",
      "paranthropus-boisei",
      "paranthropus-robustus",
      "australopithecus-sediba",
      "homo-rudolfensis",
      "homo-erectus",
      "smilodon-populator",
      "homo-heidelbergensis",
      "homo-neanderthalensis",
      "homo-naledi",
      "homo-sapiens",
      "homo-floresiensis",
      "gorilla-beringei",
      "gorilla-gorilla",
      "pan-paniscus",
      "pan-troglodytes",
      "pongo-abelii",
      "pongo-pygmaeus",
      "pongo-tapanuliensis"
    ],
    "marcoIds": [
      "primeiros-indicios-vida",
      "grande-oxidacao",
      "primeiros-eucariontes",
      "biota-ediacarana",
      "diversificacao-cambriana",
      "primeiros-vertebrados",
      "plantas-vasculares",
      "primeiros-tetrapodes",
      "primeiros-amniotas",
      "extincao-permiano",
      "primeiros-dinossauros",
      "primeiros-pterossauros",
      "primeiros-mamaliaformes",
      "extincao-triassico-jurassico",
      "fragmentacao-pangeia",
      "primeiros-avialanos",
      "plantas-com-flores",
      "diversificacao-titanossauros",
      "extincao-k-pg",
      "radiacao-mamiferos",
      "expansao-campos",
      "primeiros-homininos",
      "intercambio-americano",
      "megafauna-pleistocenica",
      "homo-sapiens"
    ]
  },
  "humanidade": {
    "organismoIds": [
      "gorilla-beringei",
      "gorilla-gorilla",
      "homo-sapiens",
      "pan-paniscus",
      "pan-troglodytes",
      "pongo-abelii",
      "pongo-pygmaeus",
      "pongo-tapanuliensis",
      "sahelanthropus-tchadensis",
      "orrorin-tugenensis",
      "ardipithecus-kadabba",
      "ardipithecus-ramidus",
      "australopithecus-anamensis",
      "australopithecus-afarensis",
      "australopithecus-africanus",
      "australopithecus-garhi",
      "australopithecus-sediba",
      "paranthropus-aethiopicus",
      "paranthropus-boisei",
      "paranthropus-robustus",
      "kenyanthropus-platyops",
      "homo-habilis",
      "homo-rudolfensis",
      "homo-erectus",
      "homo-heidelbergensis",
      "homo-neanderthalensis",
      "homo-naledi",
      "homo-floresiensis"
    ],
    "especimeIds": [
      "toumai",
      "ardi",
      "lucy",
      "taung-1",
      "little-foot",
      "oh-7",
      "turkana-boy",
      "dmanisi-5",
      "neanderthal-1",
      "denisova-3",
      "lb1",
      "dh1"
    ],
    "linhagemIds": [
      "denisovanos",
      "ancestral-mitocondrial-comum",
      "ancestral-y-comum"
    ],
    "dossieIds": [
      "termos-familia-humana",
      "arvore-nao-escada",
      "eva-mitocondrial",
      "ancestral-y",
      "coalescencia",
      "origem-africana-dispersoes",
      "neandertais-denisovanos",
      "dna-antigo-metodo"
    ]
  },
  "biblioteca": {
    "publicacaoIds": [
      "arvore-ou-escada",
      "familia-humana",
      "eva-mitocondrial-explicada",
      "migracoes-e-encontros",
      "fosseis-e-dna-antigo",
      "revolucao-dna-antigo",
      "dna-neandertal",
      "dna-historia-humana",
      "leitura-cann-1987",
      "leitura-green-2010",
      "leitura-reich-2010",
      "leitura-berger-2015"
    ],
    "porModo": {
      "sintese-dinopad": [
        "arvore-ou-escada",
        "familia-humana",
        "eva-mitocondrial-explicada",
        "migracoes-e-encontros",
        "fosseis-e-dna-antigo"
      ],
      "traducao-autorizada": [
        "revolucao-dna-antigo",
        "dna-neandertal",
        "dna-historia-humana"
      ],
      "leitura-guiada": [
        "leitura-cann-1987",
        "leitura-green-2010",
        "leitura-reich-2010",
        "leitura-berger-2015"
      ]
    }
  }
} as const;
