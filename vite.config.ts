import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    sourcemap: true,
    target: 'es2022'
  },
  test: {
    environment: 'node',
    globals: true
  }
});
