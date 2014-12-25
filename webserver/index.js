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
var random = require('ydr-util').random;

howdo
    .task(mongoose)
    .task(express)
    .task(middleware)
    .task(smtp)
    .task(http)
    .follow(function (err, app) {
        if (err) {
            console.error(err);
            return process.exit(-1);
        }

        app.locals.$system = {
            startTime: Date.now(),
            hash: random.string(20, 'Aa')
        };

        console.log('');
        console.log('#########################################################');
        console.log(configs.app.host + ' is running');
        console.log('#########################################################');
        console.log('');
    });
