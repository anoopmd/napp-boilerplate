'use strict';

// TODO linting approach
// TODO testing approach
// TODO metrics approach
// TODO documentation

// Application controller for node application.
var app = exports;

// app.js
// --------------

var _ = require('lodash');
var path = require('path');
var bunyan = require('bunyan');

// Module Exports (config, pkg, logger)
// --------------

var config = app.config = require('config');
var pkg = app.pkg = require('./package.json');
var logger = app.logger = bunyan.createLogger({
  name: app.pkg.name,
  streams: [
    {
      level:  config.logger.level || 'info',
      stream: process.stdout
    }
  ]
});

logger.warn(_.pick(pkg, ['name','version']), 'app');
logger.warn({ proc: process.pid,  env: process.env.NODE_ENV }, 'process');
logger.warn({
  directory: config.util.getEnv('NODE_CONFIG_DIR'),
  sources: _.pluck(config.util.getConfigSources(), 'name')
}, 'config');

// Programmatically set app config values.
config.app = config.app || {};
config.app.name = pkg.name;
config.app.description = pkg.description;
config.app.version = pkg.version;

// Update config.paths to include full path.
for (var p in config.paths) {
  if (config.paths.hasOwnProperty(p)) {
    config.paths[p] = path.normalize(__dirname + config.paths[p]);
  }
}

// Initialize/Configure Express
// --------------

logger.info('configuring express...');

var express = require('express');
var compress = require('compression');
var favicon = require('serve-favicon');
var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var responseTime = require('response-time');
var expressBunyanLogger = require('express-bunyan-logger');
var timeout = require('connect-timeout');

// Module Export (app)
// --------------

app.express = express();
app.express.logger = logger;

// Copy config app to app locals.
_.extend(app.express.locals, config.app);

// Set timeout
var timeoutVal = config.app.timeout || '5s';
logger.info('setting "timeout" to %s', timeoutVal);
app.express.use(timeout(timeoutVal));

// Enable gzip compression.
logger.info('registering middleware "compress", "gzip" compression enabled');
app.express.use(compress());

logger.info('registering middleware, misc. functionality (json, cookie support, etc.)');
app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({ extended: false }));
app.express.use(cookieParser());
// uncomment after placing your favicon in /public
//app.express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

logger.info('registering middleware, set ID in request object & header (req.id)');
app.express.use(function(req, res, next) {
  var reqIdHeader = 'X-Request-Id';
  req.id = req.get(reqIdHeader) || uuid.v4();
  res.setHeader('X-Request-Id', req.id);
  next();
});

logger.info('registering middleware "express-bunyan-logger", "X-Response-Time" header enabled');
app.express.use(expressBunyanLogger({
  logger: logger,
  format: config.logger.format,
  excludes: config.logger.excludes,
  genReqId: function(req) {
    return req.id;
  }
}));

logger.info('registering middleware, copy reference og req.log to res.log');
app.express.use(function(req, res, next) {
  req.log.info({ method: req.method, url: req.url }, 'REQUEST');
  res.log = req.log;
  next();
});

logger.info('registering middleware "response-time", "X-Response-Time" header enabled');
app.express.use(responseTime()); // note headers are sent before actual completion of request time is not exact

// Disable "X-Powered-By"
app.express.set('x-powered-by', false);

// Public directory.
logger.info('setting "%s" as public directory', config.paths.public);
app.express.use(express.static(config.paths.public));

// View engine setup.
logger.info('setting "%s/views" as view directory', config.paths.server);
app.express.set('views', config.paths.views);
logger.info('setting "jade" as view engine');
app.express.set('view engine', 'jade');

logger.info('express configured!');

// Initialize Routes
// --------------

// TODO add to config
var index = require('./src/server/routes/index');
var api = require('./src/server/routes/api');
app.express.use('/', index);
app.express.use('/api', api);

logger.info('routes registered!');

// Register Error Handlers
// --------------

// catch 404 and forward to error handler
app.express.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.express.get('env') === 'development') {
  app.express.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.express.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
