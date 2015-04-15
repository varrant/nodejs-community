'use strict';

var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/index').object;


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }


});
