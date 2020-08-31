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
  ],
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    ecmaVersion: 6,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'react-hooks',
  ],
  'rules': {
    'indent': [
      'error',
      2,
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
      'warn'
    ],
    'comma-dangle': [
      'error',
      'only-multiline'
    ],
    'eol-last': [
      'error',
    ],
    'no-trailing-spaces': [
      'error',
    ],
  },
}
