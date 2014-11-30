/*!
 * 启动文件
 * @author ydr.me
 * @create 2014-11-22 12:04
 */

'use strict';

var howdo = require('howdo');
var mongoose = require('./mongoose.js');
var express = require('./express.js');
var preHttp = require('./pre-http.js');
var http = require('./http.js');

howdo
    .task(mongoose)
    .task(express)
    .task(preHttp)
    .task(http)
    .follow(function (err, app) {
        if (err) {
            console.log(err);
            return process.exit(-1);
        }

        console.log('');
        console.log('#########################################################');
        console.log('f2ec.com running at ' + app.locals.settings.port);
        console.log('#########################################################');
        console.log('');
    });
