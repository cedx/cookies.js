module.exports = config => config.set({
  browsers: ['Chrome'],
  coverageReporter: {
    dir: 'var',
    includeAllSources: true,
    subdir: '.',
    type: 'lcovonly'
  },
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
  reporters: ['progress', 'karma-typescript', 'coverage'],
  singleRun: true
});

/* TODO ???
module.exports = config => config.set({
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
}); */
