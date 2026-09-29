import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // `scripts/` entra porque o gate de integridade da árvore (`deps-check`) mora
    // ali, e um gate sem prova de que erra para o lado certo é decoração. A
    // suíte do app continua exatamente onde estava.
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
});
