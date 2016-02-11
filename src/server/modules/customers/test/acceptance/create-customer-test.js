'use strict';

require('../spec-helper');

var async = require('async');
var chai = require('chai');
var expect = chai.expect;
var seededCustomers = require('./fixtures/customers');

var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('POST /customers/:id', function(){
  var request;

  beforeEach(function(){
    request = chai.request('http://localhost:8000');
  }); 

  afterEach(function(){
  });

  it('should return a 400 error if the first name is missing', function(done){
    request
    .post('/customers')
    .send({ lastName: 'Stark', email : 'ironman@gmail.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not create the customer');

      expect(body.errors[0].message).to.be.equal('First Name is empty');
      expect(body.errors[0].attr).to.be.equal('firstName');

      done();
    });
  });

  it('should return a 400 error if the last name is missing', function(done){
    request
    .post('/customers')
    .send({ firstName: 'Stark', email : 'ironman@gmail.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not create the customer');

      expect(body.errors[0].message).to.be.equal('Last Name is empty');
      expect(body.errors[0].attr).to.be.equal('lastName');

      done();
    });
  });

  it('should return a 400 error if the email is invalid', function(done){
    request
    .post('/customers')
    .send({ firstName: 'Tony', lastName: 'Stark', email : 'ironman@gmail@.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not create the customer');

      expect(body.errors[0].message).to.be.equal('Email is invalid');
      expect(body.errors[0].attr).to.be.equal('email');

      done();
    });
  });

  it('should return a 400 error along with multiple error descriptions', function(done){
    request
    .post('/customers')
    .send({ email : 'ironman@gmail.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not create the customer');

      expect(body.errors[0].message).to.be.equal('First Name is empty');
      expect(body.errors[0].attr).to.be.equal('firstName');

      expect(body.errors[1].message).to.be.equal('Last Name is empty');
      expect(body.errors[1].attr).to.be.equal('lastName');

      done();
    });
  });

  it('should create the customer', function(done){
    async.waterfall([
      function createTheCustomer(callback){
        request
        .post('/customers')
        .send({ firstName: 'Tony', lastName: 'Stark', email : 'ironman@gmail.com', dob : '1980-1-1', address : '#12, TN , LA', phone : '5544554455' })
        .end(function(err, res){
          expect(res).to.have.status(201);
          var customer = JSON.parse(res.text);

          callback(null, customer._id);
        });
      },
      function getTheNewlyCreatedCustomer(customerId, callback){
        request
        .get('/customers/' + customerId)
        .end(function(err, res){
          expect(res).to.have.status(200);

          var customer = JSON.parse(res.text);

          expect(customer._id).to.equal(customerId);
          expect(customer.firstName).to.equal('Tony');
          expect(customer.lastName).to.equal('Stark');
          expect(customer.email).to.equal('ironman@gmail.com');
          expect(customer.dob).to.equal('1980-1-1');
          expect(customer.address).to.equal('#12, TN , LA');
          expect(customer.phone).to.equal('5544554455');
          callback(null);
        });
      }
    ], function(err) {
      done();
    });
  });
});