import { startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { IconeExpandir, IconeFechar, IconeRecolher, IconeSeta, IconeVoltar } from '../../components/Icons';
import { formatarEnergia } from '../../content/format';
import type { FonteCientifica, NoFilogenetico } from '../../content/types';
import { useAtlas } from '../../hooks/useAtlas';
import { buildPhylogenyData, calculatePhylogenyLayout, type PhylogenyDatum, type PositionedDatum } from './phylogeny-layout';
import { unobscuredViewportCenter } from './phylogeny-viewport';

function useHorizontalTree() {
  const [horizontal, setHorizontal] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 720px), (orientation: landscape)').matches);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 720px), (orientation: landscape)');
    const update = () => setHorizontal(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return horizontal;
}

function sourceFromThumbnail(srcSet: string | undefined, fallback: string | undefined) {
  return srcSet?.split(',').at(-1)?.trim().split(/\s+/)[0] ?? fallback;
}

function branchPath(source: Pick<PositionedDatum, 'px' | 'py'>, target: Pick<PositionedDatum, 'px' | 'py'>, orientation: 'top' | 'left') {
  if (orientation === 'left') {
    const middle = (source.px + target.px) / 2;
    return `M${source.px},${source.py}C${middle},${source.py} ${middle},${target.py} ${target.px},${target.py}`;
  }
  const middle = (source.py + target.py) / 2;
  return `M${source.px},${source.py}C${source.px},${middle} ${target.px},${middle} ${target.px},${target.py}`;
}

function AccessibleTreeList({ data, fontesPorId, onNode, onOrganism }: { data: PhylogenyDatum; fontesPorId: Map<string, FonteCientifica>; onNode: (id: string) => void; onOrganism: (id: string) => void }) {
  const render = (item: PhylogenyDatum) => (
    <li key={`${item.kind}-${item.id}`}>
      <button onClick={() => item.kind === 'node' ? onNode(item.id) : onOrganism(item.id)} type="button">
        <strong>{item.label}</strong><span>{item.scientificName}</span><em>{item.certainty.replace('-', ' ')}</em>
      </button>
      <div aria-label={`Fontes de ${item.label}`} className="phylogeny-list-sources" role="group">{item.sourceIds.flatMap((id) => { const source = fontesPorId.get(id); return source ? [<a href={source.url} key={id} rel="noreferrer" target="_blank">{source.titulo}</a>] : []; })}</div>
      {item.children && item.children.length > 0 && <ul>{item.children.map(render)}</ul>}
      {item.hiddenDescendants > 0 && <small>{item.hiddenDescendants} folhas continuam neste ramo.</small>}
    </li>
  );
  return <ul className="phylogeny-list">{render(data)}</ul>;
}

