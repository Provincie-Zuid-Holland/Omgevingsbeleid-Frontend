/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: 'localhost',
        port: 3000,
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                dir: 'build',
                manualChunks: {
                    d3: ['d3'],
                    tiptap: [
                        '@tiptap/core',
                        '@tiptap/extension-bold',
                        '@tiptap/extension-bullet-list',
                        '@tiptap/extension-document',
                        '@tiptap/extension-history',
                        '@tiptap/extension-image',
                        '@tiptap/extension-italic',
                        '@tiptap/extension-link',
                        '@tiptap/extension-list-item',
                        '@tiptap/extension-ordered-list',
                        '@tiptap/extension-paragraph',
                        '@tiptap/extension-placeholder',
                        '@tiptap/extension-text',
                        '@tiptap/extension-underline',
                        '@tiptap/react',
                    ],
                    'react-select': ['react-select'],
                    leaflet: [
                        'leaflet',
                        'leaflet-draw',
                        'proj4leaflet',
                        'react-leaflet',
                    ],
                    zod: ['zod', 'zod-formik-adapter'],
                    dompurify: ['dompurify'],
                    formik: ['formik'],
                    'date-fns': ['date-fns/esm'],
                    pzh: ['@pzh-ui/components', '@pzh-ui/icons'],
                },
            },
        },
    },
    define: {
        'process.env': {},
    },
    plugins: [
        react(),
        viteTsconfigPaths(),
        svgrPlugin(),
        visualizer({
            template: 'treemap', // or sunburst
            gzipSize: true,
            brotliSize: true,
            filename: 'analyse.html', // will be saved in project's root
        }),
    ],
    // @ts-ignore
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        coverage: {
            reporter: ['cobertura', 'text'],
            exclude: [
                'node_modules/',
                'src/setupTests.ts',
                'src/api/fetchers.*',
            ],
        },
        restoreMocks: true,
        mockReset: true,
    },
})
