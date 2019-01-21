const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: 'lib/index.js',
  output: {file: 'build/cookies.js', format: 'iife', name: 'Cookies'},
  plugins: [commonjs()]
};
