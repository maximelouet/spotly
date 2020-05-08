module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: "babel-eslint", // because somehow optional chaining throws a Parsing error in ESLint default parser
  parserOptions: {
    ecmaVersion: 2020,
  },
};
