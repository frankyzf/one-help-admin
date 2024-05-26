module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
    APP_ENV: true,
  },
  rules: {
    'no-param-reassign': 'off',
    'no-script-url': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'prefer-promise-reject-errors': 'off',
  },
};
