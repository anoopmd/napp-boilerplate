'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Customer controller (create)', function(){
  var CustomerMock, customerOptions, customerInstance;

  beforeEach(function(done){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    customerOptions = {
      'firstName':'James',
      'lastName':'Bond',
      'email':'jb@gmail.com',
      'dob':'1985-1-1',
      'address':'#47, Brooks Suite, LA',
      'phone':'9876543210'
    };

    customerInstance = _.extend(customerOptions, {
      '__v':0,
      '_id':'569669ccde2134000ddd2542'
    });

    CustomerMock = function() {};
    CustomerMock.prototype.save = function(callback){ return callback(null, customerInstance); };

    mockery.registerMock('../models/customer', CustomerMock);

    done();
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should create a customer', function(done){
    var spy = sinon.spy(CustomerMock.prototype, 'save');
    var customerController =  require('../../../lib/controllers/customer');

    customerController.create(customerOptions, function(err, customer){
      expect(err).to.eql(null);
      assert(spy.calledOnce);
      done();
    });
  });

  it('should return the saved customer', function(done){
    var spy = sinon.spy(CustomerMock.prototype, 'save');
    var customerController =  require('../../../lib/controllers/customer');

    customerController.create(customerOptions, function(err, customer){
      expect(err).to.eql(null);
      expect(customer).to.eql(customerInstance);
      assert(spy.calledOnce);
      done();
    });
  });

  it('should return error if save fails', function(done){
    var error = {
      code : 153
    };

    CustomerMock.prototype.save = function(callback){ return callback(error, null); };
    var spy = sinon.spy(CustomerMock.prototype, 'save');
    var customerController =  require('../../../lib/controllers/customer');

    customerController.create(customerOptions, function(err, customer){
      assert(spy.calledOnce);
      expect(customer).to.eql(null);
      expect(err).to.eql(error);
      done();
    });
  });
});