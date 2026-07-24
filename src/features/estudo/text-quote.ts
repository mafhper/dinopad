import type { AnotacaoLeitura } from '../../content/schema';

export function reanchorTextQuote(text: string, selector: AnotacaoLeitura['seletor']): number {
  let fromIndex = 0;
  let fallback = -1;
  while (fromIndex <= text.length) {
    const index = text.indexOf(selector.exact, fromIndex);
    if (index < 0) return fallback;
    fallback = fallback < 0 ? index : fallback;
    const prefixMatches = !selector.prefix
      || text.slice(Math.max(0, index - selector.prefix.length), index) === selector.prefix;
    const suffixStart = index + selector.exact.length;
    const suffixMatches = !selector.suffix
      || text.slice(suffixStart, suffixStart + selector.suffix.length) === selector.suffix;
    if (prefixMatches && suffixMatches) return index;
    fromIndex = index + Math.max(1, selector.exact.length);
  }
  return fallback;
}
