const resolve = require('rollup-plugin-node-resolve');
module.exports = {
  input: 'lib/index.mjs',
  output: {file: 'build/cookies.js', format: 'iife', name: 'cookies'},
  plugins: [resolve()]
};
