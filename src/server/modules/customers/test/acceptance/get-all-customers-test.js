'use strict';

require('../spec-helper');

var async = require('async');
var chai = require('chai');
var expect = chai.expect;
var seededCustomers = require('./fixtures/customers');

var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('GET /customers', function(){
  var request;

  beforeEach(function(){
      request = chai.request('http://localhost:8000');
  }); 

  afterEach(function(){
  });

  it('should return all the customers', function(done){
    request
    .get('/customers')
    .end(function(err, res){
      expect(res).to.have.status(200);

      var customers = JSON.parse(res.text);
      var index = 0;

      expect(customers.length).to.equal(seededCustomers.length);

      async.each(customers, function(customer, callback) {
        var seededCustomer = seededCustomers[index];

        expect(customer._id).to.equal(seededCustomer._id);
        expect(customer.firstName).to.equal(seededCustomer.firstName);
        expect(customer.email).to.equal(seededCustomer.email);
        expect(customer.dob).to.equal(seededCustomer.dob);
        expect(customer.address).to.equal(seededCustomer.address);
        expect(customer.phone).to.equal(seededCustomer.phone);

        index = index + 1;
        callback();
      }, function(err) {
        done();
      });
    });
  });
});