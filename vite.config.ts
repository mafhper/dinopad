import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cabecalho } from './scripts/dev/header-plugin.ts';

export default defineConfig({
  base: '/dinopad/',
  // O cabeçalho entra depois do `listening`, para mostrar a porta que o Vite
  // realmente escutou — e não a que foi pedida. Ver `scripts/dev/header-plugin.ts`.
  plugins: [cabecalho(), react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/.dev/**', '**/.playwright-cli/**'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
