'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Customer controller (findAll)', function(){
  var CustomerMock, customerOptions, customerInstances, customerController;

  beforeEach(function(done){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    customerInstances = [{
      '__v':0,
      '_id':'56a1fdcf1774175c0e071682',
      'firstName':'James',
      'lastName':'Bond',
      'email':'jb@gmail.com',
      'dob':'1985-1-1',
      'address':'#47, Brooks Suite, LA',
      'phone':'9876543210'
    }, {
      '__v':0,
      '_id':'56a1fdcf1774175c0e048265',
      'firstName':'Tom',
      'lastName':'Hanks',
      'email':'th@gmail.com',
      'dob':'1985-1-1',
      'address':'#81/1, John Residency, LA',
      'phone':'9966996699'
    }];

    CustomerMock = function() {};
    CustomerMock.find = function(options, callback){ return callback(null, customerInstances); };

    mockery.registerMock('../models/customer', CustomerMock);
    customerController =  require('../../../lib/controllers/customer');

    done();
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should find and return all the customers', function(done){
    var spy = sinon.spy(CustomerMock, 'find');

    customerController.findAll({}, function(err, customers){
      expect(err).to.eql(null);
      assert(spy.calledOnce);
      expect(customers).to.eql(customerInstances);
      done();
    });
  });

  it('should return null if no customers are found', function(done){
    CustomerMock.find = function(options, callback){ return callback(null, null); };

    var spy = sinon.spy(CustomerMock, 'find');

    customerController.findAll({}, function(err, customers){
      assert(spy.calledOnce);
      expect(err).to.equal(null);
      expect(customers).to.eql(null);
      done();
    });
  });

  it('should return error if an error occured while accessing db', function(done){
    CustomerMock.find = function(options, callback){ return callback({errCode : 52}, null); };
    var spy = sinon.spy(CustomerMock, 'find');

    customerController.findAll({}, function(err, customer){
      assert(spy.calledOnce);
      expect(err).to.eql({errCode : 52});
      expect(customer).to.equal(null);
      done();
    });
  });
});