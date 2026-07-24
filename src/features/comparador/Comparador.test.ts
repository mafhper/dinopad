import { describe, expect, it } from 'vitest';
import { catalogo } from '../../content/catalog.generated';
import { calcularDominioComparacao } from './time-domain';

describe('comparação temporal', () => {
  it('calcula o domínio a partir dos organismos, inclusive antes do Mesozoico', () => {
    const dimetrodon = catalogo.organismos.find(({ id }) => id === 'dimetrodon')!;
    const tiranossauro = catalogo.organismos.find(({ id }) => id === 'tyrannosaurus-rex')!;
    const dominio = calcularDominioComparacao(dimetrodon, tiranossauro);
    expect(dominio.inicioMa).toBeGreaterThan(295);
    expect(dominio.fimMa).toBeLessThan(66);
  });

  it('mantém uma margem legível quando os intervalos são muito próximos', () => {
    const tiranossauro = catalogo.organismos.find(({ id }) => id === 'tyrannosaurus-rex')!;
    const triceratops = catalogo.organismos.find(({ id }) => id === 'triceratops')!;
    expect(calcularDominioComparacao(tiranossauro, triceratops)).toEqual({ inicioMa: 69, fimMa: 65 });
  });
});
