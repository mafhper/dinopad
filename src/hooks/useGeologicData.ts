import { useMemo } from 'react';
import type { MarcoTemporal, Periodo } from '../content/types';
import { catalogo } from '../content/catalog.generated';

export function useGeologicData() {
  const erasPrincipais = useMemo(() => {
    // Retornar apenas as eras principais (não as éons)
    return catalogo.eras.filter(era =>
      ['paleozoico', 'mesozoico', 'cenozoico'].includes(era.id)
    );
  }, []);

  const periodosPorEra = useMemo(() => {
    const map: Record<string, Periodo[]> = {};
    for (const periodo of catalogo.periodos) {
      if (!map[periodo.eraId]) {
        map[periodo.eraId] = [];
      }
      map[periodo.eraId].push(periodo);
    }
    // Ordenar por início (mais antigo primeiro)
    for (const eraId of Object.keys(map)) {
      map[eraId].sort((a, b) => b.inicioMa - a.inicioMa);
    }
    return map;
  }, []);

  const todosPeriodos = useMemo(() => {
    return [...catalogo.periodos].sort((a, b) => b.inicioMa - a.inicioMa);
  }, []);

  const marcosPorPeriodo = useMemo(() => {
    const map: Record<string, MarcoTemporal[]> = {};
    for (const marco of catalogo.marcos) {
      if (marco.periodoId) {
        if (!map[marco.periodoId]) {
          map[marco.periodoId] = [];
        }
        map[marco.periodoId].push(marco);
      }
    }
    return map;
  }, []);

  return {
    eras: erasPrincipais,
    periodos: todosPeriodos,
    periodosPorEra,
    marcosEvolutivos: catalogo.marcos,
    marcosPorPeriodo,
  };
}
