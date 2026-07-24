import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/dinopad/',
  plugins: [react(), tailwindcss()],
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
