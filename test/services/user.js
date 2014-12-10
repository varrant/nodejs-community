/*!
 * services/user
 * @author ydr.me
 * @create 2014-12-10 14:24
 */

'use strict';

var test = require('../test.js');
var mongoose = require('../../webserver/mongoose.js');
var user = require('../../webserver/services/').user;
var random = require('ydr-util').random;

test
    .push('user.increaseCommentCount', function (next) {
        user.increaseCommentCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.increaseViewCount', function (next) {
        user.increaseViewCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.increasePraisedCount', function (next) {
        user.increasePraisedCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.increaseAcceptedCount', function (next) {
        user.increaseAcceptedCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .start();