/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = config => config.set({
  basePath: require('path').resolve(__dirname, '..'),
  browsers: ['ChromeHeadless'],
  files: [
    {pattern: 'src/**/*.ts'},
    {pattern: 'test/**/*.ts'}
  ],
  frameworks: ['mocha', 'karma-typescript'],
  karmaTypescriptConfig: {
    reports: {
      lcovonly: {
        directory: '.',
        filename: 'lcov.info',
        subdirectory: 'var'
      }
    },
    tsconfig: 'test/tsconfig.json'
  },
  preprocessors: {
    'src/**/*.ts': 'karma-typescript',
    'test/**/*.ts': 'karma-typescript'
  },
  reporters: ['progress', 'karma-typescript'],
  singleRun: true
});
