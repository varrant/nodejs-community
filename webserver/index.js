/*!
 * webserver 入口
 * @author ydr.me
 * @create 2014-12-09 15:08
 */

'use strict';

var howdo = require('howdo');
var configs = require('../configs/');
var mongoose = require('./mongoose.js');
var express = require('./express.js');
var middleware = require('./middleware.js');
var smtp = require('./smtp.js');
var http = require('./http.js');
var services = require('./services/');


module.exports = function (callback) {
    howdo
        .task(mongoose)
        .task(express)
        .task(middleware)
        .task(smtp)
        .task(http)
        .follow(callback);
};

