'use strict';

var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/index').object;
var response = require('../../webserver/models/index').response;
var howdo = require('howdo');
var random = require('ydr-utils').random;
var objectId = '54b7a533ad91ae443987f2d1';

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    object.findOne({
        _id: objectId,
        isDisplay: true
    }, function () {
        console.log(arguments);
    });
});