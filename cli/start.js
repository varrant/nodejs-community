/*!
 * 启动文件
 * @author ydr.me
 * @create 2014-12-02 22:59
 */


'use strict';

var howdo = require('howdo');
var configs = require('../configs/');
var mongoose = require('../webserver/mongoose.js');
var express = require('../webserver/express.js');
var middleware = require('../webserver/middleware.js');
var http = require('../webserver/http.js');

howdo
    .task(mongoose)
    .task(express)
    .task(middleware)
    .task(http)
    .follow(function (err, app) {
        if (err) {
            console.log(err);
            return process.exit(-1);
        }

        console.log('');
        console.log('#########################################################');
        console.log(configs.app.domain + ' running at ' + app.locals.settings.port);
        console.log('#########################################################');
        console.log('');
    });
