'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Customer Validator (getRequest)', function(){
  var validator;

  beforeEach(function(done){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    validator = require('../../../lib/validators/customer');
    done();
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should return error if is invalid - test1', function(done){
    var id = '56a1fdcf1774175c0e0716**'; // Invalid chars at the end

    validator.validateGetRequest({id : id}, function(err){
      expect(err).to.be.an('object');
      expect(err.code).to.equal('400');
      expect(err.message).to.equal('Id is invalid');
      done();
    });
  });

  it('should return error if is invalid - test2', function(done){
    var id = '56a1fdcf1774175c0e07168199'; // 9 Bytes

    validator.validateGetRequest({id : id}, function(err){
      expect(err).to.be.an('object');
      expect(err.code).to.equal('400');
      expect(err.message).to.equal('Id is invalid');
      done();
    });
  });

  it('should return error if is invalid - test3', function(done){
    var id = '56a1fdcf1774175c0e0716'; // 7 Bytes

    validator.validateGetRequest({id : id}, function(err){
      expect(err).to.be.an('object');
      expect(err.code).to.equal('400');
      expect(err.message).to.equal('Id is invalid');
      done();
    });
  });

  it('should return null if all parameters are valid', function(done){
    var id = '56a1fdcf1774175c0e071611';
    
    validator.validateGetRequest({id : id}, function(err){
      expect(err).to.equal(null);
      done();
    });
  });
});