import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadCatalog, repoRoot } from './io';
import meta72 from '../../src/content/milestones/meta-72.json';

const catalogo = loadCatalog();
const milestoneIndex = process.argv.indexOf('--milestone');
const milestoneId = milestoneIndex >= 0 ? process.argv[milestoneIndex + 1] : undefined;
const mediaPorId = new Map(catalogo.media.map((media) => [media.id, media]));
const papeisComplementares = ['escala', 'mapa', 'habitat', 'morfologia'];
const linhas = catalogo.organismos.map((organismo) => {
  const papeis = new Set(organismo.mediaIds.flatMap((id) => {
    const media = mediaPorId.get(id);
    return media ? [media.papel] : [];
  }));
  const cobertura = Number(papeis.has('evidencia')) + Number(papeis.has('interpretacao')) + Number(papeisComplementares.some((papel) => papeis.has(papel as never)));
  return {
    id: organismo.id,
    reino: organismo.reino,
    revisao: organismo.revisao.status,
    fontes: new Set([...organismo.fonteIds, ...organismo.intervalo.fonteIds, ...organismo.energia.fonteIds, ...organismo.medidas.fonteIds]).size,
    midias: organismo.mediaIds.length,
    triade: `${cobertura}/3`,
    especimes: organismo.especimeIds.length,
  };
});

console.table(linhas);
const totais = {
  organismos: catalogo.organismos.length,
  fauna: catalogo.organismos.filter(({ reino }) => reino === 'animalia').length,
  flora: catalogo.organismos.filter(({ reino }) => reino === 'plantae').length,
  midias: catalogo.media.length,
  especimes: catalogo.especimes.length,
  marcos: catalogo.marcos.length,
  fontes: catalogo.fontes.length,
  nosFilogeneticos: catalogo.nosFilogeneticos.length,
  linhagens: catalogo.linhagens.length,
  conexoesEvolutivas: catalogo.conexoesEvolutivas.length,
  dossies: catalogo.dossies.length,
  publicacoes: catalogo.publicacoes.length,
};
console.log('Totais —', totais);
const reportDir = resolve(repoRoot, '.dev/content-health');
mkdirSync(reportDir, { recursive: true });
writeFileSync(resolve(reportDir, 'cobertura.json'), `${JSON.stringify({ geradoEm: new Date().toISOString(), totais, organismos: linhas }, null, 2)}\n`, 'utf8');
console.log('Relatório salvo em .dev/content-health/cobertura.json.');

if (milestoneId) {
  if (milestoneId !== meta72.id) throw new Error(`Checkpoint desconhecido: ${milestoneId}`);
  const problems: string[] = [];
  const organismsById = new Map(catalogo.organismos.map((organism) => [organism.id, organism]));
  for (const id of meta72.organismoIds) {
    const organism = organismsById.get(id);
    if (!organism) problems.push(`Organismo ausente: ${id}`);
    else if (organism.revisao.status !== 'aprovado') problems.push(`Organismo não aprovado: ${id}`);
  }
  const organismMedia = catalogo.media.filter(({ entidade }) => entidade.tipo === 'organismo');
  if (organismMedia.length < meta72.minimos.midiasDeOrganismos) problems.push(`Mídias de organismos: ${organismMedia.length}/${meta72.minimos.midiasDeOrganismos}`);
  if (catalogo.especimes.length < meta72.minimos.especimes) problems.push(`Espécimes: ${catalogo.especimes.length}/${meta72.minimos.especimes}`);
  if (catalogo.dossies.length < meta72.minimos.dossies) problems.push(`Dossiês: ${catalogo.dossies.length}/${meta72.minimos.dossies}`);
  if (catalogo.publicacoes.length < meta72.minimos.publicacoes) problems.push(`Publicações: ${catalogo.publicacoes.length}/${meta72.minimos.publicacoes}`);
  const traducoesIntegrais = catalogo.publicacoes.filter(({ modo, traducaoIntegral }) => modo === 'traducao-autorizada' && traducaoIntegral).length;
  if (traducoesIntegrais !== 3) problems.push(`Traduções integrais autorizadas: ${traducoesIntegrais}/3`);
  if (meta72.organismoIds.length !== 72) problems.push(`Manifesto do checkpoint contém ${meta72.organismoIds.length}/72 IDs.`);
  const milestoneReport = { id: meta72.id, verificadoEm: new Date().toISOString(), ok: problems.length === 0, problems };
  writeFileSync(resolve(reportDir, `${meta72.id}.json`), `${JSON.stringify(milestoneReport, null, 2)}\n`, 'utf8');
  if (problems.length) {
    console.error(`Checkpoint ${meta72.id} incompleto:`);
    for (const problem of problems) console.error(`- ${problem}`);
    process.exitCode = 1;
  } else {
    console.log(`Checkpoint ${meta72.id} atendido: 72 organismos e todos os mínimos editoriais.`);
  }
}

if (process.argv.includes('--check-links')) {
  const verificar = async (fonte: typeof catalogo.fontes[number]) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    try {
      let response = await fetch(fonte.url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
      if (response.status === 405 || response.status === 501) {
        response = await fetch(fonte.url, { headers: { Range: 'bytes=0-1023' }, redirect: 'follow', signal: controller.signal });
      }
      return { id: fonte.id, url: fonte.url, status: response.status, ok: response.ok, urlFinal: response.url };
    } catch (error) {
      return { id: fonte.id, url: fonte.url, status: null, ok: false, erro: error instanceof Error ? error.message : String(error) };
    } finally {
      clearTimeout(timer);
    }
  };
  const resultados: Awaited<ReturnType<typeof verificar>>[] = [];
  for (let index = 0; index < catalogo.fontes.length; index += 6) {
    resultados.push(...await Promise.all(catalogo.fontes.slice(index, index + 6).map(verificar)));
  }
  writeFileSync(resolve(reportDir, 'links.json'), `${JSON.stringify({ verificadoEm: new Date().toISOString(), resultados }, null, 2)}\n`, 'utf8');
  console.log(`Saúde de ${resultados.length} URLs salva em .dev/content-health/links.json (${resultados.filter(({ ok }) => ok).length} acessíveis nesta verificação).`);
}
