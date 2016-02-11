'use strict';

var gulp     = require('gulp');
var $        = require('gulp-load-plugins')();
var pkg      = require('./package.json');

var paths = {
      src        :    ['lib/**/*.js'],
      js         :    ['lib/**/*.js', 'test/**/*.js'],
      unit       :    ['test/unit/**/*.js'],
      acceptance :    ['test/acceptance/**/*.js']
    }

var tasks = {
      test: ['unit', 'acceptance', 'cover']
    };

gulp.task('jshint', function() {
  return gulp.src(paths.js)
    .pipe($.jshint())
    .pipe($.count('## files linted!'))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('unit', () => {
  return gulp.src(paths.unit, {read: false})
      .pipe($.mocha({reporter: 'spec'}))
      .on('error', $.util.log);
});

gulp.task('acceptance', () => {
  return gulp.src(paths.acceptance, {read: false})
    .pipe($.mocha({reporter: 'spec'}))
    .on('error', $.util.log);
});

gulp.task('pre-cover', function () {
  return gulp.src(paths.src)
    // Covering files
    .pipe($.istanbul())
    // Force `require` to return covered files
    .pipe($.istanbul.hookRequire());
});

gulp.task('cover', ['pre-cover'], function () {
  return gulp.src(paths.unit)
    .pipe($.mocha())
    // Creating the reports after tests ran
    .pipe($.istanbul.writeReports())
    // Enforce a coverage of at least 80%
    .pipe($.istanbul.enforceThresholds({ thresholds: { global: 80 } }));
});

gulp.task('test', tasks.test);