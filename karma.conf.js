const {join} from 'path');
const commonjs from 'rollup-plugin-commonjs');
const nodeResolve from 'rollup-plugin-node-resolve');

module.exports = config => config.set({
  browsers: ['Chrome'],
  files: ['src/**/*.ts', 'test/**/*.ts'],
  frameworks: ['mocha', 'karma-typescript'],
  karmaTypescriptConfig: {
    include: ['test/**/*.ts'],
    tsconfig: 'tsconfig.json'
  },
  preprocessors: {
    'src/**/*.ts': ['karma-typescript', 'coverage'],
    'test/**/*.ts': ['karma-typescript']
  },
  reporters: ['progress', 'karma-typescript']
});

module.exports = config => config.set({
  browsers: ['Chrome'],
  client: {mocha: {opts: true}},
  frameworks: ['mocha'],
  files: ['test/**/*.ts'],
  reporters: ['progress', 'coverage'],
  coverageReporter: {
    dir: 'var',
    includeAllSources: true,
    subdir: '.',
    type: 'lcovonly'
  },
  preprocessors: {
    'lib/**/*.js': ['coverage'],
    'test/**/*.ts': ['typescript']
  },
  rollupPreprocessor: {
    onwarn: warning => {
      if (warning.code == 'CIRCULAR_DEPENDENCY' && warning.importer.includes(join('node_modules', 'chai'))) return;
      console.warn(`(!) ${warning.message}`);
    },
    output: {
      format: 'iife',
      name: 'cookies',
      sourcemap: 'inline'
    },
    plugins: [
      nodeResolve(),
      commonjs({namedExports: {chai: ['expect']}})
    ]
  }
});
