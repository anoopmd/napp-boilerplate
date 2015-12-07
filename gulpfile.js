'use strict';

// TODO make app modular to support multiple SPAs

/**
 * Module dependencies.
 */

var gulp     = require('gulp');
var $        = require('gulp-load-plugins')();
var pkg      = require('./package.json');
var bowerIsh = require('main-bower-files')();
var args     = require('yargs').argv;
var config   = require('config');
var path     = require('path');
var nib      = require('nib');

/**
 * Environment variables.
 */

var env = process.env.NODE_ENV || args.env || 'development';
var isProduction = env === 'production';

var paths = {
      js:    ['src/**/*.js', 'config/**/*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**'],
      html:  ['src/client/**/*.html'],
      index: ['public/index.html'],
      css:   ['public/css/*.css', '!bower_components/**'],
      styl:  ['src/client/app/**/*.styl', '!src/client/app/stylus/**'],
      appJS: ['src/client/app/**/*.js'],
      tpls:  ['src/client/app/**/*.tpl.html', '!src/client/app/app.tpl.html'],
      appTpl:['src/client/app/app.tpl.html'],
      config:['config/**/*.yml']
    };
var dist = {
      pub: 'public/app',
      css: 'public/app/css',
      js:  'public/app/js'
    };
var tasks = {
      default: ['clean.build'],
      development: ['default', 'watch', 'server'],
      build: ['index', 'app', 'app.templates', 'stylus', 'vendor']
    };

// gulp filters
var jsFilter  = $.filter('**/*.js');
var cssFilter = $.filter('**/*.css');

/**
 * Tasks.
 */

gulp.task('build', tasks.build);

gulp.task('clean', function() {
  return gulp.src('public/app/**/*', {read: false})
    .pipe($.rimraf());
});

gulp.task('jshint', function() {
  return gulp.src(paths.js)
    .pipe($.jshint())
    .pipe($.count('## files linted!'))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('index', function() {
  gulp.src(paths.appTpl)
    .pipe($.if(isProduction, $.minifyHtml({empty:true, appre:true, quotes:true})))
    .pipe($.concat('index.html'))
    .pipe(gulp.dest(dist.pub))
    .pipe($.livereload());
});

gulp.task('app', ['jshint'], function() {
  gulp.src(paths.appJS)
    .pipe($.wrap('!function(){\n<%= contents %>\n}();'))
    .pipe($.concat('app.js'))
    .pipe($.if(isProduction, $.uglify()))
    .pipe(gulp.dest(dist.js))
    .pipe($.livereload());
});

gulp.task('app.templates', function() {
  gulp.src(paths.tpls)
    .pipe($.if(isProduction, $.minifyHtml({empty:true, appre:true, quotes:true})))
    .pipe($.ngHtml2js({moduleName:'app.templates'}))
    .pipe($.concat('app.templates.js'))
    .pipe($.if(isProduction, $.uglify()))
    .pipe(gulp.dest(dist.js))
    .pipe($.livereload());
});

gulp.task('stylus', function() {
  gulp.src(paths.styl)
    .pipe($.stylus({
      errors: true,
      use:[nib()],
      // TODO better way to include
      import: ['variables.styl', 'helpers.styl'],
      paths: ['src/client/app/stylus']
    }))
    .pipe($.concat('app.css'))
    .pipe($.if(isProduction, $.minifyCss()))
    .pipe(gulp.dest(dist.css))
    .pipe($.livereload());
});

// concatenate and compress bower_components to vendor.{js|css}
gulp.task('vendor', function() {
  // build vendor js files
  gulp.src(bowerIsh)
    .pipe(jsFilter)
    .pipe($.concat('vendor.js'))
    .pipe($.if(isProduction, $.uglify()))
    .pipe(gulp.dest(dist.js));

  // build vendor css files
  gulp.src(bowerIsh)
    .pipe(cssFilter)
    .pipe($.concat('vendor.css'))
    .pipe($.if(isProduction, $.minifyCss()))
    .pipe(gulp.dest(dist.css));
});

gulp.task('watch', ['clean.build'], function() {
  $.livereload.listen();
  gulp.watch(paths.appJS, ['jshint', 'app']);
  gulp.watch(paths.tpls, ['app.templates']);
  gulp.watch(paths.appTpl, ['index']);
  gulp.watch(paths.styl, ['stylus']);
  gulp.watch(paths.config, []);
});

gulp.task('server', ['clean.build'], function() {
  $.nodemon({
    script: 'bin/www',
    ext: 'html jade js',
    env: { NODE_ENV: env },
    ignore: ['public/*', 'src/client/*', 'node_modules/*'],
    tasks: ['jshint']
  }).on('restart', function() {
    setTimeout(function() {
      $.livereload.changed();
    }, 2000);
  });
});

// register aliases
gulp.task('clean.build', ['clean'], function(){
  gulp.start(['build']);
});
gulp.task('production', [], function(){
  isProduction = true;
  gulp.start(['default']);
});
gulp.task('development', tasks.development);
gulp.task('default', tasks.default);
