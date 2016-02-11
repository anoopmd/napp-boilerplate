'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Customer controller (update)', function(){
  var CustomerMock, customerOptions, customerInstance, customerController;

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
      'phone':'9876543210',

      save : function (callback) {
        return callback(null, customerInstance);
      }
    };

    customerInstance = _.extend(customerOptions, {
      '__v':0,
      '_id':'569669ccde2134000ddd2542'
    });

    CustomerMock = function() {};
    CustomerMock.findById = function(options, callback){ return callback(null, customerInstance); };

    mockery.registerMock('../models/customer', CustomerMock);
    customerController =  require('../../../lib/controllers/customer');

    done();
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should find and save the customer', function(done){
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.update(customerOptions, function(err, customer){
      expect(err).to.eql(null);
      assert(spy.calledOnce);
      done();
    });
  });

  it('should return the updated customer', function(done){
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.update(customerOptions, function(err, customer){
      expect(err).to.eql(null);
      expect(customer).to.eql(customerInstance);
      assert(spy.calledOnce);
      done();
    });
  });

  it('should return null if customer is not found', function(done){
    CustomerMock.findById = function(options, callback){ return callback(null, null); };
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.update(customerOptions, function(err, customer){
      assert(spy.calledOnce);
      expect(customer).to.equal(null);
      done();
    });
  });

  it('should return error if an error occured while accessing db', function(done){
    CustomerMock.findById = function(oprions, callback){ return callback({errCode : 52}, null); };
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.update(customerOptions, function(err, customer){
      assert(spy.calledOnce);
      expect(err).to.eql({errCode : 52});
      expect(customer).to.equal(null);
      done();
    });
  });

  it('should return error if an error occured while updating the customer', function(done){
    customerOptions.save =  function(callback){ return callback({errCode : 55}, null); };
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.update(customerOptions, function(err, customer){
      assert(spy.calledOnce);
      expect(err).to.eql({errCode : 55});
      expect(customer).to.equal(null);
      done();
    });
  });
});