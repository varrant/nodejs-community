/*!
 * 启动文件
 * @author ydr.me
 * @create 2014-12-02 22:59
 */


'use strict';

var howdo = require('howdo');
var mongoose = require('../server/mongoose.js');
var express = require('../server/express.js');
var preHttp = require('../server/pre-http.js');
var http = require('../server/http.js');

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
