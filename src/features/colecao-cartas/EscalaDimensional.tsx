import type { CSSProperties } from 'react';
import { formatarFaixa } from '../../content/format';
import type { OrganismoAtlas } from '../../content/types';

interface EscalaDimensionalProps {
  organismo: OrganismoAtlas;
}

const tiposLineares = new Set(['comprimento', 'altura', 'envergadura', 'diametro', 'folha', 'cone', 'flor', 'caule', 'estrutura']);
const referenciaHumanaMetros = 1.7;

function emMetros(valor: number, unidade: string) {
  if (unidade === 'mm') return valor / 1000;
  if (unidade === 'cm') return valor / 100;
  return valor;
}

function dominioDaRegua(valorMetros: number) {
  const opcoes = [2, 5, 10, 15, 20, 30, 50, 75, 100];
  return opcoes.find((opcao) => opcao >= valorMetros) ?? Math.ceil(valorMetros / 25) * 25;
}

function formatarMetros(valor: number) {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} m`;
}

export function EscalaDimensional({ organismo }: EscalaDimensionalProps) {
  const medida = organismo.medidas.itens.find(({ tipo }) => tipo === 'envergadura')
    ?? organismo.medidas.itens.find(({ tipo }) => tipo === 'comprimento')
    ?? organismo.medidas.itens.find(({ tipo }) => tiposLineares.has(tipo))
    ?? organismo.medidas.itens[0];
  const medidaMaximaMetros = emMetros(medida.max, medida.unidade);
  const dominio = dominioDaRegua(medidaMaximaMetros);
  const percentualDaMedida = Math.max(4, Math.min(100, (medidaMaximaMetros / dominio) * 100));
  const percentualHumano = Math.max(0, Math.min(100, (referenciaHumanaMetros / dominio) * 100));
  const marcas = Array.from({ length: 6 }, (_, indice) => (dominio / 5) * indice);
  const style = {
    '--escala-extensao': `${percentualDaMedida}%`,
    '--escala-referencia-humana': `${percentualHumano}%`,
  } as CSSProperties;
  const medidaFormatada = formatarFaixa(medida.min, medida.max, medida.unidade);

  return (
    <section
      aria-label={`${medida.rotuloPt}: até ${medidaFormatada}. Régua de zero a ${formatarMetros(dominio)}.`}
      className="dimension-scale"
      style={style}
    >
      <header className="dimension-scale-header">
        <div>
          <p>Escala dimensional</p>
          <strong>{medida.rotuloPt}</strong>
        </div>
        <span>até {medidaFormatada}</span>
      </header>
      <div className="dimension-scale-ruler" aria-hidden="true">
        <span className="dimension-scale-extent"><i /></span>
        <span className="dimension-scale-human"><i /></span>
        <div className="dimension-scale-axis">
          {marcas.map((marca, indice) => (
            <span key={marca} style={{ left: `${(indice / (marcas.length - 1)) * 100}%` }}>
              <i />
              <b>{formatarMetros(marca)}</b>
            </span>
          ))}
        </div>
      </div>
      <p className="dimension-scale-note">
        <strong>Referência humana: 1,7 m.</strong> A barra mostra uma extensão medida; não representa a forma do organismo.
      </p>
    </section>
  );
}
