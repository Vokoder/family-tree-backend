import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: { import: importPlugin },
    rules: {
      eqeqeq: 'error',
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      },
      alias: {
        map: [
          ['#', './src'],
          ['#modules', './src/modules'],
          ['#shared', './src/shared'],
          ['#utils', './src/utils'],
          ['#controllers', './src/shared/controllers'],
          ['#middleware', './src/shared/middleware'],
          ['#services', './src/shared/services'],
          ['#types', './src/shared/types'],
        ]
      }
    }
  }
]
