/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 12:04
 */

'use strict';

var howdo = require('howdo');
var mongoose = require('./mongoose.js');
var express = require('./express.js');
var middleware = require('./middleware.js');
var config = require('../webconfig/');
var routers = require('./routers/');

howdo.task(mongoose).task(express).task(middleware).follow(function (err, app) {
    if (err) {
        console.log(err);
        return process.exit(-1);
    }

    routers(app);

    app.listen(config.app.port, function (err) {
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
});
