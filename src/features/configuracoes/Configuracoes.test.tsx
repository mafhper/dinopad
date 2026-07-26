import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import Configuracoes from './Configuracoes';

afterEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.themePreference;
});

describe('Configurações', () => {
  it('oferece quatro temas e a preferência automática', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Configuracoes /></MemoryRouter>);

    expect(screen.getAllByRole('radio')).toHaveLength(5);
    await user.click(screen.getByRole('radio', { name: /Roxo/ }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'purple');
    expect(screen.getByText('Em uso: Roxo')).toBeVisible();
  });
});
