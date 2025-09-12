# CliniFlow

Sistema de gestão clínica desenvolvido com React, TypeScript, Vite e Tailwind CSS v4.

## Tecnologias Utilizadas

- **React 19** - Framework para interface de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Ferramenta de build rápida
- **Tailwind CSS v4** - Framework CSS utility-first
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

## Configuração do Tailwind CSS v4

Este projeto utiliza o Tailwind CSS v4 com a configuração mais simples possível:

- **Zero configuração**: Sem `tailwind.config.js` nem `postcss.config.js`
- **Vite nativo**: O Vite processa o Tailwind diretamente
- **CSS puro**: Apenas `@import "tailwindcss"` no arquivo CSS principal
- **Customizações via CSS**: Use a sintaxe `@theme` diretamente no CSS quando necessário

### Arquivos de Configuração
```
src/index.css
└── @import "tailwindcss";
```

Isso é tudo! O Vite e o Tailwind v4 cuidam de todo o resto automaticamente.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
