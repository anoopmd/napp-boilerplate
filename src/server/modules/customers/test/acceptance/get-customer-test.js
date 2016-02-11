'use strict';

require('../spec-helper');

var async = require('async');
var chai = require('chai');
var expect = chai.expect;
var seededCustomers = require('./fixtures/customers');

var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('GET /customers/:id', function(){
  var request;

  beforeEach(function(){
      request = chai.request('http://localhost:8000');
  }); 

  afterEach(function(){
  });

  it('should return an error if the customer id is not an object Id - Test 1', function(done){
    var id = '56a1fdcf1774175c0e0716**'; // Invalid chars at the end

    request
    .get('/customers/' + id)
    .end(function(err, res){
       expect(res).to.have.status(400);

       var body = res.body;

       expect(body).to.be.an('object');
       expect(body.code).to.equal('400');
       expect(body.message).to.equal('Id is invalid');
       done();
    });
  });

  it('should return an error if the customer id is not an object Id - Test 2', function(done){
    var id = '56a1fdcf1774175c0e07168199'; // 9 Bytes

    request
    .get('/customers/' + id)
    .end(function(err, res){
       expect(res).to.have.status(400);

       var body = res.body;

       expect(body).to.be.an('object');
       expect(body.code).to.equal('400');
       expect(body.message).to.equal('Id is invalid');
       done();
    });
  });

  it('should return an error if the customer id is not an object Id - Test 3', function(done){
    var id = '56a1fdcf1774175c0e0716'; // 7 Bytes

    request
    .get('/customers/' + id)
    .end(function(err, res){
       expect(res).to.have.status(400);

       var body = res.body;

       expect(body).to.be.an('object');
       expect(body.code).to.equal('400');
       expect(body.message).to.equal('Id is invalid');
       done();
    });
  });

  it('should get the customer', function(done){
    async.series([
      function fetchTheCustomer(callback){
        request
        .get('/customers/56a1fdcf1774175c0e071681')
        .end(function(err, res){
          expect(res).to.have.status(200);

          var customer = JSON.parse(res.text);

          expect(customer._id).to.equal('56a1fdcf1774175c0e071681');
          expect(customer.firstName).to.equal('John');
          expect(customer.lastName).to.equal('Doe');
          expect(customer.email).to.equal('johndoe@gmail.com');
          expect(customer.dob).to.equal('1990-08-12');
          expect(customer.address).to.equal('#47, Bangalore, India');
          expect(customer.phone).to.equal('9988776655');
          callback();
        });
      },
      function fetchAnotherCustomer(callback){
        request
        .get('/customers/56a1fdcf1774175c0e071683')
        .end(function(err, res){
          expect(res).to.have.status(200);

          var customer = JSON.parse(res.text);

          expect(customer._id).to.equal('56a1fdcf1774175c0e071683');
          expect(customer.firstName).to.equal('Rakesh');
          expect(customer.lastName).to.equal('Dahiya');
          expect(customer.email).to.equal('rd@gmail.com');
          expect(customer.dob).to.equal('1980-05-12');
          expect(customer.address).to.equal('#12, Mysore, India');
          expect(customer.phone).to.equal('6655889966');
          callback();
        });
      },
    ], function(err) {
      done();
    });
  });
});