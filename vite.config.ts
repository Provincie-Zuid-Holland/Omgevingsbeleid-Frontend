/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    server: {
        host: 'localhost',
        port: 3000,
    },
    build: {
        target: 'esnext',
        outDir: 'build',
        sourcemap: true,
        rolldownOptions: {
            output: {
                codeSplitting: {
                    // optional: avoid generating tiny named chunks
                    minSize: 0,

                    groups: [
                        {
                            name: 'vendor',
                            test: /node_modules\/(react|react-dom)\//,
                        },
                        {
                            name: 'd3',
                            test: /node_modules\/d3\//,
                        },
                        {
                            name: 'tiptap',
                            test: /node_modules\/(@tiptap\/|prosemirror-tables|prosemirror-gapcursor)/,
                        },
                        {
                            name: 'leaflet',
                            test: /node_modules\/(leaflet|leaflet-draw|proj4leaflet|react-leaflet)\//,
                        },
                        {
                            name: 'zod',
                            test: /node_modules\/(zod|zod-formik-adapter)\//,
                        },
                        {
                            name: 'dompurify',
                            test: /node_modules\/dompurify\//,
                        },
                        {
                            name: 'formik',
                            test: /node_modules\/formik\//,
                        },
                        {
                            name: 'components',
                            test: /node_modules\/@pzh-ui\/components\//,
                        },
                        {
                            name: 'icons',
                            test: /node_modules\/@pzh-ui\/icons\//,
                        },
                    ],
                },
            },
        },
    },
    define: {
        'process.env': {},
    },
    resolve: {
        tsconfigPaths: true,
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    plugins: [
        react(),
        tailwindcss(),
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
