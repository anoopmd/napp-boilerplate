'use strict';

var async = require('async');

var CustomersModule = function(){};

var validator = require('./validators/customer');
var controller = require('./controllers/customer');

CustomersModule.create = function(options, callback){
  async.waterfall([
    function validate(cb){
      validator.validateCreateRequest(options, cb);
    }, 
    function execute(cb){
      controller.create(options, cb);
    }
  ],function(err, customer) {
    callback(err, customer);
  });
};

CustomersModule.find = function(options, callback){
  async.waterfall([
    function validate(cb){
      validator.validateGetRequest(options, cb);
    }, 
    function execute(cb){
      controller.find(options, cb);
    }
  ],function(err, customer) {
    callback(err, customer);
  });
};

CustomersModule.findAll = function(options, callback){
  async.waterfall([
    function execute(cb){
      controller.findAll(options, cb);
    }
  ],function(err, customer) {
    callback(err, customer);
  });
};

CustomersModule.update = function(options, callback){
  async.waterfall([
    function validate(cb){
      validator.validateUpdateRequest(options, cb);
    }, 
    function execute(cb){
      controller.update(options, cb);
    }
  ],function(err, customer) {
    callback(err, customer);
  });
};

CustomersModule.remove = function(options, callback){
  async.waterfall([
    function validate(cb){
      validator.validateDeleteRequest(options, cb);
    }, 
    function execute(cb){
      controller.remove(options, cb);
    }
  ],function(err, customer) {
    callback(err, customer);
  });
};

module.exports = CustomersModule;