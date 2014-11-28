/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 12:35
 */

'use strict';

var config = require('../webconfig/');

// mongoose
var mongoose = require('mongoose');

module.exports = function (next) {
    mongoose.connect(config.app.mongodb);
    mongoose.connection.on('connected', next);
    mongoose.connection.on('error', next);
    mongoose.connection.on('disconnected', next);
};


