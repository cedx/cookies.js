module.exports = configuration => configuration.set({
  basePath: '..',
  browsers: ['ChromeHeadless'],
  coverageIstanbulReporter: {
    dir: 'var',
    reports: ['lcovonly']
  },
  files: [
    {pattern: 'lib/**/*.js', type: 'module'},
    {pattern: 'test/**/*.js', type: 'module'}
  ],
  frameworks: ['mocha', 'chai'],
  reporters: ['progress', 'coverage-istanbul'],
  singleRun: true
});
