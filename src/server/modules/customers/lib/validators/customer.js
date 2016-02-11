'use strict';

var validator = require('./base-validator');

var CustomerValidator = {};

CustomerValidator.validateGetRequest = function(options, callback){
  var id = options.id;

  if(id && validator.isObjectId(id)){
    callback(null);
  } else {
    callback({
      code : '400',
      message : 'Id is invalid'
    });
  }
};

CustomerValidator.validateCreateRequest = function(options, callback){
  var firstName = options.firstName,
      lastName = options.lastName,
      email = options.email,
      errors = [];

  if(!firstName || !firstName.length){
    errors.push({
      'message' : 'First Name is empty',
      'attr'    : 'firstName'
    });
  }

  if(!lastName || !lastName.length){
    errors.push({
      'message' : 'Last Name is empty',
      'attr'    : 'lastName'
    });
  }

  if(!email || !validator.isEmail(email)){
    errors.push({
      'message' : 'Email is invalid',
      'attr'    : 'email'
    });
  }

  if(errors.length){
    callback({
      code : '400',
      message : 'Could not create the customer',
      errors : errors
    });
  } else {
    callback(null);
  }
};

CustomerValidator.validateUpdateRequest = function(options, callback){
  var id = options.id,
      firstName = options.firstName,
      lastName = options.lastName,
      email = options.email,
      errors = [];

  if(!id || !validator.isObjectId(id)){
    errors.push({
      'message' : 'Invalid Id',
      'attr' : 'id'
    });
  } 

  if(!firstName){
    errors.push({
      'message' : 'First Name is empty',
      'attr'    : 'firstName'
    });
  }

  if(!lastName){
    errors.push({
      'message' : 'Last Name is empty',
      'attr'    : 'lastName'
    });
  }

  if(!email || !validator.isEmail(email)){
    errors.push({
      'message' : 'Email is invalid',
      'attr'    : 'email'
    });
  }

  if(errors.length){
    callback({
      code : '400',
      message : 'Could not update the customer',
      errors : errors
    });
  } else {
    callback(null);
  }
};

CustomerValidator.validateDeleteRequest = function(options, callback){
  var id = options.id;

  if(id && validator.isObjectId(id)){
    callback(null);
  } else {
    callback({
      code : '400',
      message : 'Id is invalid'
    });
  }
};

module.exports = CustomerValidator;