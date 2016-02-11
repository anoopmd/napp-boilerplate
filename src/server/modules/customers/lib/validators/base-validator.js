'use strict';

var validator = require('validator');

validator.extend('isObjectId', function (id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
});

module.exports = validator;