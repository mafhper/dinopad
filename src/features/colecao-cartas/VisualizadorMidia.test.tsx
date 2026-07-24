import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { MediaAsset } from '../../content/types';
import { VisualizadorMidia } from './VisualizadorMidia';

function criarMidia(indice: number): MediaAsset {
  return {
    id: `midia-${indice}`,
    entidade: { tipo: 'organismo', id: 'organismo-teste' },
    papel: indice === 1 ? 'interpretacao' : indice === 2 ? 'escala' : 'evidencia',
    representacao: indice === 1 ? 'interpretacao' : indice === 2 ? 'diagrama' : 'evidencia',
    titulo: `Imagem ${indice + 1}`,
    autor: 'Autoria de teste',
    fonte: 'Fonte de teste',
    urlFonte: `https://example.com/imagem-${indice + 1}`,
    licenca: 'CC-BY-4.0',
    urlLicenca: 'https://creativecommons.org/licenses/by/4.0/',
    acessadoEm: '2026-07-21',
    arquivos: {
      src: `/media/imagem-${indice + 1}.webp`,
      srcSet: `/media/imagem-${indice + 1}.webp 960w`,
      miniaturaSrcSet: `/media/imagem-${indice + 1}-96.webp 96w`,
    },
    altPt: `Descrição da imagem ${indice + 1}`,
    legendaPt: `Legenda científica ${indice + 1}`,
    alteracoes: 'Conversão para WebP.',
  };
}

const media = [criarMidia(0), criarMidia(1), criarMidia(2)];

describe('VisualizadorMidia', () => {
  it('abre como diálogo modal e permite navegar por controles, teclado e miniaturas', () => {
    const onFechar = vi.fn();
    render(<VisualizadorMidia indiceInicial={0} media={media} nomeOrganismo="Organismo de teste" onFechar={onFechar} />);

    const dialog = screen.getByRole('dialog', { name: 'Organismo de teste' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Fechar visualizador' })).toHaveFocus();
    expect(screen.getByText('Imagem 1 de 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Próxima imagem' }));
    expect(screen.getByText('Imagem 2 de 3')).toBeInTheDocument();
    expect(screen.getByAltText('Descrição da imagem 2')).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: 'ArrowLeft' });
    expect(screen.getByText('Imagem 1 de 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar imagem 3: Imagem 3' }));
    expect(screen.getByText('Imagem 3 de 3')).toBeInTheDocument();

    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(onFechar).toHaveBeenCalledTimes(1);
  });

  it('reconhece swipe horizontal sem transformar gesto vertical em navegação', () => {
    render(<VisualizadorMidia indiceInicial={0} media={media} nomeOrganismo="Organismo de teste" onFechar={() => undefined} />);
    const palco = screen.getByLabelText(/Imagem ampliada/);

    fireEvent.pointerDown(palco, { clientX: 280, clientY: 200, pointerId: 1, pointerType: 'touch' });
    fireEvent.pointerUp(palco, { clientX: 190, clientY: 205, pointerId: 1, pointerType: 'touch' });
    expect(screen.getByText('Imagem 2 de 3')).toBeInTheDocument();

    fireEvent.pointerDown(palco, { clientX: 200, clientY: 160, pointerId: 2, pointerType: 'touch' });
    fireEvent.pointerUp(palco, { clientX: 180, clientY: 260, pointerId: 2, pointerType: 'touch' });
    expect(screen.getByText('Imagem 2 de 3')).toBeInTheDocument();
  });
});
