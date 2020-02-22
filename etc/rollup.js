export default {
  context: 'this',
  input: 'lib/index.js',
  output: {
    file: 'build/cookies.js',
    format: 'iife',
    name: 'cookies'
  }
};
