import eslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
   // 1) Main project files (excluding scripts)
   {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
         parser,
         parserOptions: {
            tsconfigRootDir: __dirname,
            project: ['./tsconfig.json'],
         },
      },
      plugins: {
         '@typescript-eslint': eslintPlugin,
      },
      rules: {
         '@typescript-eslint/no-explicit-any': 'error',
         '@typescript-eslint/no-unnecessary-type-assertion': 'error',
         '@typescript-eslint/consistent-type-assertions': [
            'error',
            { assertionStyle: 'never' },
         ],
         '@typescript-eslint/typedef': [
            'error',
            {
               variableDeclaration: true,
               parameter: true,
               propertyDeclaration: true,
               memberVariableDeclaration: true,
               arrowParameter: true,
               objectDestructuring: true,
               arrayDestructuring: true,
            },
         ],
      },
   },

   // 2) Scripts folder (use its own tsconfig)
   {
      files: ['scripts/**/*.ts'],
      languageOptions: {
         parser,
         parserOptions: {
            tsconfigRootDir: __dirname,
            project: ['./scripts/tsconfig.json'],
         },
      },
      plugins: {
         '@typescript-eslint': eslintPlugin,
      },
      rules: {
         '@typescript-eslint/no-explicit-any': 'error',
         '@typescript-eslint/no-unnecessary-type-assertion': 'error',
         '@typescript-eslint/consistent-type-assertions': [
            'error',
            { assertionStyle: 'never' },
         ],
         '@typescript-eslint/typedef': [
            'error',
            {
               variableDeclaration: true,
               parameter: true,
               propertyDeclaration: true,
               memberVariableDeclaration: true,
               arrowParameter: true,
               objectDestructuring: true,
               arrayDestructuring: true,
            },
         ],
      },
   },
];
