module.exports = {
    api: {
        input: {
            target: 'https://api-obzh-dev.azurewebsites.net/v0.1/spec',
        },
        output: {
            mode: 'split',
            target: './api/fetchers.ts',
            override: {
                mutator: {
                    path: './api/instance.ts',
                    name: 'customInstance',
                },
            },
        },
    },
}
