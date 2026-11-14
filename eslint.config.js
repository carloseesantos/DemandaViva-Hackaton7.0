import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules', 'AG-03_BRAND'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  // Fronteiras entre camadas (ver docs/ARCHITECTURE.md §4).
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react', 'react-dom', 'react-router'], message: 'src/domain é TypeScript puro, sem UI.' },
            { group: ['@supabase/*'], message: 'src/domain não acessa persistência.' },
            {
              group: ['**/data/**', '**/repositories/**', '**/services/**', '**/pages/**', '**/features/**', '**/components/**', '**/app/**'],
              message: 'src/domain não depende de outras camadas.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/data/**/*.ts', 'src/services/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react', 'react-dom', 'react-router'], message: 'Fixtures e serviços de domínio são TypeScript puro, sem UI.' },
            { group: ['@supabase/*'], message: 'Fixtures e serviços não acessam persistência remota.' },
            {
              group: ['**/repositories/**', '**/pages/**', '**/features/**', '**/components/**', '**/app/**'],
              message: 'Dependência só para src/domain (e src/data, no caso de serviços).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/pages/**/*.{ts,tsx}', 'src/features/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@supabase/*'], message: 'UI não usa supabase-js diretamente; use DemandRepository via useDependencies().' },
          ],
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'eslint.config.js', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
  },
);
