import {join} from 'path';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: join(__dirname, '../lib/index.js'),
  output: {file: join(__dirname, '../build/cookies.js'), format: 'iife', name: 'cookies'},
  plugins: [resolve(), commonjs({
    namedExports: {'node_modules/eventemitter3/index.js': ['EventEmitter']}
  })]
};
