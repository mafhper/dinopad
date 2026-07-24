import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { IconeFechar, IconeSeta, IconeVoltar } from '../../components/Icons';
import type { MediaAsset, OrganismoAtlas } from '../../content/types';
import { EscalaDimensional } from './EscalaDimensional';
import { rotuloPapelMedia } from './rotulosMidia';

interface VisualizadorMidiaProps {
  indiceInicial: number;
  media: MediaAsset[];
  nomeOrganismo: string;
  organismo?: OrganismoAtlas;
  onFechar: () => void;
}

interface PontoDoGesto {
  pointerId: number;
  x: number;
  y: number;
}

const LIMIAR_SWIPE_PX = 48;

export function VisualizadorMidia({ indiceInicial, media, nomeOrganismo, organismo, onFechar }: VisualizadorMidiaProps) {
  const [indiceAtivo, setIndiceAtivo] = useState(indiceInicial);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inicioDoGestoRef = useRef<PontoDoGesto | null>(null);
  const asset = media[indiceAtivo];
  const temNavegacao = media.length > 1;

  const selecionar = useCallback((indice: number) => {
    setIndiceAtivo((indice + media.length) % media.length);
  }, [media.length]);

  const anterior = useCallback(() => selecionar(indiceAtivo - 1), [indiceAtivo, selecionar]);
  const proxima = useCallback(() => selecionar(indiceAtivo + 1), [indiceAtivo, selecionar]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');

    return () => {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
    };
  }, []);

  if (!asset) return null;

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (!temNavegacao) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      anterior();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      proxima();
    }
    if (event.key === 'Home') {
      event.preventDefault();
      selecionar(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      selecionar(media.length - 1);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    inicioDoGestoRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const inicio = inicioDoGestoRef.current;
    inicioDoGestoRef.current = null;
    if (!inicio || inicio.pointerId !== event.pointerId || !temNavegacao) return;

    const deslocamentoX = event.clientX - inicio.x;
    const deslocamentoY = event.clientY - inicio.y;
    if (Math.abs(deslocamentoX) < LIMIAR_SWIPE_PX || Math.abs(deslocamentoX) <= Math.abs(deslocamentoY)) return;

    if (deslocamentoX < 0) proxima();
    else anterior();
  };

  return createPortal(
    <dialog
      aria-labelledby="media-viewer-title"
      aria-modal="true"
      className="media-viewer"
      onCancel={(event) => {
        event.preventDefault();
        onFechar();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
    >
      <div className="media-viewer-shell">
        <header className="media-viewer-header">
          <div>
            <p>Galeria científica</p>
            <h2 id="media-viewer-title">{nomeOrganismo}</h2>
          </div>
          <p aria-live="polite" className="media-viewer-count"><span className="sr-only">{asset.titulo}. </span>Imagem {indiceAtivo + 1} de {media.length}</p>
          <button aria-label="Fechar visualizador" autoFocus className="media-viewer-icon-button" onClick={onFechar} type="button">
            <IconeFechar size={22} />
          </button>
        </header>

        <section
          aria-label="Imagem ampliada. Deslize horizontalmente ou use as setas para navegar."
          className="media-viewer-stage"
          onPointerCancel={() => { inicioDoGestoRef.current = null; }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {temNavegacao && (
            <button aria-label="Imagem anterior" className="media-viewer-arrow is-previous" onClick={anterior} type="button">
              <IconeVoltar size={26} />
            </button>
          )}

          <figure className="media-viewer-figure" key={asset.id}>
            {asset.papel === 'escala' && organismo
              ? <EscalaDimensional organismo={organismo} />
              : <picture>
                {asset.arquivos.avifSrcSet && <source sizes="100vw" srcSet={asset.arquivos.avifSrcSet} type="image/avif" />}
                <img alt={asset.altPt} draggable="false" sizes="100vw" src={asset.arquivos.src} srcSet={asset.arquivos.srcSet} />
              </picture>}
            <figcaption>
              <span className="media-role">{rotuloPapelMedia[asset.papel]}</span>
              <strong>{asset.titulo}</strong>
              <span>{asset.papel === 'escala' ? 'Régua dimensional calculada com a maior medida citada na ficha; não é uma reconstrução anatômica.' : asset.legendaPt}</span>
              <a href={asset.urlFonte} rel="noreferrer" target="_blank">{asset.autor} · {asset.licenca}</a>
            </figcaption>
          </figure>

          {temNavegacao && (
            <button aria-label="Próxima imagem" className="media-viewer-arrow is-next" onClick={proxima} type="button">
              <IconeSeta size={26} />
            </button>
          )}
        </section>

        <footer className="media-viewer-footer">
          <p>Deslize sobre a imagem ou use ← e →</p>
          <ul aria-label="Escolher imagem" className="media-viewer-thumbnails">
            {media.map((item, index) => (
              <li key={item.id}>
                <button
                  aria-current={index === indiceAtivo ? 'true' : undefined}
                  aria-label={`Mostrar imagem ${index + 1}: ${item.titulo}`}
                  className="media-viewer-thumbnail"
                  onClick={() => selecionar(index)}
                  type="button"
                >
                  <img alt="" loading="eager" sizes="88px" src={item.arquivos.src} srcSet={item.arquivos.miniaturaSrcSet ?? item.arquivos.srcSet} />
                  {index === indiceAtivo && <span>Atual</span>}
                </button>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </dialog>,
    document.body,
  );
}
