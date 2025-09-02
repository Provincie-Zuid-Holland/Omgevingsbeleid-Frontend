/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    server: {
        host: 'localhost',
        port: 3000,
    },
    build: {
        target: 'esnext',
        outDir: 'build',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
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
                        'prosemirror-tables',
                        'prosemirror-gapcursor',
                    ],
                    leaflet: [
                        'leaflet',
                        'leaflet-draw',
                        'proj4leaflet',
                        'react-leaflet',
                    ],
                    zod: ['zod', 'zod-formik-adapter'],
                    dompurify: ['dompurify'],
                    formik: ['formik'],
                    components: ['@pzh-ui/components'],
                    icons: ['@pzh-ui/icons'],
                },
            },
        },
    },
    define: {
        'process.env': {},
    },
    plugins: [
        react(),
        tailwindcss(),
        viteTsconfigPaths(),
        svgrPlugin(),
        visualizer({
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
            filename: 'analyse.html',
        }),
    ],
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
        server: {
            deps: { inline: ['@pzh-ui/components'] },
        },
    },
})
