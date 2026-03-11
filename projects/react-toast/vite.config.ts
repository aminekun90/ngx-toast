/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
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
            rollupTypes: true 
        }),
        viteStaticCopy({
            targets: [
                { src: 'README.md', dest: '.' },
                { src: 'LICENSE', dest: '.' },
                { src: 'package.json', dest: '.' },
                { src: 'docs/**', dest: 'docs' }
            ]
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
            // FontAwesome n'est pas ici, il sera donc inclus dans le bundle
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime'
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime'
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [resolve(__dirname, './src/test/setup.ts')],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        deps: {
            optimizer: {
                web: {
                    include: ['@fortawesome/react-fontawesome']
                }
            }
        }
    }
} as VitestConfigExport);