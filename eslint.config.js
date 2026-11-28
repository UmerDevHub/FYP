import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**'] },
  js.configs.recommended,
  {
    rules: {
      eqeqeq: 'error',
      'no-unused-vars': 'error',
    },
  },
  {
    files: ['apps/api/**/*.js', 'packages/shared/**/*.js', '*.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/web/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // Components used only in JSX look unused to this rule; capitalised names are components.
    rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z]' }] },
  },
];
