/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { InlineConfig } from 'vitest/node';
interface VitestConfigExport extends UserConfig {
    test?: InlineConfig;
}
// Simulation de __dirname pour le mode ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            include: ['src'],
            outDir: 'dist',
            rollupTypes: true // Optionnel: fusionne les types dans un seul fichier
        })
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ReactToast',
            fileName: 'react-toast',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@fortawesome/react-fontawesome',
                '@fortawesome/free-solid-svg-icons',
                '@fortawesome/fontawesome-svg-core'
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime',
                    // Ajoute ces 3 lignes pour corriger le warning :
                    '@fortawesome/react-fontawesome': 'ReactFontAwesome',
                    '@fortawesome/free-solid-svg-icons': 'freeSolidSvgIcons',
                    '@fortawesome/fontawesome-svg-core': 'FontAwesomeCore'
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        // Assure-toi que ce chemin est correct par rapport à ce fichier
        setupFiles: [resolve(__dirname, './src/test/setup.ts')],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        deps: {
            // Aide Vitest à gérer les librairies ESM/CJS mixtes (souvent utile avec FontAwesome)
            optimizer: {
                web: {
                    include: ['@fortawesome/react-fontawesome']
                }
            }
        }
    }
} as VitestConfigExport);