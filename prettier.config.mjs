/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
    plugins: [
        '@ianvs/prettier-plugin-sort-imports',
        'prettier-plugin-tailwindcss',
    ],

    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    arrowParens: 'avoid',
    singleQuote: true,
    bracketSameLine: true,
    printWidth: 80,
    endOfLine: 'lf',

    importOrder: [
        '<BUILTIN_MODULES>',
        '',
        '^react$',
        '^react-dom$',
        '',
        '^@pzh-ui/(.*)$',
        '',
        '<THIRD_PARTY_MODULES>',
        '',
        '^@/(.*)$',
        '',
        '^\\.\\.',
        '^\\.',
    ],

    importOrderCaseSensitive: false,

    tailwindStylesheet: './src/css/tailwind.src.css',
    tailwindFunctions: ['cn', 'cva'],
}
