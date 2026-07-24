import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const repoRoot = resolve(import.meta.dirname, '../..');
const brandDir = resolve(repoRoot, 'src/assets/brand');
const masterPath = resolve(brandDir, 'dinopad-dilophosaurus-editorial.png');
const transparentPath = resolve(brandDir, 'dinopad-dilophosaurus-transparent.png');
const metadataPath = resolve(brandDir, 'dinopad-dilophosaurus.generated.json');
const variants = [
  { path: resolve(brandDir, 'dinopad-dilophosaurus-home-384.webp'), width: 384, format: 'webp' as const },
  { path: resolve(brandDir, 'dinopad-dilophosaurus-home-384.avif'), width: 384, format: 'avif' as const },
  { path: resolve(brandDir, 'dinopad-dilophosaurus-home-768.webp'), width: 768, format: 'webp' as const },
  { path: resolve(brandDir, 'dinopad-dilophosaurus-home-768.avif'), width: 768, format: 'avif' as const },
];

const sha256 = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex');

function isEdgeBackground(r: number, g: number, b: number) {
  const minimum = Math.min(r, g, b);
  const maximum = Math.max(r, g, b);
  return minimum >= 190 && maximum - minimum <= 35;
}

async function createTransparentMaster() {
  const original = readFileSync(masterPath);
  const { data, info } = await sharp(original)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const total = info.width * info.height;
  const background = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const enqueue = (pixel: number) => {
    if (background[pixel]) return;
    const offset = pixel * 4;
    if (!isEdgeBackground(data[offset], data[offset + 1], data[offset + 2])) return;
    background[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < info.width; x += 1) {
    enqueue(x);
    enqueue((info.height - 1) * info.width + x);
  }
  for (let y = 0; y < info.height; y += 1) {
    enqueue(y * info.width);
    enqueue(y * info.width + info.width - 1);
  }

  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    if (x > 0) enqueue(pixel - 1);
    if (x + 1 < info.width) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - info.width);
    if (y + 1 < info.height) enqueue(pixel + info.width);
  }

  let left = info.width;
  let right = -1;
  let top = info.height;
  let bottom = -1;
  for (let pixel = 0; pixel < total; pixel += 1) {
    const offset = pixel * 4;
    if (background[pixel]) {
      data[offset + 3] = 0;
      continue;
    }
    const x = pixel % info.width;
    const y = Math.floor(pixel / info.width);
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  if (right < left || bottom < top) throw new Error('A remoção de fundo eliminou toda a arte.');

  const protection = 32;
  const artworkWidth = right - left + 1;
  const artworkHeight = bottom - top + 1;
  const outputWidth = artworkWidth + protection * 2;
  const outputHeight = artworkHeight + protection * 2;
  const cropped = Buffer.alloc(outputWidth * outputHeight * 4);
  for (let y = 0; y < artworkHeight; y += 1) {
    const sourceStart = ((top + y) * info.width + left) * 4;
    const sourceEnd = sourceStart + artworkWidth * 4;
    const targetStart = ((protection + y) * outputWidth + protection) * 4;
    data.copy(cropped, targetStart, sourceStart, sourceEnd);
  }

  const png = await sharp(cropped, {
    raw: { width: outputWidth, height: outputHeight, channels: 4 },
  }).png({ compressionLevel: 9 }).toBuffer();
  return {
    original,
    png,
    width: outputWidth,
    height: outputHeight,
    removedPixels: tail,
    totalPixels: total,
  };
}

async function validateExisting() {
  if (!existsSync(transparentPath) || !existsSync(metadataPath)) {
    throw new Error('Derivados da marca ausentes. Execute npm run brand:build.');
  }
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as {
    masterSha256: string;
    width: number;
    height: number;
  };
  const master = readFileSync(masterPath);
  if (metadata.masterSha256 !== sha256(master)) throw new Error('O master mudou sem regenerar os derivados.');
  const { data, info } = await sharp(transparentPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== metadata.width || info.height !== metadata.height) throw new Error('Dimensões do PNG transparente divergentes.');
  const corners = [0, info.width - 1, (info.height - 1) * info.width, info.width * info.height - 1];
  if (corners.some((pixel) => data[pixel * 4 + 3] !== 0)) throw new Error('Os quatro cantos do PNG devem ser transparentes.');
  for (const variant of variants) if (!existsSync(variant.path)) throw new Error(`Variante ausente: ${variant.path}`);
  console.log(`Marca válida: ${info.width}×${info.height}, master ${metadata.masterSha256.slice(0, 12)}.`);
}

async function build() {
  mkdirSync(dirname(transparentPath), { recursive: true });
  const result = await createTransparentMaster();
  writeFileSync(transparentPath, result.png);
  for (const variant of variants) {
    const pipeline = sharp(result.png).resize({ width: variant.width, withoutEnlargement: true });
    const output = variant.format === 'webp'
      ? await pipeline.webp({ quality: 88, smartSubsample: true }).toBuffer()
      : await pipeline.avif({ quality: 72, effort: 7 }).toBuffer();
    writeFileSync(variant.path, output);
  }
  writeFileSync(metadataPath, `${JSON.stringify({
    masterSha256: sha256(result.original),
    transparentSha256: sha256(result.png),
    width: result.width,
    height: result.height,
    removedPixels: result.removedPixels,
    removedRatio: Number((result.removedPixels / result.totalPixels).toFixed(4)),
    protectionPx: 32,
  }, null, 2)}\n`);
  await validateExisting();
}

if (process.argv.includes('--check')) await validateExisting();
else await build();
