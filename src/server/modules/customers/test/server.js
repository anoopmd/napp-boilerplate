'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var customers = require('../index');

var app = new express();
var serverInstance = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/customers/:id', function(req, res){
  var options = {
    id : req.params.id
  };

  customers.find(options , function(err, customer){
    if(err){
      res.status(err.code).json(err);
    } else {
      res.json(customer);
    }
  });
});

app.get('/customers', function(req, res){
  customers.findAll({} , function(err, customers){
    if(err){
      res.status(err.code).json(err);
    } else {
      res.json(customers);
    }
  });
});

app.post('/customers', function(req, res){
  // Load customer details from query
  var options = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dob: req.body.dob,
    address: req.body.address,
    phone: req.body.phone
  };
  
  customers.create(options , function(err, customer){
    if(err){
      res.status(err.code).json(err);
    } else {
      res.status(201).json(customer);
    }
  });
});

app.put('/customers/:id', function(req, res){
  // Load customer details from query
  var options = {
    id: req.params.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dob: req.body.dob,
    address: req.body.address,
    phone: req.body.phone
  };
  
  customers.update(options , function(err, customer){
    if(err){
      res.status(err.code).json(err);
    } else {
      res.json(customer);
    }
  });
});

app.delete('/customers/:id', function(req, res){
  var options = {
    id: req.params.id
  };
  
  customers.remove(options , function(err, customer){
    if(err){
      res.status(err.code).json(err);
    } else {
      res.status(204).send();
    }
  });
});

exports.listen = function (port, callback) {
  serverInstance = app.listen(port, callback);
};

exports.close = function () {
  serverInstance.close();
};