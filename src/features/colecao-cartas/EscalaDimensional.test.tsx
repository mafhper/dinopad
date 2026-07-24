import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { catalogo } from '../../content/catalog.generated';
import { EscalaDimensional } from './EscalaDimensional';

describe('EscalaDimensional', () => {
  it('mostra uma régua baseada na medida da ficha sem desenhar uma silhueta anatômica', () => {
    const tiranossauro = catalogo.organismos.find(({ id }) => id === 'tyrannosaurus-rex');
    expect(tiranossauro).toBeDefined();

    render(<EscalaDimensional organismo={tiranossauro!} />);

    expect(screen.getByText('Comprimento')).toBeInTheDocument();
    expect(screen.getByText('até 12–13 m')).toBeInTheDocument();
    expect(screen.getByText('Referência humana: 1,7 m.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Régua de zero a 15 m/)).toBeInTheDocument();
  });
});
