import type { OrganismoAtlas } from '../../content/types';

export function calcularDominioComparacao(
  primeiro: Pick<OrganismoAtlas, 'intervalo'>,
  segundo: Pick<OrganismoAtlas, 'intervalo'>,
) {
  const inicioBruto = Math.max(primeiro.intervalo.inicioMa, segundo.intervalo.inicioMa);
  const fimBruto = Math.min(primeiro.intervalo.fimMa, segundo.intervalo.fimMa);
  const amplitude = Math.max(1, inicioBruto - fimBruto);
  const margem = Math.max(1, amplitude * 0.08);
  return { inicioMa: inicioBruto + margem, fimMa: Math.max(0, fimBruto - margem) };
}
