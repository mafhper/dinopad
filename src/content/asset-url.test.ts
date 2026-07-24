import { describe, expect, it } from 'vitest';
import { resolverAssetLocal, resolverSrcSetLocal } from './asset-url';

describe('caminhos de mídia no GitHub Pages', () => {
  it('aplica o BASE_URL ao caminho absoluto editorial', () => {
    expect(resolverAssetLocal(
      '/media/organismos/tyrannosaurus-rex/evidencia-960.webp',
      '/dinopad/',
    ))
      .toBe('/dinopad/media/organismos/tyrannosaurus-rex/evidencia-960.webp');
  });

  it('aplica o BASE_URL a cada candidato do srcSet', () => {
    expect(resolverSrcSetLocal(
      '/media/a-480.webp 480w, /media/a-960.webp 960w',
      '/dinopad/',
    ))
      .toBe('/dinopad/media/a-480.webp 480w, /dinopad/media/a-960.webp 960w');
  });

  it('preserva URLs externas quando necessário', () => {
    expect(resolverAssetLocal('https://example.test/image.webp')).toBe('https://example.test/image.webp');
  });
});
