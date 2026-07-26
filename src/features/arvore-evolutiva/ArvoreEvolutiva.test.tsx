import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { catalogo } from '../../content/catalog.generated';
import ArvoreEvolutiva from './ArvoreEvolutiva';
import { buildPhylogenyData, calculatePhylogenyLayout } from './phylogeny-layout';
import { unobscuredViewportCenter } from './phylogeny-viewport';

describe('árvore filogenética', () => {
  it('calcula o centro da área que permanece visível ao lado ou acima do inspetor', () => {
    const canvas = { bottom: 600, height: 600, left: 0, right: 1000, top: 0, width: 1000 };
    expect(unobscuredViewportCenter(canvas, { bottom: 600, height: 600, left: 700, right: 1000, top: 0, width: 300 })).toEqual({ x: 350, y: 300 });
    expect(unobscuredViewportCenter(canvas, { bottom: 600, height: 260, left: 0, right: 1000, top: 340, width: 1000 })).toEqual({ x: 500, y: 170 });
    expect(unobscuredViewportCenter(canvas)).toEqual({ x: 500, y: 300 });
  });

  it('calcula layout determinístico e preserva polytomias', () => {
    const data = buildPhylogenyData('eukaryota', catalogo.nosFilogeneticos, catalogo.organismos);
    expect(data).not.toBeNull();
    const first = calculatePhylogenyLayout(data!, 'left');
    const second = calculatePhylogenyLayout(data!, 'left');
    expect(first.nodes.map(({ data, px, py }) => [data.id, px, py])).toEqual(second.nodes.map(({ data, px, py }) => [data.id, px, py]));
    expect(first.nodes).toHaveLength(catalogo.nosFilogeneticos.length + catalogo.organismos.length);
    expect(first.nodes.find(({ data: item }) => item.id === 'dinosauria')?.children?.length).toBeGreaterThan(1);
  });

  it('limita a profundidade no celular e informa folhas ocultas', () => {
    const data = buildPhylogenyData('eukaryota', catalogo.nosFilogeneticos, catalogo.organismos, 3)!;
    const layout = calculatePhylogenyLayout(data, 'top');
    expect(Math.max(...layout.nodes.map(({ depth }) => depth))).toBe(3);
    expect(layout.nodes.some(({ data: item }) => item.hiddenDescendants > 0)).toBe(true);
  });

  it('abre uma folha, mostra o inspetor e oferece a hierarquia como lista', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/arvore?raiz=archaefructus-lineage&modo=cladograma']}><Routes><Route element={<ArvoreEvolutiva />} path="/arvore" /></Routes></MemoryRouter>);
    await user.click(screen.getByRole('treeitem', { name: /Arqueofruto/i }));
    expect(screen.getByRole('complementary', { name: 'Inspetor da árvore' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir ficha' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ver como lista' }));
    expect(screen.getByRole('button', { name: /Arqueofruto/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Fontes de Arqueofruto/i }).querySelector('a')).not.toBeNull();
  });
});
