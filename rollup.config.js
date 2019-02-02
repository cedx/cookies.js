import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'lib/index.js',
  output: {file: 'build/cookies.js', format: 'iife', name: 'cookies'},
  plugins: [resolve(), commonjs({
    namedExports: {'node_modules/eventemitter3/index.js': ['EventEmitter']}
  })]
};
