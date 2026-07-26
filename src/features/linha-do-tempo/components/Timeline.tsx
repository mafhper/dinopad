import { motion, useReducedMotion } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { IconeFechar, IconeSeta, IconeVoltar } from '../../../components/Icons';
import type { OrganismoAtlas, Periodo } from '../../../content/types';
import { useAtlas } from '../../../hooks/useAtlas';
import { agruparMarcas, DEFAULT_TIMELINE_VIEW, DOMINIOS, encodeTimelineView, intervaloComMargem, parseTimelineSearch, type CamadaTempo, type FiltroTempo, type TimelineView } from '../timelineState';

const CHART_HEIGHT = 1360;
const CHART_WIDTH = 760;
const LAYERS: CamadaTempo[] = ['vida', 'fanerozoico', 'mesozoico', 'periodo', 'organismo'];
const nomesCamada: Record<CamadaTempo, string> = { vida: 'História da vida', fanerozoico: 'Fanerozoico', mesozoico: 'Mesozoico', periodo: 'Período', organismo: 'Organismo' };
const filtros: { id: FiltroTempo; label: string }[] = [{ id: 'todos', label: 'Todos' }, { id: 'fauna', label: 'Fauna' }, { id: 'flora', label: 'Flora' }, { id: 'marcos', label: 'Marcos' }];

function sobrepoe(inicioA: number, fimA: number, inicioB: number, fimB: number) {
  return inicioA >= fimB && fimA <= inicioB;
}

function mediaPicture(media: ReturnType<typeof useAtlas>['mediaPorId'] extends Map<string, infer T> ? T : never, prioridade = false) {
  return <picture>{media.arquivos.avifSrcSet && <source srcSet={media.arquivos.avifSrcSet} type="image/avif" />}<img alt={media.altPt} loading={prioridade ? 'eager' : 'lazy'} src={media.arquivos.src} srcSet={media.arquivos.srcSet} /></picture>;
}

