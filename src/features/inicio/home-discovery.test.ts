import { describe, expect, it } from 'vitest';
import { rotateFromSeed, selectDailyItem, selectDailyReadings } from './home-discovery';

const items = [
  { id: 'delta' },
  { id: 'alpha' },
  { id: 'charlie' },
  { id: 'bravo' },
];

describe('descoberta dinâmica da home', () => {
  it('mantém a estante diária estável para a mesma data', () => {
    const date = new Date('2026-07-24T12:00:00-03:00');
    expect(selectDailyReadings(items, new Set(), date)).toEqual(selectDailyReadings(items, new Set(), date));
  });

  it('retira leituras concluídas sem deixar buracos na seleção', () => {
    const date = new Date('2026-07-24T12:00:00-03:00');
    const original = selectDailyReadings(items, new Set(), date);
    const next = selectDailyReadings(items, new Set([original[0].id]), date);
    expect(next).toHaveLength(3);
    expect(next.map(({ id }) => id)).not.toContain(original[0].id);
    expect(next.slice(0, 2)).toEqual(original.slice(1));
  });

  it('limita a seleção e mantém um destaque diário determinístico', () => {
    expect(rotateFromSeed(items, 'visita-1', 2)).toHaveLength(2);
    expect(selectDailyItem(items, 'especime', new Date('2026-07-24T12:00:00-03:00')))
      .toEqual(selectDailyItem(items, 'especime', new Date('2026-07-24T18:00:00-03:00')));
  });
});
