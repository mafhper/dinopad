import type { MediaAsset } from './schema';

function normalizarBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function resolverAssetLocal(
  caminho: string,
  baseUrl = import.meta.env.BASE_URL,
): string {
  if (/^(?:https?:|data:|blob:)/i.test(caminho)) return caminho;
  return `${normalizarBaseUrl(baseUrl)}${caminho.replace(/^\/+/, '')}`;
}

export function resolverSrcSetLocal(
  srcSet: string | undefined,
  baseUrl = import.meta.env.BASE_URL,
): string | undefined {
  if (!srcSet) return undefined;
  return srcSet
    .split(',')
    .map((entrada) => {
      const [caminho, ...descritores] = entrada.trim().split(/\s+/);
      return [resolverAssetLocal(caminho, baseUrl), ...descritores].join(' ');
    })
    .join(', ');
}

export function resolverMediaAsset(asset: MediaAsset): MediaAsset {
  return {
    ...asset,
    arquivos: {
      src: resolverAssetLocal(asset.arquivos.src),
      srcSet: resolverSrcSetLocal(asset.arquivos.srcSet),
      avifSrcSet: resolverSrcSetLocal(asset.arquivos.avifSrcSet),
      miniaturaSrcSet: resolverSrcSetLocal(asset.arquivos.miniaturaSrcSet),
    },
  };
}
