module.exports = {
    corePlugins: {
        fontWeight: false,
        lineHeight: false,
    },
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
            // https://wapenfeiten.zuid-holland.nl/bouwstenen/kleuren
            colors: {
                'gray-50': {
                    default: '#f9fafb',
                },
                'pzh-red': {
                    default: '#d11f3d',
                    light: '#eb7085',
                    dark: '#97162c',
                },
                'pzh-yellow': {
                    default: '#efcc36',
                    light: '#f1db7e',
                    dark: '#c6a410',
                },
                'pzh-blue': {
                    default: '#281f6b',
                    light: '#7badde',
                    dark: '#16113b',
                    'super-light': '#ececf3', // Custom
                },
                'pzh-pink': {
                    default: '#aa0067',
                    light: '#d76aac',
                    dark: '#750047',
                },
                'pzh-orange': {
                    default: '#ff6b02',
                    light: '#fba66a',
                    dark: '#b24a00',
                },
                'pzh-apple-green': {
                    default: '#76bc21',
                    light: '#add57d',
                    dark: '#629623',
                },
                'pzh-green': {
                    default: '#00804d',
                    light: '#61b375',
                    dark: '#004d2e',
                },
                'pzh-purple': {
                    default: '#503d90',
                    light: '#9b99cc',
                    dark: '#32265a',
                },
                'pzh-cool-gray': {
                    default: '#838383',
                    light: '#bfbfbf',
                    dark: '#5c5c5c',
                },
                'pzh-warm-gray': {
                    default: '#847062',
                    light: '#beb1a7',
                    dark: '#584b41',
                },
            },
        },
    },
}
