import { useMemo } from 'react';
import { catalogo, indicesConteudo } from '../content/catalog.generated';
import { resolverMediaAsset } from '../content/asset-url';
import type { MediaAsset } from '../content/types';

const mediaResolvida = catalogo.media.map(resolverMediaAsset);
const mediaResolvidaPorId = new Map(mediaResolvida.map((item) => [item.id, item]));

export function useAtlas() {
  return useMemo(() => ({
    ...catalogo,
    media: mediaResolvida,
    indicesConteudo,
    organismosPorId: new Map(catalogo.organismos.map((item) => [item.id, item])),
    periodosPorId: new Map(catalogo.periodos.map((item) => [item.id, item])),
    nosFilogeneticosPorId: new Map(catalogo.nosFilogeneticos.map((item) => [item.id, item])),
    fontesPorId: new Map(catalogo.fontes.map((item) => [item.id, item])),
    mediaPorId: mediaResolvidaPorId,
    especimesPorId: new Map(catalogo.especimes.map((item) => [item.id, item])),
  }), []);
}

export function useOrganismoPorId(id: string | null) {
  return useMemo(() => catalogo.organismos.find((item) => item.id === id), [id]);
}

export function getMediaById(id: string): MediaAsset | undefined {
  return mediaResolvidaPorId.get(id);
}

export function getMediaByOrganismoId(organismoId: string): MediaAsset[] {
  return mediaResolvida.filter((item) => item.entidade.tipo === 'organismo' && item.entidade.id === organismoId);
}
