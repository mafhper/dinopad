// Prova do comparador de faixas de `deps-check.ts`.
//
// Um gate que decide se o build é confiável precisa ter a propriedade de errar
// para o lado **fechado**: nunca aceitar uma versão que devia recusar. Estes
// casos existem porque um `^` sem teto passa 2.x quando devia recusar — e foi
// exatamente o tipo de conta que faz o gate dizer "ok" sobre uma árvore errada.
//
// Uso: vitest run scripts/deps-check.test.ts

import { describe, expect, it } from 'vitest';
import { satisfaz } from './deps-check';

describe('satisfaz — faixas que este manifesto usa', () => {
  it('aceita a versão travada dentro de um caret', () => {
    expect(satisfaz('4.5.4', '^4.4.3')).toBe(true);
    expect(satisfaz('8.2.2', '^8.1.5')).toBe(true);
  });

  it('recusa o que está fora do caret, inclusive no major', () => {
    expect(satisfaz('5.0.0', '^4.4.3')).toBe(false);
    expect(satisfaz('4.4.2', '^4.4.3')).toBe(false);
  });

  it('^ não vaza para o major seguinte — o erro que o gate ingênuo comete', () => {
    expect(satisfaz('2.5.0', '^1.2.3')).toBe(false);
    expect(satisfaz('1.9.9', '^1.2.3')).toBe(true);
    expect(satisfaz('2.0.0', '^1.2.3')).toBe(false);
  });

  it('^ trava o minor no zero, porque 0.x é onde a API quebra', () => {
    expect(satisfaz('0.2.9', '^0.2.3')).toBe(true);
    expect(satisfaz('0.3.0', '^0.2.3')).toBe(false);
    expect(satisfaz('0.0.3', '^0.0.3')).toBe(true);
    expect(satisfaz('0.0.4', '^0.0.3')).toBe(false);
  });

  it('~ sobe o minor e nunca o major', () => {
    expect(satisfaz('1.2.9', '~1.2.3')).toBe(true);
    expect(satisfaz('1.3.0', '~1.2.3')).toBe(false);
    expect(satisfaz('2.0.0', '~1.2.3')).toBe(false);
  });

  it('~ sem patch também trava o minor — `~1.2` não aceita 1.9', () => {
    expect(satisfaz('1.2.9', '~1.2')).toBe(true);
    expect(satisfaz('1.9.0', '~1.2')).toBe(false);
    expect(satisfaz('1.9.0', '~1')).toBe(true);
    expect(satisfaz('2.0.0', '~1')).toBe(false);
  });

  it('faixa exata aceita só ela', () => {
    expect(satisfaz('3.0.0', '3.0.0')).toBe(true);
    expect(satisfaz('3.0.1', '3.0.0')).toBe(false);
    expect(satisfaz('2.9.9', '3.0.0')).toBe(false);
  });

  it('parcial deixa o último segmento variar, com ou sem `x`', () => {
    expect(satisfaz('1.9.9', '1.x')).toBe(true);
    expect(satisfaz('2.0.0', '1.x')).toBe(false);
    expect(satisfaz('1.9.9', '1')).toBe(true);
    expect(satisfaz('1.2.99', '1.2.x')).toBe(true);
    expect(satisfaz('1.3.0', '1.2.x')).toBe(false);
    expect(satisfaz('1.9.9', '1.2')).toBe(false); // `1.2` trava o minor, como no semver
    expect(satisfaz('1.2.99', '1.2')).toBe(true);
    expect(satisfaz('1.3.0', '1.2')).toBe(false);
    expect(satisfaz('9.9.9', '*')).toBe(true);
  });

  it('operadores de comparação', () => {
    expect(satisfaz('22.20.1', '>=22.12.0')).toBe(true);
    expect(satisfaz('22.11.0', '>=22.12.0')).toBe(false);
    expect(satisfaz('1.0.0', '>0.9.9')).toBe(true);
    expect(satisfaz('1.0.0', '<1.0.0')).toBe(false);
    expect(satisfaz('1.0.0', '<=1.0.0')).toBe(true);
  });

  it('alternativas com ||', () => {
    expect(satisfaz('2.0.0', '^1.0.0 || ^2.0.0')).toBe(true);
    expect(satisfaz('3.0.0', '^1.0.0 || ^2.0.0')).toBe(false);
  });

  it('compara só major.minor.patch e ignora o sufixo de pré-lançamento', () => {
    expect(satisfaz('0.1.0-alpha.1', '^0.1.0')).toBe(true);
    expect(satisfaz('4.0.0-rc.2', '^3.9.9')).toBe(false);
  });
});

describe('satisfaz — o que ele não entende vira erro, não silêncio', () => {
  it('recusa faixa com segmento a mais que três', () => {
    expect(() => satisfaz('1.2.3.4', '^1.2.3.4')).toThrow(/não suportada/);
  });

  it('recusa faixa não numérica', () => {
    expect(() => satisfaz('1.2.3', '>=abc')).toThrow();
  });

  it('recusa operator inventado em vez de aceitar tudo', () => {
    expect(() => satisfaz('1.2.3', '~>1.2.3 || >>1.0.0')).toThrow(/não suportada/);
  });
});
