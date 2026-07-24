import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CatalogoSchema, type Catalogo } from '../../src/content/schema';

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
export const dataDir = resolve(repoRoot, 'src/content/data');

function readJson(fileName: string): unknown {
  return JSON.parse(readFileSync(resolve(dataDir, fileName), 'utf8'));
}

export function loadCatalogRaw(): unknown {
  return {
    versaoEscalaGeologica: 'ICS 2026/06',
    eras: readJson('eras.json'),
    periodos: readJson('periodos.json'),
    categorias: readJson('categorias.json'),
    nosFilogeneticos: readJson('filogenia.json'),
    fontes: readJson('fontes.json'),
    organismos: readJson('organismos.json'),
    media: readJson('media.json'),
    especimes: readJson('especimes.json'),
    marcos: readJson('marcos.json'),
    linhagens: readJson('linhagens.json'),
    conexoesEvolutivas: readJson('conexoes-evolutivas.json'),
    dossies: readJson('dossies.json'),
    publicacoes: readJson('publicacoes.json'),
  };
}

export function loadCatalog(): Catalogo {
  return CatalogoSchema.parse(loadCatalogRaw());
}

export function publicAssetExists(src: string): boolean {
  const cleanPath = src.split(/[?#]/, 1)[0].replace(/^\//, '');
  return existsSync(resolve(repoRoot, 'public', cleanPath));
}
