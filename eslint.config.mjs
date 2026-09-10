import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
    globalIgnores([
        'build/**',
        'coverage/**',
        'dist/**',
        '.yarn/**',
        'public/**',
        'src/api/fetchers*.ts',
        'src/css/tailwind.css',
    ]),
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            parserOptions: {},
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'jsx-a11y/anchor-is-valid': 'warn',
            'jsx-a11y/alt-text': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-expressions': 'warn',
            'no-case-declarations': 'warn',
            'no-empty-pattern': 'warn',
            'no-extra-boolean-cast': 'off',
            'no-irregular-whitespace': 'warn',
            'no-unsafe-optional-chaining': 'warn',
        },
        plugins: {
            'jsx-a11y': jsxA11y,
            'react-hooks': reactHooks,
        },
    },
    {
        files: ['*.config.{js,mjs,ts}', 'orval.config.ts', 'vite.config.ts'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            tseslint.configs.disableTypeChecked,
        ],
    }
)
