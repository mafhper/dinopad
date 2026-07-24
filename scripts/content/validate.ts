import { ZodError } from 'zod';
import type { Catalogo, FonteCientifica, MediaAsset, OrganismoAtlas } from '../../src/content/schema';
import { loadCatalog, publicAssetExists } from './io';

type Problema = { contexto: string; mensagem: string };

function uniqueIds<T extends { id: string }>(items: T[], contexto: string, problemas: Problema[]) {
  const vistos = new Set<string>();
  for (const item of items) {
    if (vistos.has(item.id)) problemas.push({ contexto, mensagem: `ID duplicado: ${item.id}` });
    vistos.add(item.id);
  }
}

function checarIntervalo(contexto: string, inicioMa: number, fimMa: number, problemas: Problema[]) {
  if (inicioMa <= fimMa) problemas.push({ contexto, mensagem: `inicioMa (${inicioMa}) deve ser maior que fimMa (${fimMa}).` });
}

function checarTriade(organismo: OrganismoAtlas, mediaPorId: Map<string, MediaAsset>, problemas: Problema[]) {
  const papeis = new Set(organismo.mediaIds.flatMap((id) => {
    const item = mediaPorId.get(id);
    return item ? [item.papel] : [];
  }));
  if (!papeis.has('evidencia')) problemas.push({ contexto: organismo.id, mensagem: 'Falta mídia de evidência ou registro observável.' });
  if (!papeis.has('interpretacao')) problemas.push({ contexto: organismo.id, mensagem: 'Falta reconstrução, anatomia ou segunda evidência identificada.' });
  if (![...papeis].some((papel) => ['escala', 'mapa', 'habitat', 'morfologia'].includes(papel))) {
    problemas.push({ contexto: organismo.id, mensagem: 'Falta mídia de escala, mapa, habitat ou morfologia.' });
  }
}

function validarFilogenia(catalogo: Catalogo, fonteIds: Set<string>, problemas: Problema[]) {
  const noPorId = new Map(catalogo.nosFilogeneticos.map((no) => [no.id, no]));
  const raizes = catalogo.nosFilogeneticos.filter(({ paiId }) => paiId === null);
  if (raizes.length !== 1) problemas.push({ contexto: 'filogenia', mensagem: `A árvore deve ter uma raiz; encontrado: ${raizes.length}.` });

  for (const no of catalogo.nosFilogeneticos) {
    if (no.paiId && !noPorId.has(no.paiId)) problemas.push({ contexto: no.id, mensagem: `Nó pai inexistente: ${no.paiId}` });
    for (const fonteId of no.fonteIds) {
      if (!fonteIds.has(fonteId)) problemas.push({ contexto: no.id, mensagem: `Fonte filogenética inexistente: ${fonteId}` });
    }
    const visitados = new Set<string>();
    let atual = no;
    while (atual.paiId) {
      if (visitados.has(atual.id)) {
        problemas.push({ contexto: no.id, mensagem: 'Ciclo detectado na filogenia.' });
        break;
      }
      visitados.add(atual.id);
      const pai = noPorId.get(atual.paiId);
      if (!pai) break;
      atual = pai;
    }
  }
}

