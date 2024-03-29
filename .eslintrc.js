module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
    'jest': true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'ecmaFeatures': {
      jsx: true,
    },
    'ecmaVersion': 6,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'react-hooks',
    'import',
  ],
  'rules': {
    'import/newline-after-import': ['error', { 'count': 2 }],
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
      { 'avoidEscape': true },
    ],
    'semi': [
      'error',
      'never',
    ],
    'no-console': [
      'warn',
      { allow: ['error'] },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'eol-last': [
      'error',
      'always',
    ],
    'no-trailing-spaces': [
      'error',
    ],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
  },
}
