require('dotenv').config()

export default {
    api: {
        input: {
            target: `${process.env.REACT_APP_API_URL}/spec`,
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
