import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

function listFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const fullPath = resolve(directory, name);
    return statSync(fullPath).isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

const files = listFiles(dist)
  .filter((file) => !['sw.js', 'precache-manifest.js'].includes(relative(dist, file).split(sep).join('/')))
  .sort((left, right) => left.localeCompare(right));

const urls = [
  './',
  ...files
    .map((file) => relative(dist, file).split(sep).join('/'))
    .map((file) => `./${file}`),
];

const digest = createHash('sha256');
for (const file of files) {
  digest.update(relative(dist, file).split(sep).join('/'));
  digest.update(readFileSync(file));
}
const cacheVersion = digest.digest('hex').slice(0, 16);

writeFileSync(
  resolve(dist, 'precache-manifest.js'),
  `self.DINOPAD_CACHE_VERSION = '${cacheVersion}';\nself.DINOPAD_PRECACHE = ${JSON.stringify(urls)};\n`,
  'utf8',
);

const serviceWorkerPath = resolve(dist, 'sw.js');
const serviceWorker = readFileSync(serviceWorkerPath, 'utf8');
if (!serviceWorker.includes('__DINOPAD_CACHE_VERSION__')) {
  throw new Error('O service worker não contém o marcador obrigatório de versão do cache.');
}
writeFileSync(serviceWorkerPath, serviceWorker.replaceAll('__DINOPAD_CACHE_VERSION__', cacheVersion), 'utf8');

console.log(`Manifesto offline ${cacheVersion} gerado com ${urls.length} recursos.`);
