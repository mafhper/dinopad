import { describe, expect, it } from 'vitest';
import { reanchorTextQuote } from '../estudo/text-quote';

describe('âncora W3C TextQuoteSelector', () => {
  it('reencontra uma seleção pelo texto exato, prefixo e sufixo', () => {
    const text = 'Antes, a árvore tem muitos ramos. Depois, o estudo continua.';
    expect(reanchorTextQuote(text, {
      exact: 'a árvore tem muitos ramos',
      prefix: 'Antes, ',
      suffix: '. Depois',
    })).toBe(7);
  });

  it('usa o contexto para distinguir ocorrências repetidas', () => {
    const text = 'DNA antigo é frágil. DNA antigo exige controles.';
    expect(reanchorTextQuote(text, {
      exact: 'DNA antigo',
      prefix: 'frágil. ',
      suffix: ' exige',
    })).toBe(21);
  });

  it('marca como não encontrado quando o trecho desaparece', () => {
    expect(reanchorTextQuote('Texto revisado.', { exact: 'trecho antigo', prefix: '', suffix: '' })).toBe(-1);
  });
});
