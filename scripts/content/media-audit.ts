import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import milestone from '../../src/content/milestones/meta-72.json';
import { loadCatalog, repoRoot } from './io';

const catalog = loadCatalog();
const outputDir = resolve(repoRoot, '.dev/content-health/media-audit');
mkdirSync(outputDir, { recursive: true });
const initialIds = new Set(milestone.organismoIds.slice(0, 36));
const organisms = catalog.organismos.filter(({ id }) => milestone.organismoIds.includes(id) && !initialIds.has(id));
const mediaById = new Map(catalog.media.map((asset) => [asset.id, asset]));
const organismById = new Map(organisms.map((organism) => [organism.id, organism]));
const pageSize = 9;
const cellWidth = 360;
const cellHeight = 290;
const columns = 3;

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

for (let pageIndex = 0; pageIndex < Math.ceil(organisms.length / pageSize); pageIndex += 1) {
  const page = organisms.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  const composites: OverlayOptions[] = [];
  for (const [index, organism] of page.entries()) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = column * cellWidth;
    const y = row * cellHeight;
    const visualAssets = organism.mediaIds.map((id) => mediaById.get(id)).filter((asset) => asset && ['evidencia', 'interpretacao'].includes(asset.papel));
    for (const [assetIndex, asset] of visualAssets.entries()) {
      const source = resolve(repoRoot, 'public', asset!.arquivos.src.replace(/^\//, ''));
      const thumbnail = await sharp(source).resize({ width: 168, height: 188, fit: 'cover', position: 'attention' }).png().toBuffer();
      composites.push({ input: thumbnail, left: x + 8 + assetIndex * 176, top: y + 8 });
    }
    const caption = Buffer.from(`<svg width="${cellWidth}" height="86" xmlns="http://www.w3.org/2000/svg">
      <rect width="${cellWidth}" height="86" fill="#f2ead8"/>
      <text x="10" y="24" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#26231d">${escapeXml(organism.nomePt)}</text>
      <text x="10" y="44" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#514b40">${escapeXml(organism.nomeCientifico)}</text>
      <text x="10" y="66" font-family="Arial, sans-serif" font-size="11" fill="#6a604e">${escapeXml(visualAssets.map((asset) => `${asset!.papel}: ${asset!.licenca}`).join(' · '))}</text>
    </svg>`);
    composites.push({ input: caption, left: x, top: y + 196 });
  }
  const rows = Math.ceil(page.length / columns);
  const output = resolve(outputDir, `meta-72-${pageIndex + 1}.png`);
  await sharp({
    create: {
      width: cellWidth * columns,
      height: cellHeight * rows,
      channels: 4,
      background: '#17150f',
    },
  }).composite(composites).png().toFile(output);
  console.log(`Prancha ${pageIndex + 1}: ${output}`);
}

for (const id of milestone.organismoIds.slice(36)) {
  if (!organismById.has(id)) throw new Error(`Organismo do lote não encontrado: ${id}`);
}
