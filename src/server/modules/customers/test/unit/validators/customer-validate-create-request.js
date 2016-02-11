'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Customer Validator (createRequest)', function(){
  var validator, customerOptions;

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

    validator = require('../../../lib/validators/customer');
    done();
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should return error if the first name is missing', function(done){
    customerOptions.firstName = null;

    validator.validateCreateRequest(customerOptions, function(err){
      expect(err).to.be.an('object');
      expect(err.message).to.be.equal('Could not create the customer');

      expect(err.errors[0].message).to.be.equal('First Name is empty');
      expect(err.errors[0].attr).to.be.equal('firstName');
      done();
    });
  });

  it('should return error if the last name is missing', function(done){
    customerOptions.lastName = null;

    validator.validateCreateRequest(customerOptions, function(err){
      expect(err).to.be.an('object');
      expect(err.message).to.be.equal('Could not create the customer');

      expect(err.errors[0].message).to.be.equal('Last Name is empty');
      expect(err.errors[0].attr).to.be.equal('lastName');
      done();
    });
  });

  it('should return error if the email is missing', function(done){
    customerOptions.email = null;

    validator.validateCreateRequest(customerOptions, function(err){
      expect(err).to.be.an('object');
      expect(err.message).to.be.equal('Could not create the customer');

      expect(err.errors[0].message).to.be.equal('Email is invalid');
      expect(err.errors[0].attr).to.be.equal('email');
      done();
    });
  });

  it('should return multiple error descriptions when more than one param is missing', function(done){
    validator.validateCreateRequest({}, function(err){
      expect(err).to.be.an('object');
      expect(err.message).to.be.equal('Could not create the customer');

      expect(err.errors[0].message).to.be.equal('First Name is empty');
      expect(err.errors[0].attr).to.be.equal('firstName');

      expect(err.errors[1].message).to.be.equal('Last Name is empty');
      expect(err.errors[1].attr).to.be.equal('lastName');

      expect(err.errors[2].message).to.be.equal('Email is invalid');
      expect(err.errors[2].attr).to.be.equal('email');
      done();
    });
  });

  it('should return null if all parameters are valid', function(done){
    validator.validateCreateRequest(customerOptions, function(err){
      expect(err).to.equal(null);
      done();
    });
  });
});