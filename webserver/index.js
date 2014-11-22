/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 12:04
 */

'use strict';

var config = require('../webconfig/');
var howdo = require('howdo');
var express = require('./express.js');
var mongoose = require('./mongoose.js');

howdo.task(mongoose).task(express).follow(function (err) {
    if (err) {
        console.log(err);
        return process.exit(-1);
    }

    console.log('');
    console.log('#########################################################');
    console.log('f2ec.com running at ' + config.app.port);
    console.log('#########################################################');
    console.log('');
});
