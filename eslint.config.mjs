import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
    },
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    {
        languageOptions: { globals: globals.browser },
        plugins: {
            '@stylistic/ts': stylisticTs,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    stylistic.configs.customize({
        // the following options are the default values
        indent: 4,
        quotes: 'single',
        semi: true,
        jsx: false,
        // ...
    }),
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 2,
        },
    },
];
