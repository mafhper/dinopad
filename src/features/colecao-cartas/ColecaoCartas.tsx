import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconeFiltro } from '../../components/Icons';
import { formatarEnergia, nomeColecao } from '../../content/format';
import type { Energia, OrganismoAtlas } from '../../content/types';
import { useAtlas } from '../../hooks/useAtlas';
import { CartaOrganismo } from './CartaOrganismo';
import { OrganismoDetalhe } from './OrganismoDetalhe';
import { FiltrosColecao } from './FiltrosColecao';

export default function ColecaoCartas() {
  const { organismos, periodosPorId, periodos } = useAtlas();
  const [searchParams, setSearchParams] = useSearchParams();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string | null>(null);
  const [energiaSelecionada, setEnergiaSelecionada] = useState<Energia | null>(null);
  const [colecaoSelecionada, setColecaoSelecionada] = useState<string | null>(() => searchParams.get('colecao'));
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const organismoSelecionadoId = searchParams.get('item') ?? searchParams.get('dino');

  const organismosFiltrados = useMemo(
    () => organismos.filter((organismo) => {
      if (periodoSelecionado && !organismo.periodoIds.includes(periodoSelecionado)) return false;
      if (energiaSelecionada && organismo.energia.modoPrincipal !== energiaSelecionada) return false;
      if (colecaoSelecionada === 'fauna' && organismo.reino !== 'animalia') return false;
      if (colecaoSelecionada === 'flora' && organismo.reino !== 'plantae') return false;
      if (colecaoSelecionada === 'brasil' && !organismo.ocorrencias.some(({ pais }) => pais === 'Brasil')) return false;
      if (colecaoSelecionada === 'humanidade' && !organismo.categoriaIds.some((id) => ['primata', 'hominideo', 'homininio'].includes(id))) return false;
      if (colecaoSelecionada === 'nao-dinossauro' && organismo.categoriaIds.some((id) => ['dinossauro', 'ave-primitiva'].includes(id))) return false;
      return true;
    }),
    [colecaoSelecionada, energiaSelecionada, organismos, periodoSelecionado],
  );

  const handleLimparFiltros = () => {
    setPeriodoSelecionado(null);
    setEnergiaSelecionada(null);
    setColecaoSelecionada(null);
  };
  const handleSelecionarCarta = (organismo: OrganismoAtlas) => setSearchParams({ item: organismo.id });
  const temFiltros = Boolean(periodoSelecionado || energiaSelecionada || colecaoSelecionada);

  if (organismoSelecionadoId) {
    return <OrganismoDetalhe key={organismoSelecionadoId} organismoId={organismoSelecionadoId} onVoltar={() => setSearchParams({})} />;
  }

  return (
    <div className="atlas-page">
      <header className="atlas-header">
        <p className="eyebrow">Coleção científica ilustrada</p>
        <div className="atlas-title-row">
          <div>
            <h1>Atlas</h1>
            <p className="atlas-subtitle">Organismos revisados, com fauna, flora, foco no Mesozoico e presença brasileira.</p>
          </div>
          <button aria-expanded={filtrosAbertos} className={`filter-trigger${temFiltros ? ' is-filtered' : ''}`} onClick={() => setFiltrosAbertos(true)} type="button">
            <IconeFiltro size={17} /><span>{temFiltros ? 'Filtrado' : 'Filtrar'}</span>
          </button>
        </div>
        {temFiltros && <div className="active-filter-row" aria-live="polite">
          <span className="filter-pill">{organismosFiltrados.length} {organismosFiltrados.length === 1 ? 'resultado' : 'resultados'}</span>
          {periodoSelecionado && <span className="filter-pill">{periodosPorId.get(periodoSelecionado)?.nomePt}</span>}
          {energiaSelecionada && <span className="filter-pill">{formatarEnergia(energiaSelecionada)}</span>}
          {colecaoSelecionada && <span className="filter-pill">{nomeColecao(colecaoSelecionada)}</span>}
        </div>}
      </header>
      {organismosFiltrados.length > 0 ? (
        <div className="atlas-grid">
          {organismosFiltrados.map((organismo) => (
            <CartaOrganismo organismo={organismo} key={organismo.id} onSelect={handleSelecionarCarta} periodoNome={periodosPorId.get(organismo.periodoIds[0])?.nomePt} />
          ))}
        </div>
      ) : (
        <div className="atlas-empty"><h2>Nenhuma ficha combina com esses filtros.</h2><p>Tente abrir outra coleção ou período.</p><button className="button button-primary" onClick={handleLimparFiltros} type="button">Limpar filtros</button></div>
      )}
      <FiltrosColecao aberto={filtrosAbertos} colecaoSelecionada={colecaoSelecionada} energiaSelecionada={energiaSelecionada} onColecaoChange={setColecaoSelecionada} onEnergiaChange={setEnergiaSelecionada} onFechar={() => setFiltrosAbertos(false)} onLimpar={handleLimparFiltros} onPeriodoChange={setPeriodoSelecionado} periodoSelecionado={periodoSelecionado} periodos={periodos.filter((periodo) => organismos.some(({ periodoIds }) => periodoIds.includes(periodo.id)))} />
    </div>
  );
}
