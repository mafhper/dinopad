import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadCatalog, repoRoot } from './io';

const nomesSolicitados = process.argv.slice(2).filter((argumento) => argumento !== '--all');
const catalogo = loadCatalog();
const organismos = catalogo.organismos.filter((organismo) =>
  nomesSolicitados.length > 0
    ? nomesSolicitados.includes(organismo.id) || nomesSolicitados.includes(organismo.nomeCientifico)
    : true,
);

const stamp = new Date().toISOString().slice(0, 10);
const outputDir = resolve(repoRoot, '.dev/content-imports', stamp);
mkdirSync(outputDir, { recursive: true });

async function importarOrganismo(organismo: typeof catalogo.organismos[number]) {
  const taxonUrl = new URL('https://paleobiodb.org/data1.2/taxa/single.json');
  taxonUrl.searchParams.set('name', organismo.nomeCientifico);
  taxonUrl.searchParams.set('show', 'attr,app,class,ref');
  const occurrencesUrl = new URL('https://paleobiodb.org/data1.2/occs/list.json');
  occurrencesUrl.searchParams.set('base_name', organismo.nomeCientifico);
  occurrencesUrl.searchParams.set('show', 'coords,paleoloc,loc,strat,ref');
  occurrencesUrl.searchParams.set('limit', '100');
  const headers = { 'user-agent': 'Dinopad content curator/0.1' };
  const [taxonResponse, occurrencesResponse] = await Promise.all([
    fetch(taxonUrl, { headers }),
    fetch(occurrencesUrl, { headers }),
  ]);
  if (!taxonResponse.ok) throw new Error(`PBDB taxon respondeu ${taxonResponse.status} para ${organismo.nomeCientifico}`);
  if (!occurrencesResponse.ok) throw new Error(`PBDB ocorrências respondeu ${occurrencesResponse.status} para ${organismo.nomeCientifico}`);
  const data = {
    importadoEm: new Date().toISOString(),
    organismo: { id: organismo.id, nomeCientifico: organismo.nomeCientifico },
    taxon: await taxonResponse.json(),
    ocorrencias: await occurrencesResponse.json(),
  };
  writeFileSync(resolve(outputDir, `${organismo.id}.pbdb.json`), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`PBDB: ${organismo.nomeCientifico}`);
}

for (let index = 0; index < organismos.length; index += 4) {
  await Promise.all(organismos.slice(index, index + 4).map(importarOrganismo));
}

const icsUrl = 'https://stratigraphy.org/chart/';
const icsResponse = await fetch(icsUrl, { headers: { 'user-agent': 'Dinopad content curator/0.1' } });
if (!icsResponse.ok) throw new Error(`ICS respondeu ${icsResponse.status}`);
writeFileSync(resolve(outputDir, 'ics-chart.html'), await icsResponse.text(), 'utf8');
writeFileSync(
  resolve(outputDir, 'ics-version.json'),
  `${JSON.stringify({ versao: catalogo.versaoEscalaGeologica, url: icsUrl, acessadoEm: stamp }, null, 2)}\n`,
  'utf8',
);
console.log(`Candidatos brutos salvos em ${outputDir}`);
