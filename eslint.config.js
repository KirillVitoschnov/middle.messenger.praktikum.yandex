import globals from 'globals';
import tsLint from 'typescript-eslint';
import jsLint from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tsLint.config(
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tsLint.plugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        parser: tsLint.parser,
        tsconfigRootDir: './',
      },
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['src/**/*.{js,ts}'],
    rules: {
      ...eslintConfigPrettier.rules,
      'no-var': 'error',
      'prefer-const': 'error',
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
        },
      ],
      'no-use-before-define': 'off',
      'no-this-before-super': 'off',
      'no-undef-init': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },
);
