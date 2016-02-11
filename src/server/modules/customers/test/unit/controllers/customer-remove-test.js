'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Customer controller (remove)', function(){
  var CustomerMock, customerOptions, customerInstance, customerController;

  beforeEach(function(done){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    customerInstance = {
      '__v':0,
      '_id':'569669ccde2134000ddd2542',
      'firstName':'James',
      'lastName':'Bond',
      'email':'jb@gmail.com',
      'dob':'1985-1-1',
      'address':'#47, Brooks Suite, LA',
      'phone':'9876543210',

      remove : function (callback) {
        return callback(null);
      }
    };

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

  it('should find and remove the customer', function(done){
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.remove({id : '569669ccde2134000ddd2542'}, function(err){
      expect(err).to.eql(null);
      assert(spy.calledOnce);
      expect(spy.getCall(0).args[0]).to.equal('569669ccde2134000ddd2542');
      done();
    });
  });

  it('should return error if an error occured while accessing db', function(done){
    CustomerMock.findById = function(oprions, callback){ return callback({errCode : 52}, null); };
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.find({id : '569669ccde2134000ddd2542'}, function(err, customer){
      assert(spy.calledOnce);
      expect(err).to.eql({errCode : 52});
      expect(customer).to.equal(null);
      done();
    });
  });

  it('should return error if an error occured while removing the customer', function(done){
    customerInstance.remove =  function(callback){ return callback({errCode : 55}, null); };
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.remove({id : '569669ccde2134000ddd2542'}, function(err, customer){
      assert(spy.calledOnce);
      expect(err).to.eql({errCode : 55});
      expect(customer).to.equal(null);
      done();
    });
  });

  it('should return error if unable to find the customer', function(done){
    CustomerMock.findById = function(options, callback){ return callback({errCode : 56}, null); };
    var spy = sinon.spy(CustomerMock, 'findById');

    customerController.remove({id : '569669ccde2134000ddd2542'}, function(err, customer){
      assert(spy.calledOnce);
      expect(err).to.eql({errCode : 56});
      expect(customer).to.equal(null);
      done();
    });
  });

  it('should not call remove if the employee was not found', function(done){
    CustomerMock.findById = function(options, callback){ return callback(null, null); };
    var spy = sinon.spy(customerInstance, 'remove');

    customerController.remove({id : '569669ccde2134000ddd2542'}, function(err, customer){
      assert(!spy.called);
      expect(err).to.eql(null);
      expect(customer).to.equal(null);
      done();
    });
  });
});