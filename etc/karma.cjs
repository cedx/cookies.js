module.exports = configuration => configuration.set({
  basePath: '..',
  browsers: ['ChromeHeadless'],
  coverageIstanbulInstrumenter: {
    esModules: true
  },
  coverageIstanbulReporter: {
    dir: 'var',
    //'report-config': {lcovonly: {subdir: '.'}},
    reports: ['lcovonly']
  },
  files: [
    {pattern: 'lib/**/*.js', type: 'module'},
    {pattern: 'test/**/*.js', type: 'module'}
  ],
  frameworks: ['mocha', 'chai'],
  preprocessors: {
    'lib/**/*.js': 'karma-coverage-istanbul-instrumenter'
  },
  reporters: ['progress', 'coverage-istanbul'],
  singleRun: true
});
