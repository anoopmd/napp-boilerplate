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
    .del('/customers/' + id)
    .end(function(err, res){
       expect(res).to.have.status(400);

       var body = res.body;

       expect(body).to.be.an('object');
       expect(body.code).to.equal('400');
       expect(body.message).to.equal('Id is invalid');
       done();
    });
  });

  it('should delete the customer', function(done){
    async.series([
      function confirmCustomerIsPresentToDelete(callback){
        request
        .get('/customers/56a1fdcf1774175c0e071682')
        .end(function(err, res){
          expect(res).to.have.status(200);
          var customer = JSON.parse(res.text);

          expect(customer._id).to.equal('56a1fdcf1774175c0e071682');
          callback();
        });
      },
      function deleteCustomer(callback){
        request
        .delete('/customers/56a1fdcf1774175c0e071682')
        .end(function(err, res){
          expect(res).to.have.status(204);
          callback();
        });
      },
      function confirmDeletion(callback){
        request
        .get('/customers/56a1fdcf1774175c0e071682')
        .end(function(err, res){
          expect(res).to.have.status(200);
          callback();
        });
      },
    ], function(err) {
      done();
    });
  });
});
