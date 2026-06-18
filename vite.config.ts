/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'

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
        dedupe: [
            'react',
            'react-dom',
            '@tiptap/core',
            '@tiptap/react',
            '@tiptap/pm',
            'prosemirror-model',
            'prosemirror-state',
            'prosemirror-view',
            'prosemirror-transform',
            'prosemirror-schema-list',
        ],
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
        pool: 'threads',
        environment: 'jsdom',
        setupFiles: './src/setupTests.tsx',
        coverage: {
            provider: 'v8',
            reporter: ['cobertura', 'text'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/**/*.test.{ts,tsx}',
                'src/**/*.stories.{ts,tsx}',
                'src/setupTests.tsx',
                'src/api/fetchers.*',
                'src/index.tsx',
            ],
        },
        restoreMocks: true,
        mockReset: true,
        server: {
            deps: { inline: ['@pzh-ui/components'] },
        },
    },
})
