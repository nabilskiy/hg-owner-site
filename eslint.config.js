import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'infra/cdk.out/**',
      'infra/lib/viewer-request.js',
      '.lighthouseci/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
  {
    files: ['**/*.{jsx,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ['*.{js,mjs,cjs}', 'astro.config.mjs', 'playwright.config.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        URL: 'readonly',
        module: 'readonly',
      },
    },
  },
);