export function Timeline() {
  const { organismos, periodos, marcos, mediaPorId, fontesPorId, especimesPorId } = useAtlas();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = useMemo(() => parseTimelineSearch(searchParams), [searchParams]);
  const view = parsed.view;
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = view.item ? organismos.find(({ id }) => id === view.item) : undefined;

  const setView = useCallback((next: TimelineView, replace = false) => setSearchParams(encodeTimelineView(next), { replace }), [setSearchParams]);
  useEffect(() => { if (!parsed.valid || (view.item && !selected)) setSearchParams(encodeTimelineView(DEFAULT_TIMELINE_VIEW), { replace: true }); }, [parsed.valid, selected, setSearchParams, view.item]);

  const scale = useMemo(() => scaleLinear().domain([view.inicioMa, view.fimMa]).range([70, CHART_HEIGHT - 70]), [view.fimMa, view.inicioMa]);
  const periodosVisiveis = periodos.filter((periodo) => sobrepoe(periodo.inicioMa, periodo.fimMa, view.inicioMa, view.fimMa));
  const marcosVisiveis = marcos.filter((marco) => marco.dataMa <= view.inicioMa && marco.dataMa >= view.fimMa && ['todos', 'marcos'].includes(view.filtro));
  const organismosVisiveis = organismos.filter((organismo) => sobrepoe(organismo.intervalo.inicioMa, organismo.intervalo.fimMa, view.inicioMa, view.fimMa)
    && view.filtro !== 'marcos'
    && (view.filtro === 'todos' || (view.filtro === 'fauna' ? organismo.reino === 'animalia' : organismo.reino === 'plantae')));
  const grupos = useMemo(() => agruparMarcas(organismosVisiveis.map((organismo) => ({ id: organismo.id, y: scale((organismo.intervalo.inicioMa + organismo.intervalo.fimMa) / 2), organismo })), view.camada === 'periodo' || view.camada === 'organismo' ? 10 : 42), [organismosVisiveis, scale, view.camada]);

  const reset = () => setView(DEFAULT_TIMELINE_VIEW);
  const selecionarFiltro = (filtro: FiltroTempo) => {
    const itemContinuaVisivel = selected && filtro !== 'marcos' && (filtro === 'todos' || (filtro === 'fauna' ? selected.reino === 'animalia' : selected.reino === 'plantae'));
    setView({
      ...view,
      camada: view.camada === 'organismo' && !itemContinuaVisivel ? 'periodo' : view.camada,
      filtro,
      item: itemContinuaVisivel ? selected.id : null,
    });
  };
  const selecionarOrganismo = (organismo: OrganismoAtlas) => { const [inicioMa, fimMa] = intervaloComMargem(organismo.intervalo.inicioMa, organismo.intervalo.fimMa, 1.2); setView({ inicioMa, fimMa, camada: 'organismo', item: organismo.id, filtro: organismo.reino === 'plantae' ? 'flora' : view.filtro === 'flora' ? 'todos' : view.filtro }); };
  const selecionarPeriodo = (periodo: Periodo) => setView({ inicioMa: periodo.inicioMa, fimMa: periodo.fimMa, camada: 'periodo', item: null, filtro: view.filtro });
  const zoom = (direcao: 1 | -1) => {
    const atual = LAYERS.indexOf(view.camada);
    const alvo = Math.max(0, Math.min(LAYERS.length - 1, atual + direcao));
    const camada = LAYERS[alvo];
    if (camada === 'vida' || camada === 'fanerozoico' || camada === 'mesozoico') { const [inicioMa, fimMa] = DOMINIOS[camada]; setView({ inicioMa, fimMa, camada, item: null, filtro: view.filtro }); return; }
    if (camada === 'organismo' && selected) { selecionarOrganismo(selected); return; }
    const centro = (view.inicioMa + view.fimMa) / 2;
    const periodo = periodos.find((item) => centro <= item.inicioMa && centro >= item.fimMa) ?? periodos.find((item) => item.id === 'jurasico');
    if (periodo) selecionarPeriodo(periodo);
  };
  const fecharInspetor = () => { const id = selected?.id; setView({ ...view, item: null, camada: view.camada === 'organismo' ? 'periodo' : view.camada }); requestAnimationFrame(() => document.querySelector<SVGGElement>(`[data-timeline-item="${id}"]`)?.focus()); };
  const ordered = [...organismos].sort((a, b) => b.intervalo.inicioMa - a.intervalo.inicioMa);
  const selectedIndex = selected ? ordered.findIndex(({ id }) => id === selected.id) : -1;
  const moveSelection = (step: number) => { if (selectedIndex < 0) return; const next = ordered[(selectedIndex + step + ordered.length) % ordered.length]; selecionarOrganismo(next); };
  const onKeyboard = (event: React.KeyboardEvent) => {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1); }
    if (event.key === '-') { event.preventDefault(); zoom(-1); }
    if (event.key === 'Home') { event.preventDefault(); reset(); }
    if (event.key === 'ArrowDown' && selected) { event.preventDefault(); moveSelection(1); }
    if (event.key === 'ArrowUp' && selected) { event.preventDefault(); moveSelection(-1); }
  };
  const copiarLink = async () => { await navigator.clipboard?.writeText(window.location.href); };
  const fullScale = scaleLinear().domain([4031, 0]).range([0, 100]);
  const miniTop = fullScale(view.inicioMa);
  const miniHeight = Math.max(1.5, fullScale(view.fimMa) - miniTop);

  return (
    <div className="deep-time-page" onKeyDown={onKeyboard} tabIndex={-1}>
      <header className="timeline-header"><div><p className="eyebrow">Régua científica interativa</p><h1>Tempo profundo</h1><p><strong>{nomesCamada[view.camada]}</strong> · {view.inicioMa.toLocaleString('pt-BR')}–{view.fimMa.toLocaleString('pt-BR')} Ma</p></div><div className="timeline-actions" aria-label="Controles de escala"><button aria-label="Afastar" onClick={() => zoom(-1)} type="button">−</button><button aria-label="Aproximar" onClick={() => zoom(1)} type="button">+</button><button className="timeline-reset" onClick={reset} type="button">Voltar ao Mesozoico</button></div></header>
      <div aria-label="Camadas da linha do tempo" className="timeline-filter-row" role="group">
        {filtros.map(({ id, label }) => <button aria-pressed={view.filtro === id} className={view.filtro === id ? 'is-active' : ''} key={id} onClick={() => selecionarFiltro(id)} type="button">{label}</button>)}
      </div>
      <div className={`timeline-workspace${selected ? ' has-inspector' : ''}`}>
        <div aria-label="Linha do tempo vertical. Role para viajar do passado ao presente." className="timeline-scroll" ref={scrollRef} tabIndex={0}>
          <div className="timeline-summary sr-only" aria-live="polite">Exibindo {nomesCamada[view.camada]}, de {view.inicioMa} a {view.fimMa} milhões de anos, com {organismosVisiveis.length} organismos e {marcosVisiveis.length} marcos.</div>
          <svg aria-labelledby="timeline-svg-title timeline-svg-desc" className="deep-time-svg" role="img" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
            <title id="timeline-svg-title">Linha do tempo da história da vida</title><desc id="timeline-svg-desc">Eixo vertical proporcional. O topo é mais antigo e a base é mais recente.</desc>
            {periodosVisiveis.map((periodo, index) => { const y1 = scale(Math.min(periodo.inicioMa, view.inicioMa)); const y2 = scale(Math.max(periodo.fimMa, view.fimMa)); return <g className="geologic-band" key={periodo.id} onClick={() => selecionarPeriodo(periodo)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') selecionarPeriodo(periodo); }}><rect className={`band-${index % 3}`} height={Math.max(4, y2 - y1)} width="136" x="18" y={y1} /><text x="30" y={y1 + 24}>{periodo.nomePt}</text><text className="band-date" x="30" y={y1 + 44}>{periodo.inicioMa}–{periodo.fimMa} Ma</text></g>; })}
            <line className="timeline-axis-line" x1="188" x2="188" y1="50" y2={CHART_HEIGHT - 50} />
            {scale.ticks(12).filter((tick) => tick <= view.inicioMa && tick >= view.fimMa).map((tick) => <g className="axis-tick" key={tick}><line x1="176" x2="200" y1={scale(tick)} y2={scale(tick)} /><text x="166" y={scale(tick) + 5}>{tick.toLocaleString('pt-BR')} Ma</text></g>)}
            {marcosVisiveis.map((marco, index) => <g className={`event-mark event-${marco.categoria}`} key={marco.id} transform={`translate(206 ${scale(marco.dataMa)})`}><circle r="6" /><line x1="6" x2="22" /><text x="28" y={index % 2 === 0 ? -5 : 15}>{marco.titulo}</text></g>)}
            {grupos.map((grupo, groupIndex) => {
              if (grupo.length > 1 && view.camada !== 'periodo' && view.camada !== 'organismo') { const oldest = Math.max(...grupo.map(({ organismo }) => organismo.intervalo.inicioMa)); const newest = Math.min(...grupo.map(({ organismo }) => organismo.intervalo.fimMa)); return <g className="organism-cluster" key={grupo.map(({ id }) => id).join('-')} onClick={() => setView({ inicioMa: Math.min(view.inicioMa, oldest + 8), fimMa: Math.max(view.fimMa, newest - 8), camada: 'periodo', item: null, filtro: view.filtro })} role="button" tabIndex={0} transform={`translate(${470 + (groupIndex % 2) * 90} ${grupo.reduce((sum, item) => sum + item.y, 0) / grupo.length})`}><circle r="24" /><text textAnchor="middle" y="5">{grupo.length}</text><text className="cluster-label" textAnchor="middle" y="42">organismos</text></g>; }
              return grupo.map(({ organismo }, itemIndex) => { const x = 390 + ((groupIndex + itemIndex) % 3) * 112; const y1 = scale(Math.min(organismo.intervalo.inicioMa, view.inicioMa)); const y2 = scale(Math.max(organismo.intervalo.fimMa, view.fimMa)); const isSelected = selected?.id === organismo.id; const uncertain = organismo.intervalo.incerteza !== 'baixa'; return <g aria-label={`${organismo.nomePt}, registro de ${organismo.intervalo.inicioMa} a ${organismo.intervalo.fimMa} milhões de anos`} className={`organism-range${isSelected ? ' is-selected' : ''}${uncertain ? ' is-uncertain' : ''}`} data-timeline-item={organismo.id} key={organismo.id} onClick={() => selecionarOrganismo(organismo)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') selecionarOrganismo(organismo); }} role="button" tabIndex={0}><line x1={x} x2={x} y1={y1} y2={y2} />{uncertain ? <><path d={`M${x - 7} ${y1 + 7}L${x} ${y1}L${x + 7} ${y1 + 7}`} /><path d={`M${x - 7} ${y2 - 7}L${x} ${y2}L${x + 7} ${y2 - 7}`} /></> : <><circle cx={x} cy={y1} r="5" /><circle cx={x} cy={y2} r="5" /></>}<text x={x + 13} y={(y1 + y2) / 2 - 3}>{organismo.nomePt}</text><text className="organism-date" x={x + 13} y={(y1 + y2) / 2 + 16}>{organismo.intervalo.inicioMa}–{organismo.intervalo.fimMa} Ma</text></g>; });
            })}
          </svg>
        </div>
        <aside aria-label="Minimapa do tempo" className="timeline-minimap"><span>4.031 Ma</span><div><i style={{ height: `${miniHeight}%`, top: `${miniTop}%` }} /></div><span>Hoje</span></aside>
        {selected && <motion.aside animate={{ opacity: 1, x: 0, y: 0 }} aria-label={`Detalhes de ${selected.nomePt}`} className="timeline-inspector" initial={reducedMotion ? false : { opacity: 0, x: 22, y: 18 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}><header><div><p className="eyebrow">{selected.intervalo.inicioMa}–{selected.intervalo.fimMa} Ma</p><h2>{selected.nomePt}</h2><p className="scientific-name">{selected.nomeCientifico}</p></div><button aria-label="Fechar inspetor" className="icon-button" onClick={fecharInspetor} type="button"><IconeFechar size={20} /></button></header>{mediaPorId.get(selected.mediaPrincipalId) && mediaPicture(mediaPorId.get(selected.mediaPrincipalId)!, true)}<p>{selected.resumo}</p><p className="inspector-evidence"><strong>{selected.nivelEvidencia.replace('-', ' ')}</strong> · {selected.intervalo.significado}</p>{selected.especimeIds[0] && especimesPorId.get(selected.especimeIds[0]) && <div className="inspector-specimen"><span>Espécime</span><strong>{especimesPorId.get(selected.especimeIds[0])?.apelido}</strong><p>{especimesPorId.get(selected.especimeIds[0])?.resumo}</p></div>}<div className="inspector-sources">{selected.fonteIds.slice(0, 3).map((id) => fontesPorId.get(id)).filter(Boolean).map((fonte) => <a href={fonte?.url} key={fonte?.id} rel="noreferrer" target="_blank">{fonte?.titulo}</a>)}</div><div className="inspector-actions"><button aria-label="Organismo anterior" onClick={() => moveSelection(-1)} type="button"><IconeVoltar size={18} /> Anterior</button><button onClick={copiarLink} type="button">Copiar link</button><button aria-label="Próximo organismo" onClick={() => moveSelection(1)} type="button">Próximo <IconeSeta size={18} /></button></div></motion.aside>}
      </div>
      <details className="timeline-list"><summary>Ver como lista</summary><ol>{organismosVisiveis.map((organismo) => <li key={organismo.id}><button onClick={() => selecionarOrganismo(organismo)} type="button"><span>{organismo.intervalo.inicioMa}–{organismo.intervalo.fimMa} Ma</span><strong>{organismo.nomePt}</strong><em>{organismo.nomeCientifico}</em></button></li>)}</ol></details>
    </div>
  );
}
