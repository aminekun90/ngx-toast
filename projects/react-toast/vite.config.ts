import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react(),
        dts({ insertTypesEntry: true, include: ['src'], outDir: 'dist' })
    ],
    build: {
        outDir: 'dist',
        lib: {
            // C'EST CETTE LIGNE QUI EMPÊCHE L'ERREUR INDEX.HTML
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ReactToast',
            fileName: 'react-toast',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            // On ne package pas React dans la lib
            external: ['react', 'react-dom', 'react/jsx-runtime', '@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/fontawesome-svg-core'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime'
                }
            }
        }
    }
});