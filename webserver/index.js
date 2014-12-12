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

howdo
    .task(mongoose)
    .task(express)
    .task(middleware)
    .task(smtp)
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
