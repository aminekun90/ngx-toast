import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,

  plugins: [
    react()
  ],

  resolve: {
    alias: {
      '@aminekun90/react-toast': resolve(__dirname, '../react-toast/src/index.ts')
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern' 
      }
    }
  },

  build: {
    outDir: resolve(__dirname, '../../dist/demo-react'),
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    open: true,
    fs: {
      allow: ['..']
    }
  }
});