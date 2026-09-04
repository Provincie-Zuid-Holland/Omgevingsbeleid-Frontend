import 'dotenv/config'

import { defineConfig } from 'orval'

const getApiUrl = (): string => {
    const environment = process.env.VITE_API_ENV

    const url = {
        dev: process.env.VITE_API_URL_DEV,
        test: process.env.VITE_API_URL_TEST,
        acc: process.env.VITE_API_URL_ACC,
        prod: process.env.VITE_API_URL_PROD,
    }[environment ?? 'dev']

    if (!url) {
        throw new Error(
            `No API URL configured for environment "${environment}"`
        )
    }

    return url
}

export default defineConfig({
    api: {
        input: {
            target: `${getApiUrl()}/openapi.json`,
        },
        output: {
            mode: 'split',
            target: './src/api/fetchers.ts',
            client: 'react-query',
            httpClient: 'axios',
            formatter: 'prettier',
            mock: true,
            override: {
                mutator: {
                    path: './src/api/instance.ts',
                    name: 'customInstance',
                },
            },
        },
    },
})
