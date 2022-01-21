module.exports = {
    api: {
        input: {
            target: 'https://api-obzh-dev.azurewebsites.net/v0.1/spec',
        },
        output: {
            mode: 'split',
            target: './src/api/fetchers.ts',
            client: 'react-query',
            prettier: true,
            override: {
                mutator: {
                    path: './src/api/instance.ts',
                    name: 'customInstance',
                },
            },
        },
    },
}
