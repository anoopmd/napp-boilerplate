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

  it('should return an error if the customer id is not an object Id', function(done){
    var id = '56a1fdcf1774175c0e0716**'; // Invalid chars at the end

    request
    .put('/customers/' + id)
    .end(function(err, res){
        expect(res).to.have.status(400);

        var body = res.body;

        expect(body).to.be.an('object');
        expect(body.code).to.equal('400');
        expect(body.message).to.equal('Could not update the customer');

        expect(body.errors[0].message).to.be.equal('Invalid Id');
        expect(body.errors[0].attr).to.be.equal('id');
       done();
    });
  });

  it('should return a 400 error if the first name is missing', function(done){
    request
    .put('/customers/56a1fdcf1774175c0e071682')
    .send({ lastName: 'Stark', email : 'ironman@gmail.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not update the customer');

      expect(body.errors[0].message).to.be.equal('First Name is empty');
      expect(body.errors[0].attr).to.be.equal('firstName');

      done();
    });
  });

  it('should return a 400 error if the last name is missing', function(done){
    request
    .put('/customers/56a1fdcf1774175c0e071682')
    .send({ firstName: 'Stark', email : 'ironman@gmail.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not update the customer');

      expect(body.errors[0].message).to.be.equal('Last Name is empty');
      expect(body.errors[0].attr).to.be.equal('lastName');

      done();
    });
  });

  it('should return a 400 error if the email is invalid', function(done){
    request
    .put('/customers/56a1fdcf1774175c0e071682')
    .send({ firstName: 'Tony', lastName: 'Stark', email : 'ironman@gmail@.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not update the customer');

      expect(body.errors[0].message).to.be.equal('Email is invalid');
      expect(body.errors[0].attr).to.be.equal('email');

      done();
    });
  });

  it('should return a 400 error along with multiple error descriptions', function(done){
    request
    .put('/customers/56a1fdcf1774175c0e071682')
    .send({ email : 'ironman@gmail.com'})
    .end(function(err, res){
      expect(res).to.have.status(400);

      var body = JSON.parse(res.text);

      expect(body).to.be.an('object');
      expect(body.message).to.be.equal('Could not update the customer');

      expect(body.errors[0].message).to.be.equal('First Name is empty');
      expect(body.errors[0].attr).to.be.equal('firstName');

      expect(body.errors[1].message).to.be.equal('Last Name is empty');
      expect(body.errors[1].attr).to.be.equal('lastName');

      done();
    });
  });

  it('should update the customer', function(done){
    async.series([
      function confirmCustomerIsPresentToUpdate(callback){
        request
        .get('/customers/56a1fdcf1774175c0e071682')
        .end(function(err, res){
          expect(res).to.have.status(200);

          var customer = JSON.parse(res.text);

          expect(customer._id).to.equal('56a1fdcf1774175c0e071682');
          callback();
        });
      },
      function updateTheCustomer(callback){
        request
        .put('/customers/56a1fdcf1774175c0e071682')
        .send({ firstName: 'James', lastName: 'Bond', email : 'jb@gmail.com', dob : '1980-1-1', address : '#12, TN , LA', phone : '987654321' })
        .end(function(err, res){
          expect(res).to.have.status(200);

          var customer = JSON.parse(res.text);

          expect(customer._id).to.equal('56a1fdcf1774175c0e071682');
          callback();
        });
      },
      function confirmThatCustomerWasUpdated(callback){
        request
        .get('/customers/56a1fdcf1774175c0e071682')
        .end(function(err, res){
          expect(res).to.have.status(200);

          var customer = JSON.parse(res.text);

          expect(customer._id).to.equal('56a1fdcf1774175c0e071682');
          expect(customer.firstName).to.equal('James');
          expect(customer.lastName).to.equal('Bond');
          expect(customer.email).to.equal('jb@gmail.com');
          expect(customer.dob).to.equal('1980-1-1');
          expect(customer.address).to.equal('#12, TN , LA');
          expect(customer.phone).to.equal('987654321');
          callback();
        });
      }
    ], function(err) {
      done();
    });
  });

});

