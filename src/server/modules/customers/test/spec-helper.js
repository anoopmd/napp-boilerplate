'use strict';

var mongoose = require('mongoose');
var server    = require('./server');
var customers = require('./acceptance/fixtures/customers');
var Customer  = require('../lib/models/customer');

// The seed function to seed the database with customers
Customer.seed = function(entities) {  
  var promise = new mongoose.Promise();
  this.create(entities, function(err) {
      if(err) { promise.reject(err); }
      else    { promise.resolve(); }
  });
  return promise;
};

// The following before and after hooks are executed only once during running the test suite
before(function (done) {
  server.listen(8000, function(){
  	done();
  });
});

after(function (done) {
  mongoose.connection.close();
  server.close();
  done();
});


// The following before and after hooks are executed for each test case
beforeEach(function (done) {
  function clearDB() {

    // Reset and Seed database everytime
    Customer.remove().exec()
    .then(function(){
      return Customer.seed(customers);
    }).then(function(){
      done();
    });
  }


  function reconnect() {

    mongoose.connect('mongodb://localhost/test', function (err) {
    if (err) {
      throw err;
    }
      return clearDB();
    });
  }


  function checkState() {
    switch (mongoose.connection.readyState) {
      // 0 - disconnected, 1 - connected, 2 = connecting , 3 = disconnecting
      case 0:
        reconnect();
        break;
      case 1:
        clearDB();
        break;
      default:
        process.nextTick(checkState);
    }
  }


  checkState();
});

afterEach(function (done) {
  done();
});