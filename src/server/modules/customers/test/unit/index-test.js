'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Customer Module', function(){
  var ControllerMock, ValidatorMock, customerOptions, customerInstance, customerModule;

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

    ControllerMock = function() {};
    ControllerMock.create = function(options, callback){ return callback(null, customerInstance); };
    ControllerMock.find = function(options, callback){ return callback(null, customerInstance); };
    ControllerMock.findAll = function(options, callback){ return callback(null, customerInstance); };
    ControllerMock.update = function(options, callback){ return callback(null, customerInstance); };
    ControllerMock.remove = function(options, callback){ return callback(null); };

    ValidatorMock = function() {};
    ValidatorMock.validateCreateRequest = function(options, callback){ return callback(null); };
    ValidatorMock.validateGetRequest = function(options, callback){ return callback(null); };
    ValidatorMock.validateUpdateRequest = function(options, callback){ return callback(null); };
    ValidatorMock.validateDeleteRequest = function(options, callback){ return callback(null); };

    mockery.registerMock('./validators/customer', ValidatorMock);
    mockery.registerMock('./controllers/customer', ControllerMock);

    customerModule =  require('../../index');

    done();
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should create the customer', function(done){
    var controllerSpy = sinon.spy(ControllerMock, 'create');
    var validatorSpy = sinon.spy(ValidatorMock, 'validateCreateRequest');

    customerModule.create(customerOptions, function(err, customer){
      expect(err).to.eql(null);
      assert(controllerSpy.calledOnce);
      assert(validatorSpy.calledOnce);

      expect(validatorSpy.getCall(0).args[0]).to.equal(customerOptions);
      expect(customer).to.equal(customerInstance);
      done();
    });
  });

  it('should find the customer', function(done){
    var controllerSpy = sinon.spy(ControllerMock, 'find');
    var validatorSpy = sinon.spy(ValidatorMock, 'validateGetRequest');

    customerModule.find({id : '569669ccde2134000ddd2542'}, function(err, customer){
      expect(err).to.eql(null);
      assert(controllerSpy.calledOnce);
      assert(validatorSpy.calledOnce);

      expect(validatorSpy.getCall(0).args[0]).to.eql({id : '569669ccde2134000ddd2542'});
      expect(customer).to.equal(customerInstance);
      done();
    });
  });

  it('should find all customers', function(done){
    var controllerSpy = sinon.spy(ControllerMock, 'findAll');

    customerModule.findAll({}, function(err, customer){
      expect(err).to.eql(null);
      assert(controllerSpy.calledOnce);

      expect(controllerSpy.getCall(0).args[0]).to.eql({});
      expect(customer).to.equal(customerInstance);
      done();
    });
  });

  it('should update the customer', function(done){
    var controllerSpy = sinon.spy(ControllerMock, 'update');
    var validatorSpy = sinon.spy(ValidatorMock, 'validateUpdateRequest');

    customerModule.update(customerOptions, function(err, customer){
      expect(err).to.eql(null);
      assert(controllerSpy.calledOnce);
      assert(validatorSpy.calledOnce);

      expect(validatorSpy.getCall(0).args[0]).to.equal(customerOptions);
      expect(customer).to.equal(customerInstance);
      done();
    });
  });

  it('should delete the customer', function(done){
    var controllerSpy = sinon.spy(ControllerMock, 'remove');
    var validatorSpy = sinon.spy(ValidatorMock, 'validateDeleteRequest');

    customerModule.remove({id : '569669ccde2134000ddd2542'}, function(err){
      expect(err).to.eql(null);
      assert(controllerSpy.calledOnce);
      assert(validatorSpy.calledOnce);

      expect(validatorSpy.getCall(0).args[0]).to.eql({id : '569669ccde2134000ddd2542'});
      done();
    });
  });
});