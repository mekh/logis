module.exports = {
  extends: 'airbnb-base',
  rules: {
    indent: [2, 2],
    'no-console': 0,
    'consistent-return': 0,
    'arrow-parens': 0,
    'max-len': ['error', { code: 140 }],
    'object-curly-newline': 0,
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
  plugins: ['jest'],
  env: {
    'jest/globals': true,
  },
};
