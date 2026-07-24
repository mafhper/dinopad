import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dataDir } from './io';

const read = <T>(name: string) => JSON.parse(readFileSync(resolve(dataDir, name), 'utf8')) as T;
const write = (name: string, value: unknown) => writeFileSync(resolve(dataDir, name), `${JSON.stringify(value, null, 2)}\n`);

type LegacyOrganism = Record<string, unknown> & {
  categoria?: string;
  categoriaIds?: string[];
  energia: {
    valor?: string;
    modoPrincipal?: string;
    modosSecundarios?: string[];
    incerteza: string;
    fonteIds: string[];
  };
};

type LegacyMedia = Record<string, unknown> & {
  organismoId?: string;
  entidade?: { tipo: string; id: string };
};

const organisms = read<LegacyOrganism[]>('organismos.json').map((organism) => {
  const { categoria, ...withoutCategory } = organism;
  const { valor, ...withoutLegacyEnergy } = organism.energia;
  return {
    ...withoutCategory,
    categoriaIds: organism.categoriaIds ?? (categoria ? [categoria] : []),
    energia: {
      ...withoutLegacyEnergy,
      modoPrincipal: organism.energia.modoPrincipal ?? valor,
      modosSecundarios: organism.energia.modosSecundarios ?? [],
    },
  };
});

const media = read<LegacyMedia[]>('media.json').map((asset) => {
  const { organismoId, ...withoutLegacyOwner } = asset;
  return {
    ...withoutLegacyOwner,
    entidade: asset.entidade ?? { tipo: 'organismo', id: organismoId },
  };
});

write('organismos.json', organisms);
write('media.json', media);
console.log(`Modelo migrado: ${organisms.length} organismos e ${media.length} mídias.`);
