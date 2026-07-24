import { IconeFechar, IconeFiltro } from '../../components/Icons';
import type { Energia, Periodo } from '../../content/types';

interface FiltrosColecaoProps {
  periodos: Periodo[];
  periodoSelecionado: string | null;
  energiaSelecionada: Energia | null;
  colecaoSelecionada: string | null;
  onPeriodoChange: (periodoId: string | null) => void;
  onEnergiaChange: (energia: Energia | null) => void;
  onColecaoChange: (colecao: string | null) => void;
  onLimpar: () => void;
  aberto: boolean;
  onFechar: () => void;
}

const opcoesEnergia: { valor: Energia; label: string }[] = [
  { valor: 'carnivoria', label: 'Carnivoria' },
  { valor: 'herbivoria', label: 'Herbivoria' },
  { valor: 'onivoria', label: 'Onivoria' },
  { valor: 'fotossintese', label: 'Fotossíntese' },
  { valor: 'frugivoria', label: 'Frugivoria' },
  { valor: 'folivoria', label: 'Folivoria' },
  { valor: 'insetivoria', label: 'Insetivoria' },
  { valor: 'desconhecida', label: 'Não determinada' },
];

export function FiltrosColecao({
  periodos,
  periodoSelecionado,
  energiaSelecionada,
  colecaoSelecionada,
  onPeriodoChange,
  onEnergiaChange,
  onColecaoChange,
  onLimpar,
  aberto,
  onFechar,
}: FiltrosColecaoProps) {
  if (!aberto) return null;

  const periodosComEspecies = periodos;

  return (
    <>
      <button aria-label="Fechar filtros" className="filter-overlay" onClick={onFechar} type="button" />

      <section aria-label="Filtros do atlas" aria-modal="true" className="filter-sheet" role="dialog">
        <header className="filter-sheet-header">
          <div className="filter-sheet-title">
            <IconeFiltro size={18} />
            <span>Filtrar fichas</span>
          </div>
          <button aria-label="Fechar filtros" className="icon-button" onClick={onFechar} type="button">
            <IconeFechar size={20} />
          </button>
        </header>

        <div className="filter-groups">
          <div className="filter-group">
            <h3>Coleção</h3>
            <div className="filter-options">
              {[{ valor: null, label: 'Todas' }, { valor: 'fauna', label: 'Fauna' }, { valor: 'flora', label: 'Flora' }, { valor: 'humanidade', label: 'Humanidade' }, { valor: 'brasil', label: 'Brasil' }, { valor: 'nao-dinossauro', label: 'Não é dinossauro' }].map((opcao) => (
                <button className={`filter-option${colecaoSelecionada === opcao.valor ? ' is-selected' : ''}`} key={opcao.label} onClick={() => onColecaoChange(opcao.valor)} type="button">{opcao.label}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <h3>Período</h3>
            <div className="filter-options">
              <button
                className={`filter-option${periodoSelecionado === null ? ' is-selected' : ''}`}
                onClick={() => onPeriodoChange(null)}
                type="button"
              >
                Todos
              </button>
              {periodosComEspecies.map((periodo) => (
                <button
                  className={`filter-option${periodoSelecionado === periodo.id ? ' is-selected' : ''}`}
                  key={periodo.id}
                  onClick={() => onPeriodoChange(periodo.id)}
                  type="button"
                >
                  {periodo.nomePt}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Fonte de energia</h3>
            <div className="filter-options">
              <button
                className={`filter-option${energiaSelecionada === null ? ' is-selected' : ''}`}
                onClick={() => onEnergiaChange(null)}
                type="button"
              >
                Todas
              </button>
              {opcoesEnergia.map((opcao) => (
                <button
                  className={`filter-option${energiaSelecionada === opcao.valor ? ' is-selected' : ''}`}
                  key={opcao.valor}
                  onClick={() => onEnergiaChange(opcao.valor)}
                  type="button"
                >
                  {opcao.label}
                </button>
              ))}
            </div>
          </div>

          {(periodoSelecionado || energiaSelecionada || colecaoSelecionada) && (
            <button className="clear-filters" onClick={onLimpar} type="button">
              Limpar todos os filtros
            </button>
          )}
        </div>
      </section>
    </>
  );
}
