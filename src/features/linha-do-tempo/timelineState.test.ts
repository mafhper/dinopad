import { describe, expect, it } from 'vitest';
import { agruparMarcas, DEFAULT_TIMELINE_VIEW, encodeTimelineView, intervaloComMargem, parseTimelineSearch, tempoParaPosicao } from './timelineState';

describe('estado da linha do tempo', () => {
  it('converte tempo em posição com limites proporcionais', () => {
    expect(tempoParaPosicao(252, 252, 66, 1000)).toBe(0);
    expect(tempoParaPosicao(66, 252, 66, 1000)).toBe(1000);
    expect(tempoParaPosicao(159, 252, 66, 1000)).toBeCloseTo(500);
    expect(() => tempoParaPosicao(100, 66, 252, 100)).toThrow();
  });

  it('codifica, restaura e rejeita URLs inválidas', () => {
    const source = { inicioMa: 71, fimMa: 63, camada: 'organismo' as const, item: 'tyrannosaurus-rex', filtro: 'fauna' as const };
    const params = new URLSearchParams(encodeTimelineView(source));
    expect(parseTimelineSearch(params)).toEqual({ view: source, valid: true });
    expect(parseTimelineSearch(new URLSearchParams('inicioMa=10&fimMa=20&camada=vida'))).toEqual({ view: DEFAULT_TIMELINE_VIEW, valid: false });
    expect(parseTimelineSearch(new URLSearchParams('inicioMa=71&fimMa=63&camada=periodo&filtro=fungos'))).toEqual({ view: DEFAULT_TIMELINE_VIEW, valid: false });
  });

  it('representa incerteza com margem e agrupa marcas próximas', () => {
    expect(intervaloComMargem(68, 66, 1)).toEqual([70, 64]);
    expect(agruparMarcas([{ id: 'a', y: 10 }, { id: 'b', y: 30 }, { id: 'c', y: 90 }], 25).map((grupo) => grupo.map(({ id }) => id))).toEqual([['a', 'b'], ['c']]);
  });
});
