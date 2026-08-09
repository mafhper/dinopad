import { describe, expect, it } from 'vitest';
import { textOnly } from '../../scripts/content/text-only';

describe('textOnly', () => {
  it('remove marcação e decodifica uma camada de entidades HTML conhecidas', () => {
    expect(textOnly('<b>CC BY 4.0</b>&nbsp;&quot;Museu&quot; &amp; arquivo &#39;A&#39;'))
      .toBe('CC BY 4.0 "Museu" & arquivo \'A\'');
  });

  it('não decodifica novamente entidades produzidas pela primeira decodificação', () => {
    expect(textOnly('&amp;quot;Museu&amp;quot; &amp;#39;A&amp;#39; &amp;amp;'))
      .toBe('&quot;Museu&quot; &#39;A&#39; &amp;');
  });
});
