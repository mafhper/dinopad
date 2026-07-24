import { catalogo } from './catalog.generated';
import { resolverMediaAsset } from './asset-url';
import type { MediaAsset } from './types';

export const mediaAssets = catalogo.media.map(resolverMediaAsset);
export const scientificSources = catalogo.fontes;

export function getMediaById(id: string): MediaAsset | undefined {
  return mediaAssets.find((asset) => asset.id === id);
}

export function getMediaByDinoId(organismoId: string): MediaAsset[] {
  return mediaAssets.filter((asset) => asset.entidade.tipo === 'organismo' && asset.entidade.id === organismoId);
}

export function getAttributionText(asset: MediaAsset): string {
  return `“${asset.titulo}” por ${asset.autor} (${asset.fonte}) — ${asset.licenca}`;
}
