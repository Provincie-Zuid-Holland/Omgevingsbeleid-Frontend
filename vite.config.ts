/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { PluginOption, defineConfig } from 'vite'
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
                    d3: ['d3', 'd3-symbol-extra'],
                    tiptap: [
                        '@tiptap/react',
                        '@tiptap/core',
                        '@tiptap/starter-kit',
                        '@tiptap/extension-underline',
                        '@tiptap/extension-image',
                        '@tiptap/extension-link',
                        '@tiptap/extension-placeholder',
                    ],
                    'react-select': ['react-select'],
                    framer: ['framer-motion'],
                    leaflet: [
                        'leaflet',
                        'leaflet-draw',
                        'proj4leaflet',
                        'react-leaflet',
                    ],
                    zod: ['zod', 'zod-formik-adapter'],
                    dompurify: ['dompurify'],
                    lodash: [
                        'lodash',
                        'lodash-es',
                        'lodash.groupby',
                        'lodash.clonedeep',
                    ],
                    formik: ['formik'],
                    'date-fns': ['date-fns/esm'],
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
        }) as PluginOption,
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        coverage: {
            reporter: ['text', 'html'],
            exclude: ['node_modules/', 'src/setupTests.ts'],
        },
    },
})
