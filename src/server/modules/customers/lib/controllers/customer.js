'use strict';

var Customer = require('../models/customer');

var Controller = {};

Controller.create = function(options, callback){
  var customer = new Customer({
    firstName: options.firstName,
    lastName: options.lastName,
    email: options.email,
    dob: options.dob,
    address: options.address,
    phone: options.phone
  });

  customer.save(function(err, customer){
    if (err) {
      return callback(err, null);
    }
    return callback(null, customer);
  });
};

Controller.findAll = function(options, callback){
  Customer.find({}, function(err, customers) {
    if (err) {
      return callback(err, null);
    }
    return callback(null, customers);
  });
};

Controller.find = function(options, callback){
  var id = options.id;

  Customer.findById(id, function(err, customer) {
    if (err) {
      return callback(err, null);
    }

    if(!customer){
      return callback(null, null);
    }

    return callback(null, customer);
  });
};

Controller.update = function(options, callback){
  var id = options.id;

  // Find and Update the customer
  Customer.findById(id, function(err, customer) {
    if (err) {
      return callback(err, null);
    }

    if(!customer){
      return callback(null, null);
    }

    customer.firstName = options.firstName;
    customer.lastName = options.lastName;
    customer.email = options.email;
    customer.dob = options.dob;
    customer.address = options.address;
    customer.phone = options.phone;

    /* Save the customer*/
    customer.save(function(err, customer){
      if (err) {
        return callback(err, null);
      }
      return callback(null, customer);
    });
  });
};

Controller.remove = function(options, callback){
  var id = options.id;

  // Find and Delete the customer
  Customer.findById(id, function(err, customer) {
    if (err) {
      return callback(err, null);
    }

    if(!customer){
      return callback(null, null);
    }

    customer.remove(function(err){
      if (err) {
        return callback(err, null);
      }

      return callback(null, null);
    });
  });
};

module.exports = Controller;