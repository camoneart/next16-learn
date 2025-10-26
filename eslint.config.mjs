import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // Custom rules
  {
    rules: {
      // refresh/page.tsxでMath.random()を意図的に使用するため無効化
      'react-hooks/purity': 'off',
    },
  },
  // Prettierとの競合を防ぐ（最後に追加が重要）
  prettier,
]);

export default eslintConfig;
