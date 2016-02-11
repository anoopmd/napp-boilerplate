'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dob: String,
    address: String,
    phone: String,
});

module.exports = mongoose.model('Customer', customerSchema);