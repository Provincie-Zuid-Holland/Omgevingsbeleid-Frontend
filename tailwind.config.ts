import type { Config } from 'tailwindcss'

export default {
    presets: [require('@pzh-ui/css/config')],
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './node_modules/@pzh-ui/components/dist/**/*.{js,jsx,ts,tsx}',
        './index.html',
    ],
    theme: {
        extend: {
            margin: {
                '-570': '-28.5rem',
                '-840': '-42rem',
            },
            maxWidth: {
                570: '28.5rem',
            },
            minWidth: {
                570: '28.5rem',
            },
            boxShadow: {
                pane: '0px 100px 80px rgba(0, 0, 0, 0.07), 0px 41.7776px 33.4221px rgba(0, 0, 0, 0.0503198), 0px 22.3363px 17.869px rgba(0, 0, 0, 0.0417275), 0px 12.5216px 10.0172px rgba(0, 0, 0, 0.035), 0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725), 0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802)',
            },
            zIndex: {
                1: '1',
            },
        },
    },
} satisfies Config
