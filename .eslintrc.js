const schemaJson = require('./schema.json');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  overrides: [
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        'react/prop-types': 0,
        'jsx-a11y/media-has-caption': 0,
        'no-unused-vars': 0,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'graphql', 'react-hooks', '@typescript-eslint'],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': [
      1,
      {
        html: 'ignore',
        exceptions: [
          "WrappedComponent",
          "Component",
          "Form.Item",
          "Item",
        ],
      },
    ],
    'react/display-name': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 0,
    'graphql/template-strings': [
      'error',
      {
        env: 'literal',
        tagName: 'MyChoice',
        validators: 'all',
        schemaJson,
      },
    ],
    'graphql/named-operations': [
      'warn',
      {
        schemaJson,
      },
    ],
    'arrow-parens': ['off', 'as-needed'],
    'arrow-body-style': [0],
    'operator-linebreak': ['off'],
    'react/jsx-indent': ['warn'],
    'import/extensions': [2, 'never'],
    'object-curly-newline': ['off'],
    'import/prefer-default-export': 'off',
    'no-unneeded-ternary': ['off'],
    indent: ['warn', 2],
    'dot-notation': [0],
    'no-nested-ternary': [0],
    'no-underscore-dangle': ['error', { allow: ['_id', '__typename', '__ref'] }],
    camelcase: [0],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'linebreak-style': ['warn', 'unix'],
    'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
};
