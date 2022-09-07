module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'eol-last': ['error', 'always'],
    'no-console': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-undef': 'error',
  },
};
