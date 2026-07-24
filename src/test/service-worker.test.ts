import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');

describe('atualização offline', () => {
  it('versiona o cache por build e força a verificação do service worker', () => {
    const serviceWorker = readFileSync(resolve(root, 'public/sw.js'), 'utf8');
    const manifestBuilder = readFileSync(resolve(root, 'scripts/build-sw-manifest.ts'), 'utf8');
    const main = readFileSync(resolve(root, 'src/main.tsx'), 'utf8');

    expect(serviceWorker).toContain('__DINOPAD_CACHE_VERSION__');
    expect(manifestBuilder).toContain("createHash('sha256')");
    expect(manifestBuilder).toContain("replaceAll('__DINOPAD_CACHE_VERSION__', cacheVersion)");
    expect(main).toContain("updateViaCache: 'none'");
    expect(main).toContain("addEventListener('controllerchange'");
  });
});