export default function ArvoreEvolutiva() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { nosFilogeneticos, organismos, nosFilogeneticosPorId, organismosPorId, fontesPorId, mediaPorId, linhagens, conexoesEvolutivas } = useAtlas();
  const horizontal = useHorizontalTree();
  const orientation = horizontal ? 'left' : 'top';
  const requestedRoot = searchParams.get('raiz') ?? 'eukaryota';
  const rootId = nosFilogeneticosPorId.has(requestedRoot) ? requestedRoot : 'eukaryota';
  const selectedOrganismId = searchParams.get('item');
  const selectedNodeId = searchParams.get('no');
  const mode = searchParams.get('modo') === 'lista' ? 'lista' : 'cladograma';
  const fullscreen = searchParams.get('tela') === 'cheia';
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLElement>(null);
  const fullscreenPanelRef = useRef<HTMLDivElement>(null);
  const fullscreenTriggerRef = useRef<HTMLButtonElement>(null);
  const pendingCenterIdRef = useRef<string | null>(null);
  const selectedTriggerRef = useRef<SVGGElement | null>(null);
  const previousRootRef = useRef(rootId);
  const maxDepth = horizontal ? undefined : 3;
  const focusedData = useMemo(() => buildPhylogenyData(rootId, nosFilogeneticos, organismos, maxDepth), [maxDepth, nosFilogeneticos, organismos, rootId]);
  const completeData = useMemo(
    () => horizontal ? buildPhylogenyData('eukaryota', nosFilogeneticos, organismos) : null,
    [horizontal, nosFilogeneticos, organismos],
  );
  const layoutData = completeData ?? focusedData;
  const layout = useMemo(() => layoutData ? calculatePhylogenyLayout(layoutData, orientation) : null, [layoutData, orientation]);
  const positionedById = useMemo(() => new Map(layout?.nodes.map((node) => [node.data.id, node]) ?? []), [layout]);
  const lineageIds = useMemo(() => new Set(linhagens.map(({ id }) => id)), [linhagens]);
  const visibleConnections = useMemo(() => conexoesEvolutivas.flatMap((connection) => {
    const target = positionedById.get(connection.destinoId);
    const directSource = positionedById.get(connection.origemId);
    const lineageSource = lineageIds.has(connection.origemId) ? positionedById.get('homo') : undefined;
    const source = directSource ?? lineageSource;
    return source && target ? [{ connection, source, target, lineageSource: Boolean(lineageSource && !directSource) }] : [];
  }), [conexoesEvolutivas, lineageIds, positionedById]);
  const selectedOrganism = selectedOrganismId ? organismosPorId.get(selectedOrganismId) : undefined;
  const selectedNode = selectedNodeId ? nosFilogeneticosPorId.get(selectedNodeId) : undefined;
  const currentRoot = nosFilogeneticosPorId.get(rootId);
  const rootPath = useMemo(() => {
    const result: NoFilogenetico[] = [];
    let current = nosFilogeneticosPorId.get(rootId);
    while (current) {
      result.unshift(current);
      current = current.paiId ? nosFilogeneticosPorId.get(current.paiId) : undefined;
    }
    return result;
  }, [nosFilogeneticosPorId, rootId]);
  const visibleOrganisms = useMemo(() => {
    const result: string[] = [];
    const visit = (item: PhylogenyDatum | null) => {
      if (!item) return;
      if (item.kind === 'organism') result.push(item.id);
      item.children?.forEach(visit);
    };
    visit(focusedData);
    return result;
  }, [focusedData]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.querySelector<SVGGElement>(`[data-phylogeny-id="${rootId}"]`);
    const marker = root?.querySelector<SVGGraphicsElement>('circle, image');
    if (!canvas || !marker) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rootChanged = previousRootRef.current !== rootId;
    previousRootRef.current = rootId;
    const frame = requestAnimationFrame(() => {
      const canvasRect = canvas.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      const markerCenter = {
        x: markerRect.left + markerRect.width / 2,
        y: markerRect.top + markerRect.height / 2,
      };
      const target = orientation === 'left'
        ? { x: canvasRect.left + 32, y: (canvasRect.top + canvasRect.bottom) / 2 }
        : { x: (canvasRect.left + canvasRect.right) / 2, y: markerCenter.y };
      const left = Math.max(0, Math.min(canvas.scrollWidth - canvas.clientWidth, canvas.scrollLeft + markerCenter.x - target.x));
      const top = orientation === 'left'
        ? Math.max(0, Math.min(canvas.scrollHeight - canvas.clientHeight, canvas.scrollTop + markerCenter.y - target.y))
        : 0;
      if (typeof canvas.scrollTo === 'function') canvas.scrollTo({ behavior: reducedMotion || !rootChanged ? 'auto' : 'smooth', left, top });
      else {
        canvas.scrollLeft = left;
        canvas.scrollTop = top;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [layout, orientation, rootId]);

  const centerNode = useCallback((id: string) => {
    const canvas = canvasRef.current;
    const node = canvas?.querySelector<SVGGElement>(`[data-phylogeny-id="${id}"]`);
    const marker = node?.querySelector<SVGGraphicsElement>('circle, image');
    if (!canvas || !marker) return;

    const canvasRect = canvas.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const visibleCenter = unobscuredViewportCenter(canvasRect, inspectorRef.current?.getBoundingClientRect());
    const markerCenter = {
      x: markerRect.left + markerRect.width / 2,
      y: markerRect.top + markerRect.height / 2,
    };
    const left = Math.max(0, Math.min(canvas.scrollWidth - canvas.clientWidth, canvas.scrollLeft + markerCenter.x - visibleCenter.x));
    const top = Math.max(0, Math.min(canvas.scrollHeight - canvas.clientHeight, canvas.scrollTop + markerCenter.y - visibleCenter.y));
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    if (typeof canvas.scrollTo === 'function') canvas.scrollTo({ behavior, left, top });
    else {
      canvas.scrollLeft = left;
      canvas.scrollTop = top;
    }
  }, []);

  useLayoutEffect(() => {
    if (mode !== 'cladograma' || !selectedOrganismId || pendingCenterIdRef.current !== selectedOrganismId) return;
    const frame = requestAnimationFrame(() => {
      centerNode(selectedOrganismId);
      pendingCenterIdRef.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [centerNode, mode, selectedOrganismId]);

  const updateParams = (changes: Record<string, string | null>, replace = false) => {
    const next = new URLSearchParams(searchParams);
    next.set('modo', changes.modo ?? mode);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    startTransition(() => setSearchParams(next, { replace }));
  };
  const focusNode = (id: string) => {
    setZoom(1);
    updateParams({ raiz: id, no: null, item: null, modo: 'cladograma' });
    requestAnimationFrame(() => canvasRef.current?.focus());
  };
  const selectOrganism = (id: string) => updateParams({ item: id, no: null });
  const closeInspector = () => {
    updateParams({ item: null, no: null });
    requestAnimationFrame(() => selectedTriggerRef.current?.focus());
  };
  const navigateVisible = (direction: -1 | 1) => {
    if (!selectedOrganismId || visibleOrganisms.length === 0) return;
    const current = visibleOrganisms.indexOf(selectedOrganismId);
    const next = visibleOrganisms[(Math.max(0, current) + direction + visibleOrganisms.length) % visibleOrganisms.length];
    pendingCenterIdRef.current = next;
    selectOrganism(next);
  };

  const toggleFullscreen = () => updateParams({ tela: fullscreen ? null : 'cheia' });

  useEffect(() => {
    if (!fullscreen) return;
    const bodyOverflow = document.body.style.overflow;
    const trigger = fullscreenTriggerRef.current;
    const obscured = Array.from(document.querySelectorAll<HTMLElement>('.desktop-sidebar, .mobile-header, .mobile-tabbar'));
    const previousState = obscured.map((element) => ({
      ariaHidden: element.getAttribute('aria-hidden'),
      element,
      inert: element.inert,
    }));
    document.body.style.overflow = 'hidden';
    obscured.forEach((element) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        startTransition(() => setSearchParams((current) => {
          const next = new URLSearchParams(current);
          next.delete('tela');
          return next;
        }));
        return;
      }
      if (event.key !== 'Tab' || !fullscreenPanelRef.current) return;
      const focusable = Array.from(fullscreenPanelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hidden);
      if (!focusable.length) {
        event.preventDefault();
        fullscreenPanelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const frame = requestAnimationFrame(() => fullscreenPanelRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      previousState.forEach(({ ariaHidden, element, inert }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      requestAnimationFrame(() => trigger?.focus());
    };
  }, [fullscreen, setSearchParams]);

  useEffect(() => {
    if (requestedRoot !== rootId) updateParams({ raiz: rootId, item: null, no: null, modo: 'cladograma' }, true);
  // The URL is the source of truth; this effect only repairs an invalid root.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedRoot, rootId]);

  const inspectorMedia = selectedOrganism ? mediaPorId.get(selectedOrganism.mediaPrincipalId) : undefined;
  const inspectorSources = (selectedOrganism?.fonteIds ?? selectedNode?.fonteIds ?? []).flatMap((id) => {
    const source = fontesPorId.get(id);
    return source ? [source] : [];
  });
  const inspectorCertainty = selectedOrganism?.nivelEvidencia ?? selectedNode?.certeza;
  const inspectorCertaintyClass = selectedOrganism
    ? selectedOrganism.nivelEvidencia === 'bem-estabelecido'
      ? 'estabelecida'
      : selectedOrganism.nivelEvidencia === 'interpretado'
        ? 'provavel'
        : 'em-debate'
    : selectedNode?.certeza;

  if (!focusedData || !layout) return null;
  return (
    <div
      aria-label={fullscreen ? 'Árvore da vida em tela cheia' : undefined}
      aria-modal={fullscreen || undefined}
      className={`phylogeny-page${selectedOrganism || selectedNode ? ' has-inspector' : ''}${fullscreen ? ' is-fullscreen' : ''}`}
      data-phylogeny-fullscreen={fullscreen ? 'true' : 'false'}
      ref={fullscreenPanelRef}
      role={fullscreen ? 'dialog' : undefined}
      tabIndex={fullscreen ? -1 : undefined}
    >
      <header className="phylogeny-header">
        <div><p className="eyebrow">Vida em ramos</p><h1>Árvore da vida</h1><p>Relações, não duração nem ancestralidade direta. Nós internos são ancestrais comuns inferidos.</p></div>
        <div className="phylogeny-header-actions">
          <div className="phylogeny-mode" aria-label="Modo de visualização"><button aria-pressed={mode === 'cladograma'} onClick={() => updateParams({ modo: 'cladograma' })} type="button">Cladograma</button><button aria-pressed={mode === 'lista'} onClick={() => updateParams({ modo: 'lista' })} type="button">Ver como lista</button></div>
          <button
            aria-label={fullscreen ? 'Sair da tela cheia' : 'Abrir árvore em tela cheia'}
            className="phylogeny-fullscreen-button"
            onClick={toggleFullscreen}
            ref={fullscreenTriggerRef}
            type="button"
          >
            {fullscreen ? <IconeRecolher size={18} /> : <IconeExpandir size={18} />}
            <span>{fullscreen ? 'Sair' : 'Tela cheia'}</span>
          </button>
        </div>
      </header>
      <nav aria-label="Caminho até o ramo em foco" className="phylogeny-breadcrumb">{rootPath.map((node, index) => <span key={node.id}>{index > 0 && <IconeSeta size={13} />}<button aria-current={index === rootPath.length - 1 ? 'location' : undefined} onClick={() => focusNode(node.id)} type="button">{node.nomePt}</button></span>)}</nav>
      <div className="phylogeny-toolbar" aria-label="Controles da árvore">
        <div aria-live="polite" className="phylogeny-current-context" data-phylogeny-context role="status">
          <span aria-hidden="true" />
          <p>
            <small>Ramo em foco</small>
            <strong>{currentRoot?.nomePt}</strong>
            {(selectedOrganism || selectedNode) && <em>Selecionado: {selectedOrganism?.nomePt ?? selectedNode?.nomePt}</em>}
          </p>
        </div>
        <button aria-label="Reduzir" disabled={zoom <= 0.7} onClick={() => setZoom((value) => Math.max(0.7, value - 0.15))} type="button">−</button>
        <button aria-label="Ampliar" disabled={zoom >= 1.45} onClick={() => setZoom((value) => Math.min(1.45, value + 0.15))} type="button">+</button>
        <button onClick={() => setZoom(1)} type="button">Ajustar</button>
        {rootId !== 'eukaryota' && <button onClick={() => focusNode(nosFilogeneticosPorId.get(rootId)?.paiId ?? 'eukaryota')} type="button"><IconeVoltar size={16} /> Voltar um ramo</button>}
        <button data-phylogeny-reset onClick={() => focusNode('eukaryota')} type="button">Ir a Eucariotos</button>
      </div>
      <p className="sr-only" aria-live="polite">Ramo {nosFilogeneticosPorId.get(rootId)?.nomePt}; {layout.nodes.length} nós visíveis e {visibleOrganisms.length} organismos.</p>
      {mode === 'lista' ? (
        <div className="phylogeny-list-scroll"><AccessibleTreeList data={focusedData} fontesPorId={fontesPorId} onNode={focusNode} onOrganism={selectOrganism} /></div>
      ) : (
        <div aria-label="Cladograma interativo" className="phylogeny-canvas" data-phylogeny-root={rootId} ref={canvasRef} role="region" tabIndex={0}>
          <svg height={Math.max(layout.height * zoom, horizontal ? 620 : 680)} role="tree" viewBox={`0 0 ${Math.max(layout.width, horizontal ? 1180 : 680)} ${Math.max(layout.height, horizontal ? 620 : 680)}`} width={Math.max(layout.width * zoom, horizontal ? 1180 : 680)}>
            <g className="phylogeny-stage" style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
              <g aria-hidden="true" className="phylogeny-branches">
                {layout.links.map((link) => {
                  const source = positionedById.get(link.source.data.id)!;
                  const target = positionedById.get(link.target.data.id)!;
                  return <path className={target.data.certainty === 'em-debate' ? 'is-uncertain' : target.data.certainty === 'provavel' ? 'is-probable' : ''} d={branchPath(source, target, orientation)} key={`${source.data.id}-${target.data.id}`} />;
                })}
              </g>
              <g aria-hidden="true" className="phylogeny-gene-flow">
                {visibleConnections.map(({ connection, source, target, lineageSource }) => {
                  const offsetSource = lineageSource
                    ? { ...source, px: source.px + (orientation === 'left' ? 76 : 34), py: source.py + (orientation === 'left' ? 28 : 54) }
                    : source;
                  return <path d={branchPath(offsetSource, target, orientation)} key={connection.id} />;
                })}
              </g>
              {layout.nodes.map((node) => {
                const item = node.data;
                const isSelected = item.id === selectedOrganismId || item.id === selectedNodeId;
                const isCurrentRoot = item.kind === 'node' && item.id === rootId;
                const organism = item.kind === 'organism' ? organismosPorId.get(item.id) : undefined;
                const media = organism ? mediaPorId.get(organism.mediaPrincipalId) : undefined;
                const thumbnail = sourceFromThumbnail(media?.arquivos.miniaturaSrcSet, media?.arquivos.src);
                return (
                  <g aria-current={isCurrentRoot ? 'location' : undefined} aria-label={`${item.label}, ${item.scientificName}, certeza ${item.certainty.replace('-', ' ')}${isCurrentRoot ? ', ramo em foco' : ''}`} aria-selected={isSelected} className={`phylogeny-node kind-${item.kind} certainty-${item.certainty}${isSelected ? ' is-selected' : ''}${isCurrentRoot ? ' is-current-root' : ''}`} data-phylogeny-current-root={isCurrentRoot ? 'true' : undefined} data-phylogeny-id={item.id} key={`${item.kind}-${item.id}`} onClick={() => item.kind === 'node' ? focusNode(item.id) : selectOrganism(item.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (item.kind === 'node') focusNode(item.id); else selectOrganism(item.id); } }} ref={isSelected ? selectedTriggerRef : undefined} role="treeitem" tabIndex={0} transform={`translate(${node.px} ${node.py})`}>
                    <rect className="phylogeny-hit" height="48" rx="12" width={item.kind === 'organism' ? 176 : 158} x="-24" y="-24" />
                    {isCurrentRoot && <circle aria-hidden="true" className="phylogeny-root-halo" r="15" />}
                    {item.kind === 'organism' && thumbnail ? <image aria-hidden="true" height="38" href={thumbnail} preserveAspectRatio="xMidYMid slice" width="38" x="-19" y="-19" /> : <circle aria-hidden="true" r={item.kind === 'organism' ? 9 : 7} />}
                    <text className="phylogeny-label" x={item.kind === 'organism' ? 27 : 16} y="-3">{item.label}</text>
                    <text className="phylogeny-scientific" x={item.kind === 'organism' ? 27 : 16} y="14">{item.scientificName}</text>
                    {isCurrentRoot && <text aria-hidden="true" className="phylogeny-root-label" x="16" y="-20">RAMO EM FOCO</text>}
                    {item.hiddenDescendants > 0 && <text className="phylogeny-more" x="16" y="30">+ {item.hiddenDescendants} folhas · toque para focar</text>}
                    {item.certainty !== 'estabelecida' && <path aria-hidden="true" className="certainty-mark" d="M-7 18h14" />}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}
      <div className="phylogeny-legend"><span><i />Relação estabelecida</span><span><i className="probable" />Provável</span><span><i className="uncertain" />Em debate</span></div>
      {visibleConnections.length > 0 && <aside className="gene-flow-summary" aria-label="Conexões de fluxo gênico"><strong>Conexões sobre a árvore: fluxo gênico, não novos galhos</strong>{visibleConnections.map(({ connection }) => <span key={connection.id}>{connection.resumo}</span>)}</aside>}
      {(selectedOrganism || selectedNode) && (
        <aside aria-label="Inspetor da árvore" className="phylogeny-inspector" ref={inspectorRef}>
          <header>
            <div>
              <p className="eyebrow">{selectedOrganism ? 'Organismo selecionado' : selectedNode?.nivelTaxonomico}</p>
              <h2>{selectedOrganism?.nomePt ?? selectedNode?.nomePt}</h2>
              <p className="scientific-name">{selectedOrganism?.nomeCientifico ?? selectedNode?.nomeCientifico}</p>
            </div>
            <button aria-label="Fechar inspetor" className="icon-button" onClick={closeInspector} type="button"><IconeFechar size={19} /></button>
          </header>
          <div className="phylogeny-inspector-body">
            {inspectorMedia && <img alt={inspectorMedia.altPt} src={sourceFromThumbnail(inspectorMedia.arquivos.miniaturaSrcSet, inspectorMedia.arquivos.src)} />}
            {selectedOrganism && (
              <dl className="phylogeny-inspector-facts">
                <div><dt>Registro conhecido</dt><dd>{selectedOrganism.intervalo.inicioMa.toLocaleString('pt-BR')}–{selectedOrganism.intervalo.fimMa.toLocaleString('pt-BR')} Ma</dd></div>
                <div><dt>Energia</dt><dd>{formatarEnergia(selectedOrganism.energia.modoPrincipal)}</dd></div>
              </dl>
            )}
            <p className="phylogeny-inspector-summary">{selectedOrganism?.resumo ?? selectedNode?.notaEditorial ?? selectedNode?.caracteristicasCompartilhadas.join(' ')}</p>
            {inspectorCertainty && (
              <div className={`certainty-note certainty-${inspectorCertaintyClass}`}>
                <span aria-hidden="true" />
                <p><small>Nível de evidência</small><strong>{inspectorCertainty.replaceAll('-', ' ')}</strong></p>
              </div>
            )}
            {selectedNode && <ul className="phylogeny-inspector-features">{selectedNode.caracteristicasCompartilhadas.map((feature) => <li key={feature}>{feature}</li>)}</ul>}
            {inspectorSources.length > 0 && (
              <section className="inspector-sources" aria-label="Fontes científicas">
                <h3>Fontes para conferir</h3>
                <ul>{inspectorSources.map((source) => <li key={source.id}><a href={source.url} rel="noreferrer" target="_blank"><span><strong>{source.titulo}</strong><small>{source.instituicao}</small></span><IconeSeta size={15} /></a></li>)}</ul>
              </section>
            )}
          </div>
          <footer className="phylogeny-inspector-actions">
            {selectedOrganism && (
              <>
                <button disabled={visibleOrganisms.length <= 1} onClick={() => navigateVisible(-1)} type="button"><IconeVoltar size={16} /> Anterior</button>
                <button className="button-primary" onClick={() => navigate(`/cartas?item=${selectedOrganism.id}`)} type="button">Abrir ficha <IconeSeta size={16} /></button>
                <button disabled={visibleOrganisms.length <= 1} onClick={() => navigateVisible(1)} type="button">Próximo <IconeSeta size={16} /></button>
              </>
            )}
            {selectedNode && selectedNode.id !== rootId && <button className="button-primary inspector-focus-branch" onClick={() => focusNode(selectedNode.id)} type="button">Focar este ramo <IconeSeta size={16} /></button>}
          </footer>
        </aside>
      )}
    </div>
  );
}
