import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Timeline } from './Timeline';

function renderTimeline(entry = '/tempo') {
  return render(<MemoryRouter initialEntries={[entry]}><Routes><Route element={<Timeline />} path="/tempo" /></Routes></MemoryRouter>);
}

describe('Timeline', () => {
  it('inicia no Mesozoico e permite zoom/reset por controles acessíveis', async () => {
    const user = userEvent.setup();
    renderTimeline();
    expect(screen.getByRole('heading', { name: 'Tempo profundo' })).toBeInTheDocument();
    expect(screen.getByText('Mesozoico', { selector: 'strong' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aproximar' }));
    expect(screen.getByText('Período', { selector: 'strong' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Voltar ao Mesozoico' }));
    expect(screen.getByText('Mesozoico', { selector: 'strong' })).toBeInTheDocument();
  });

  it('restaura um organismo pela URL e fecha o inspetor', async () => {
    const user = userEvent.setup();
    renderTimeline('/tempo?inicioMa=71&fimMa=63&item=tyrannosaurus-rex&camada=organismo&filtro=fauna');
    expect(screen.getByRole('heading', { name: 'Tiranossauro' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fechar inspetor' }));
    expect(screen.queryByRole('heading', { name: 'Tiranossauro' })).not.toBeInTheDocument();
  });

  it('filtra flora e marcos com alvos acessíveis', async () => {
    const user = userEvent.setup();
    renderTimeline();
    await user.click(screen.getByRole('button', { name: 'Flora' }));
    expect(screen.getByRole('button', { name: 'Flora' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Marcos' }));
    expect(screen.getByRole('button', { name: 'Marcos' })).toHaveAttribute('aria-pressed', 'true');
  });
});
