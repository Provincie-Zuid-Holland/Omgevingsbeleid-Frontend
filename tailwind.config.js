module.exports = {
    purge: ['./src/**/*.js'],
    theme: {
        extend: {
            colors: {
                'gray-50': {
                    default: '#f9fafb',
                },
                primary: {
                    default: '#002f65',
                    darker: '#00234c',
                    'super-light': '#ececf3',
                },
                secondary: {
                    default: '#CC9900',
                },
            },
        },
    },
}
