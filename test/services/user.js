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
    .push('user.increaseScore', function (next) {
        user.increaseScore({
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
    .push('user.increaseCommentCount', function (next) {
        user.increaseCommentCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.increaseAgreedCount', function (next) {
        user.increaseAgreedCount({
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
    .push('user.follow', function (next) {
        user.follow('5487fa5fc57b05a81f23037d', '5487fab2eb3108d014e6abad', function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.unfollow', function (next) {
        user.unfollow('5487fa5fc57b05a81f23037d', '5487fab2eb3108d014e6abad', function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.setBlock', function (next) {
        user.setBlock({
            github: 'cloudcome'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.cancelBlock', function (next) {
        user.cancelBlock({
            github: 'cloudcome'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('user.joinOrganization', function (next) {
        user.joinOrganization({
            github: 'cloudcome'
        }, random.string(24), function () {
            console.log(arguments);
            next();
        });
    })
    .start();