import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [
    react(),
    polyfillNode(), // Add the polyfill plugin
  ],
  define: {
    global: 'globalThis', // Polyfill `global` using `globalThis`
  },
});