function validarRelacoes(catalogo: Catalogo): Problema[] {
  const problemas: Problema[] = [];
  const fonteIds = new Set(catalogo.fontes.map(({ id }) => id));
  const fontePorId = new Map(catalogo.fontes.map((fonte) => [fonte.id, fonte]));
  const periodoIds = new Set(catalogo.periodos.map(({ id }) => id));
  const eraIds = new Set(catalogo.eras.map(({ id }) => id));
  const noIds = new Set(catalogo.nosFilogeneticos.map(({ id }) => id));
  const organismoIds = new Set(catalogo.organismos.map(({ id }) => id));
  const categoriaPorId = new Map(catalogo.categorias.map((categoria) => [categoria.id, categoria]));
  const especimeIds = new Set(catalogo.especimes.map(({ id }) => id));
  const linhagemIds = new Set(catalogo.linhagens.map(({ id }) => id));
  const dossieIds = new Set(catalogo.dossies.map(({ id }) => id));
  const publicacaoIds = new Set(catalogo.publicacoes.map(({ id }) => id));
  const mediaPorId = new Map(catalogo.media.map((item) => [item.id, item]));

  const checarFontes = (contexto: string, ids: string[]) => {
    for (const id of ids) if (!fonteIds.has(id)) problemas.push({ contexto, mensagem: `Fonte inexistente: ${id}` });
  };
  const checarCampoSustentado = (contexto: string, ids: string[], campo: FonteCientifica['camposSustentados'][number]) => {
    if (!ids.some((id) => fontePorId.get(id)?.camposSustentados.includes(campo))) {
      problemas.push({ contexto, mensagem: `Nenhuma das fontes declaradas sustenta o campo “${campo}”.` });
    }
  };

  uniqueIds(catalogo.eras, 'eras', problemas);
  uniqueIds(catalogo.periodos, 'periodos', problemas);
  uniqueIds(catalogo.categorias, 'categorias', problemas);
  uniqueIds(catalogo.nosFilogeneticos, 'filogenia', problemas);
  uniqueIds(catalogo.fontes, 'fontes', problemas);
  uniqueIds(catalogo.organismos, 'organismos', problemas);
  uniqueIds(catalogo.media, 'media', problemas);
  uniqueIds(catalogo.especimes, 'especimes', problemas);
  uniqueIds(catalogo.marcos, 'marcos', problemas);
  uniqueIds(catalogo.linhagens, 'linhagens', problemas);
  uniqueIds(catalogo.conexoesEvolutivas, 'conexoes-evolutivas', problemas);
  uniqueIds(catalogo.dossies, 'dossies', problemas);
  uniqueIds(catalogo.publicacoes, 'publicacoes', problemas);
  validarFilogenia(catalogo, fonteIds, problemas);

  for (const era of catalogo.eras) checarIntervalo(era.id, era.inicioMa, era.fimMa, problemas);
  for (const periodo of catalogo.periodos) {
    checarIntervalo(periodo.id, periodo.inicioMa, periodo.fimMa, problemas);
    if (!eraIds.has(periodo.eraId)) problemas.push({ contexto: periodo.id, mensagem: `Era inexistente: ${periodo.eraId}` });
  }

  for (const organismo of catalogo.organismos) {
    checarIntervalo(organismo.id, organismo.intervalo.inicioMa, organismo.intervalo.fimMa, problemas);
    for (const medida of organismo.medidas.itens) {
      if (medida.min > medida.max) problemas.push({ contexto: organismo.id, mensagem: `${medida.tipo}.min deve ser menor ou igual ao máximo.` });
    }
    checarFontes(organismo.id, [
      ...organismo.fonteIds,
      ...organismo.intervalo.fonteIds,
      ...organismo.energia.fonteIds,
      ...organismo.medidas.fonteIds,
      ...organismo.relacoes.flatMap((relacao) => relacao.fonteIds),
    ]);
    checarCampoSustentado(organismo.id, organismo.fonteIds, 'taxonomia');
    checarCampoSustentado(organismo.id, organismo.fonteIds, 'ocorrencias');
    checarCampoSustentado(`${organismo.id}.intervalo`, organismo.intervalo.fonteIds, 'intervalo');
    checarCampoSustentado(`${organismo.id}.energia`, organismo.energia.fonteIds, 'energia');
    checarCampoSustentado(`${organismo.id}.medidas`, organismo.medidas.fonteIds, 'dimensoes');
    for (const categoriaId of organismo.categoriaIds) {
      const categoria = categoriaPorId.get(categoriaId);
      if (!categoria) problemas.push({ contexto: organismo.id, mensagem: `Categoria inexistente: ${categoriaId}` });
      else if (categoria.reino !== organismo.reino) problemas.push({ contexto: organismo.id, mensagem: `Categoria ${categoriaId} pertence a ${categoria.reino}.` });
    }
    if (!noIds.has(organismo.noFilogeneticoId)) problemas.push({ contexto: organismo.id, mensagem: `Nó filogenético inexistente: ${organismo.noFilogeneticoId}` });
    for (const periodoId of organismo.periodoIds) {
      if (!periodoIds.has(periodoId)) problemas.push({ contexto: organismo.id, mensagem: `Período inexistente: ${periodoId}` });
    }
    for (const mediaId of organismo.mediaIds) {
      if (!mediaPorId.has(mediaId)) problemas.push({ contexto: organismo.id, mensagem: `Mídia inexistente: ${mediaId}` });
    }
    if (!organismo.mediaIds.includes(organismo.mediaPrincipalId)) problemas.push({ contexto: organismo.id, mensagem: 'mediaPrincipalId não pertence à ficha.' });
    for (const especimeId of organismo.especimeIds) {
      if (!especimeIds.has(especimeId)) problemas.push({ contexto: organismo.id, mensagem: `Espécime inexistente: ${especimeId}` });
    }
    for (const relacao of organismo.relacoes) {
      if (!organismoIds.has(relacao.organismoId)) problemas.push({ contexto: organismo.id, mensagem: `Relação aponta para organismo inexistente: ${relacao.organismoId}` });
      checarCampoSustentado(`${organismo.id}.relacao.${relacao.organismoId}`, relacao.fonteIds, 'filogenia');
    }
    if (organismo.revisao.status === 'aprovado') checarTriade(organismo, mediaPorId, problemas);
  }

  for (const media of catalogo.media) {
    const entidadeExiste = {
      organismo: organismoIds,
      especime: especimeIds,
      linhagem: linhagemIds,
      dossie: dossieIds,
      publicacao: publicacaoIds,
    }[media.entidade.tipo].has(media.entidade.id);
    if (!entidadeExiste) problemas.push({ contexto: media.id, mensagem: `Entidade inexistente: ${media.entidade.tipo}/${media.entidade.id}` });
    for (const src of [media.arquivos.src, media.arquivos.srcSet, media.arquivos.avifSrcSet, media.arquivos.miniaturaSrcSet].filter(Boolean)) {
      const urls = src!.split(',').map((item) => item.trim().split(/\s+/, 1)[0]);
      for (const url of urls) {
        if (/^https?:\/\//i.test(url)) problemas.push({ contexto: media.id, mensagem: `URL remota em produção: ${url}` });
        else if (!publicAssetExists(url)) problemas.push({ contexto: media.id, mensagem: `Arquivo local não encontrado: ${url}` });
      }
    }
  }

  for (const especime of catalogo.especimes) {
    if (especime.organismoId && !organismoIds.has(especime.organismoId)) problemas.push({ contexto: especime.id, mensagem: `Organismo inexistente: ${especime.organismoId}` });
    if (especime.linhagemId && !linhagemIds.has(especime.linhagemId)) problemas.push({ contexto: especime.id, mensagem: `Linhagem inexistente: ${especime.linhagemId}` });
    checarFontes(especime.id, especime.fonteIds);
    checarCampoSustentado(especime.id, especime.fonteIds, 'especime');
    for (const mediaId of especime.mediaIds) if (!mediaPorId.has(mediaId)) problemas.push({ contexto: especime.id, mensagem: `Mídia inexistente: ${mediaId}` });
  }

  for (const marco of catalogo.marcos) {
    if (marco.fimMa !== undefined) checarIntervalo(marco.id, marco.dataMa, marco.fimMa, problemas);
    if (marco.periodoId && !periodoIds.has(marco.periodoId)) problemas.push({ contexto: marco.id, mensagem: `Período inexistente: ${marco.periodoId}` });
    checarFontes(marco.id, marco.fonteIds);
    checarCampoSustentado(marco.id, marco.fonteIds, 'marco');
    if (marco.categoria !== 'geologia' && marco.fonteIds.length === 1 && marco.fonteIds[0] === 'ics-2026') {
      problemas.push({ contexto: marco.id, mensagem: 'ICS não pode ser a única fonte de um evento biológico.' });
    }
  }

  const eventosKPg = catalogo.marcos.filter((marco) => /k[–-]pg/i.test(`${marco.id} ${marco.titulo}`));
  if (eventosKPg.length !== 1) problemas.push({ contexto: 'marcos', mensagem: `A extinção K–Pg deve aparecer uma única vez; encontrado: ${eventosKPg.length}.` });

  for (const linhagem of catalogo.linhagens) {
    checarFontes(linhagem.id, linhagem.fonteIds);
    checarCampoSustentado(linhagem.id, linhagem.fonteIds, 'genetica');
    for (const organismoId of linhagem.organismoIds) if (!organismoIds.has(organismoId)) problemas.push({ contexto: linhagem.id, mensagem: `Organismo inexistente: ${organismoId}` });
    for (const noId of linhagem.noFilogeneticoIds) if (!noIds.has(noId)) problemas.push({ contexto: linhagem.id, mensagem: `Nó filogenético inexistente: ${noId}` });
  }
  for (const conexao of catalogo.conexoesEvolutivas) {
    const entidades = new Set([...organismoIds, ...linhagemIds]);
    if (!entidades.has(conexao.origemId)) problemas.push({ contexto: conexao.id, mensagem: `Origem inexistente: ${conexao.origemId}` });
    if (!entidades.has(conexao.destinoId)) problemas.push({ contexto: conexao.id, mensagem: `Destino inexistente: ${conexao.destinoId}` });
    if (conexao.origemId === conexao.destinoId) problemas.push({ contexto: conexao.id, mensagem: 'Conexão não pode apontar para a própria entidade.' });
    checarFontes(conexao.id, conexao.fonteIds);
    checarCampoSustentado(conexao.id, conexao.fonteIds, 'genetica');
  }
  for (const dossie of catalogo.dossies) {
    checarFontes(dossie.id, dossie.fonteIds);
    checarCampoSustentado(dossie.id, dossie.fonteIds, 'conceito');
    for (const organismoId of dossie.organismoIds) if (!organismoIds.has(organismoId)) problemas.push({ contexto: dossie.id, mensagem: `Organismo inexistente: ${organismoId}` });
    for (const linhagemId of dossie.linhagemIds) if (!linhagemIds.has(linhagemId)) problemas.push({ contexto: dossie.id, mensagem: `Linhagem inexistente: ${linhagemId}` });
    uniqueIds(dossie.blocos, `${dossie.id}.blocos`, problemas);
  }
  for (const publicacao of catalogo.publicacoes) {
    checarFontes(publicacao.id, publicacao.fonteIds);
    checarCampoSustentado(publicacao.id, publicacao.fonteIds, 'publicacao');
    if (publicacao.modo === 'traducao-autorizada' && (!publicacao.traducaoIntegral || !publicacao.fonteOriginal.permiteTraducaoIntegral || !publicacao.fonteOriginal.urlLicenca)) {
      problemas.push({ contexto: publicacao.id, mensagem: 'Tradução autorizada deve ser integral e ter licença explícita.' });
    }
    if (publicacao.modo !== 'traducao-autorizada' && publicacao.traducaoIntegral) {
      problemas.push({ contexto: publicacao.id, mensagem: 'Somente traduções autorizadas podem ser marcadas como integrais.' });
    }
    if (publicacao.traducaoIntegral) {
      const caracteres = publicacao.camadaAprofundar.reduce((total, bloco) => total + (bloco.texto?.length ?? 0), 0);
      if (caracteres < 7_500) problemas.push({ contexto: publicacao.id, mensagem: `Tradução integral curta demais para o artigo (${caracteres} caracteres).` });
    }
    for (const organismoId of publicacao.organismoIds) if (!organismoIds.has(organismoId)) problemas.push({ contexto: publicacao.id, mensagem: `Organismo inexistente: ${organismoId}` });
    for (const linhagemId of publicacao.linhagemIds) if (!linhagemIds.has(linhagemId)) problemas.push({ contexto: publicacao.id, mensagem: `Linhagem inexistente: ${linhagemId}` });
    for (const dossieId of publicacao.dossieIds) if (!dossieIds.has(dossieId)) problemas.push({ contexto: publicacao.id, mensagem: `Dossiê inexistente: ${dossieId}` });
    uniqueIds([...publicacao.camadaEssencial, ...publicacao.camadaAprofundar], `${publicacao.id}.blocos`, problemas);
  }
  return problemas;
}

try {
  const catalogo = loadCatalog();
  const problemas = validarRelacoes(catalogo);
  if (problemas.length > 0) {
    console.error(`Conteúdo inválido: ${problemas.length} problema(s).`);
    for (const problema of problemas) console.error(`- [${problema.contexto}] ${problema.mensagem}`);
    process.exitCode = 1;
  } else {
    console.log(`Conteúdo válido: ${catalogo.organismos.length} organismos, ${catalogo.media.length} mídias, ${catalogo.especimes.length} espécimes, ${catalogo.dossies.length} dossiês, ${catalogo.publicacoes.length} publicações e uma filogenia com ${catalogo.nosFilogeneticos.length} nós.`);
  }
} catch (error) {
  if (error instanceof ZodError) {
    console.error('Conteúdo fora do esquema Zod:');
    for (const issue of error.issues) console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    process.exitCode = 1;
  } else throw error;
}
