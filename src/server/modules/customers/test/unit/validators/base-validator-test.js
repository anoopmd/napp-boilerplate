'use strict';

var assert = require('assert');
var chai = require('chai');
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');

var expect = chai.expect;

describe('Base Validator', function(){
  var validator;

  beforeEach(function(done){
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    validator = require('../../../lib/validators/base-validator');
    done();
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should validate Object Id - test 1', function(done){
    var id = '56a1fdcf1774175c0e0716**'; // Invalid chars at the end

    var isValid = validator.isObjectId(id);

    assert(!isValid);
    done();
  });

  it('should validate Object Id - test 2', function(done){
    var id = '56a1fdcf1774175c0e07168199'; // 9 Bytes

    var isValid = validator.isObjectId(id);

    assert(!isValid);
    done();
  });

  it('should validate Object Id - test 3', function(done){
    var id = '56a1fdcf1774175c0e0716'; // 7 Bytes

    var isValid = validator.isObjectId(id);

    assert(!isValid);
    done();
  });

  it('should validate Object Id - test 4', function(done){
    var id = '56a1fdcf1774175c0e0716cc'; // Proper Id

    var isValid = validator.isObjectId(id);

    assert(isValid);
    done();
  });
});