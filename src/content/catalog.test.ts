import { describe, expect, it } from 'vitest';
import { CatalogoSchema } from './schema';
import { catalogo, indicesConteudo } from './catalog.generated';

describe('catálogo editorial', () => {
  it('mantém a cobertura aprovada', () => {
    expect(() => CatalogoSchema.parse(catalogo)).not.toThrow();
    expect(catalogo.organismos).toHaveLength(72);
    expect(catalogo.organismos.filter(({ reino }) => reino === 'animalia')).toHaveLength(62);
    expect(catalogo.organismos.filter(({ reino }) => reino === 'plantae')).toHaveLength(10);
    expect(catalogo.media.length).toBeGreaterThanOrEqual(216);
    expect(catalogo.especimes).toHaveLength(18);
    expect(catalogo.dossies).toHaveLength(8);
    expect(catalogo.publicacoes).toHaveLength(12);
    expect(catalogo.marcos).toHaveLength(25);
    expect(catalogo.marcos.filter(({ id }) => id === 'extincao-k-pg')).toHaveLength(1);
  });

  it('garante tríade visual e arquivos locais por ficha', () => {
    const mediaPorId = new Map(catalogo.media.map((media) => [media.id, media]));
    for (const organismo of catalogo.organismos) {
      const midias = organismo.mediaIds.map((id) => mediaPorId.get(id)!);
      const papeis = new Set(midias.map(({ papel }) => papel));
      expect(papeis.has('evidencia'), organismo.id).toBe(true);
      expect(papeis.has('interpretacao'), organismo.id).toBe(true);
      expect(['escala', 'mapa', 'habitat', 'morfologia'].some((papel) => papeis.has(papel as typeof midias[number]['papel'])), organismo.id).toBe(true);
      expect(midias.every(({ arquivos }) => arquivos.src.startsWith('/media/'))).toBe(true);
      expect(midias.every(({ altPt, legendaPt }) => altPt.length > 1 && legendaPt.length > 1)).toBe(true);
    }
  });

  it('não publica licença desconhecida nem URL de mídia remota', () => {
    const permitidas = new Set(['CC0', 'PDM', 'CC-BY-2.0', 'CC-BY-3.0', 'CC-BY-4.0', 'CC-BY-SA-2.0', 'CC-BY-SA-3.0', 'CC-BY-SA-4.0', 'MIT']);
    for (const media of catalogo.media) {
      expect(permitidas.has(media.licenca)).toBe(true);
      expect(media.arquivos.src).not.toMatch(/^https?:/);
      expect(media.arquivos.srcSet ?? '').not.toMatch(/^https?:/);
      expect(media.arquivos.avifSrcSet ?? '').not.toMatch(/^https?:/);
    }
  });

  it('preserva as escolhas taxonômicas revisadas manualmente', () => {
    const mediaPorId = new Map(catalogo.media.map((media) => [media.id, media]));
    expect(catalogo.organismos.find(({ id }) => id === 'dimetrodon')?.nomeCientifico).toBe('Dimetrodon');
    expect(mediaPorId.get('smilodon-populator-evidencia')?.urlFonte).toContain('Smilodon_populator');
    expect(mediaPorId.get('smilodon-populator-interpretacao')?.urlFonte).toContain('Smilodon_populator');
    expect(mediaPorId.get('irritator-evidencia')?.urlFonte).toContain('Holotype_of_Irritator_challengeri');
  });

  it('gera índices estáticos somente para fichas aprovadas', () => {
    const ids = new Set(catalogo.organismos.map(({ id }) => id));
    expect(indicesConteudo.busca).toHaveLength(72);
    expect(indicesConteudo.comparacao).toHaveLength(72);
    expect(indicesConteudo.timeline.organismoIds).toHaveLength(72);
    expect(indicesConteudo.timeline.marcoIds).toHaveLength(25);
    expect(indicesConteudo.busca.every(({ id }) => ids.has(id))).toBe(true);
  });

  it('liga campos estruturados a fontes que realmente os sustentam', () => {
    const fontes = new Map(catalogo.fontes.map((fonte) => [fonte.id, fonte]));
    const sustenta = (ids: string[], campo: 'taxonomia' | 'intervalo' | 'ocorrencias' | 'energia' | 'dimensoes') =>
      ids.some((id) => fontes.get(id)?.camposSustentados.includes(campo));

    for (const organismo of catalogo.organismos) {
      expect(sustenta(organismo.fonteIds, 'taxonomia'), organismo.id).toBe(true);
      expect(sustenta(organismo.fonteIds, 'ocorrencias'), organismo.id).toBe(true);
      expect(sustenta(organismo.intervalo.fonteIds, 'intervalo'), organismo.id).toBe(true);
      expect(sustenta(organismo.energia.fonteIds, 'energia'), organismo.id).toBe(true);
      expect(sustenta(organismo.medidas.fonteIds, 'dimensoes'), organismo.id).toBe(true);
    }
  });

  it('forma uma árvore única, sem ciclos nem folhas órfãs', () => {
    const nos = new Map(catalogo.nosFilogeneticos.map((no) => [no.id, no]));
    const raizes = catalogo.nosFilogeneticos.filter(({ paiId }) => paiId === null);
    expect(raizes.map(({ id }) => id)).toEqual(['eukaryota']);

    for (const no of catalogo.nosFilogeneticos) {
      if (no.paiId) expect(nos.has(no.paiId), no.id).toBe(true);
      const visitados = new Set<string>();
      let atual = no;
      while (atual.paiId) {
        expect(visitados.has(atual.id), `ciclo em ${no.id}`).toBe(false);
        visitados.add(atual.id);
        atual = nos.get(atual.paiId)!;
      }
      expect(atual.id).toBe('eukaryota');
    }

    for (const organismo of catalogo.organismos) {
      expect(nos.has(organismo.noFilogeneticoId), organismo.id).toBe(true);
      const caminho = indicesConteudo.filogenia.folhas.find(({ organismoId }) => organismoId === organismo.id)?.caminhoRaiz;
      expect(caminho?.[0], organismo.id).toBe('eukaryota');
      expect(caminho?.at(-1), organismo.id).toBe(organismo.id);
    }
  });
});
