module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'react-app',
    'airbnb',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-underscore-dangle': 0,
    'react/jsx-filename-extension': 0,
    'react/no-array-index-key': 0,
    'react/prop-types': 0,
  },
};
