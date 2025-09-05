import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwindcss from 'eslint-plugin-tailwindcss'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.{css}'],
    plugins: {
      tailwindcss,
    },
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
    settings: {
      tailwindcss: {
        config: 'tailwind.config.js',
      },
    },
  },
  {
    ...tailwindcss.configs['flat/recommended'][0],
    settings: {
      tailwindcss: {
        config: 'tailwind.config.js',
      },
    },
  },
])
