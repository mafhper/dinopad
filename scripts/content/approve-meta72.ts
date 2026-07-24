import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { MediaAsset, OrganismoAtlas } from '../../src/content/schema';
import milestone from '../../src/content/milestones/meta-72.json';
import { dataDir, publicAssetExists } from './io';

const organismPath = resolve(dataDir, 'organismos.json');
const mediaPath = resolve(dataDir, 'media.json');
const organisms = JSON.parse(readFileSync(organismPath, 'utf8')) as OrganismoAtlas[];
const media = JSON.parse(readFileSync(mediaPath, 'utf8')) as MediaAsset[];
const mediaById = new Map(media.map((asset) => [asset.id, asset]));
const candidateIds = new Set(milestone.organismoIds.slice(36));
const allowed = new Set<MediaAsset['licenca']>(['CC0', 'PDM', 'CC-BY-2.0', 'CC-BY-3.0', 'CC-BY-4.0', 'CC-BY-SA-2.0', 'CC-BY-SA-3.0', 'CC-BY-SA-4.0', 'MIT']);
const problems: string[] = [];

for (const organism of organisms.filter(({ id }) => candidateIds.has(id))) {
  const assets = organism.mediaIds.map((id) => mediaById.get(id));
  const roles = new Set(assets.flatMap((asset) => asset ? [asset.papel] : []));
  if (assets.some((asset) => !asset)) problems.push(`${organism.id}: mídia ausente.`);
  if (!roles.has('evidencia') || !roles.has('interpretacao') || ![...roles].some((role) => ['escala', 'mapa', 'habitat', 'morfologia'].includes(role))) problems.push(`${organism.id}: tríade incompleta.`);
  for (const asset of assets) {
    if (!asset) continue;
    if (!allowed.has(asset.licenca)) problems.push(`${asset.id}: licença rejeitada.`);
    if (!publicAssetExists(asset.arquivos.src)) problems.push(`${asset.id}: arquivo local ausente.`);
    if (!asset.altPt || !asset.legendaPt || !asset.urlFonte) problems.push(`${asset.id}: metadados editoriais incompletos.`);
  }
}

if (problems.length) {
  console.error('Lote não pode ser aprovado:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exitCode = 1;
} else {
  const updated = organisms.map((organism) => candidateIds.has(organism.id)
    ? { ...organism, revisao: { status: 'aprovado' as const, revisadoEm: '2026-07-24', observacoes: 'Tríade local, licença e metadados verificados no checkpoint Meta 72.' } }
    : organism);
  writeFileSync(organismPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  console.log(`Aprovadas ${candidateIds.size} fichas do lote Meta 72.`);
}
