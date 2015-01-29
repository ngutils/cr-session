module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
        'bower_components/angular/angular.min.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-local-storage/dist/angular-local-storage.js',
        'cr-session.js',
        'spec/*.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
