module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "import/extensions": 0,
    "no-param-reassign": 0,
    "max-len": 0,
    "indent": 0,
    "no-confusing-arrow": 0,
    "no-trailing-spaces": 0,
    "arrow-parens":0,
    "import/prefer-default-export":0,
    "comma-dangle":0,
    "no-nested-ternary": 0,
    "no-plusplus": 0,
    "no-prototype-builtins": 0
  },
};
