module.exports = {
    purge: ['./src/**/*.js'],
    variants: {
        pointerEvents: ['responsive', 'hover'],
        display: ['responsive', 'hover', 'group-hover'],
        textDecoration: ['responsive', 'hover', 'focus', 'group-hover'],
        roundedFull: ['responsive', 'focus'],
        margin: ['responsive', 'group-hover'],
    },
    theme: {
        extend: {
            colors: {
                'gray-50': {
                    default: '#f9fafb',
                },
                primary: {
                    default: '#002f65',
                    darker: '#00234c',
                    light: '#f2f2f7',
                    'super-light': '#ececf3',
                    'super-dark': '#000066',
                },
                secondary: {
                    default: '#CC9900',
                },
                'theme-red': {
                    default: '#990000',
                },
                'theme-orange': {
                    default: '#CC9900',
                },
            },
        },
    },
}
