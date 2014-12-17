/*!
 * services/user
 * @author ydr.me
 * @create 2014-12-10 14:24
 */

'use strict';

var test = require('../test.js');
var engineer = require('../../webserver/services/').engineer;
var random = require('ydr-util').random;

test
    .push('user.increaseScore', function (next) {
        engineer.increaseScore({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.increaseViewCount', function (next) {
        engineer.increaseViewCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.increaseCommentCount', function (next) {
        engineer.increaseCommentCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.increaseAgreedCount', function (next) {
        engineer.increaseAgreedCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.increaseAcceptedCount', function (next) {
        engineer.increaseAcceptedCount({
            github: 'cloudcome'
        }, 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.follow', function (next) {
        engineer.follow('5487fa5fc57b05a81f23037d', '5487fab2eb3108d014e6abad', function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.unfollow', function (next) {
        engineer.unfollow('5487fa5fc57b05a81f23037d', '5487fab2eb3108d014e6abad', function () {
            console.log(arguments);
            next();
        });
    })
    .push('increaseObjectTypeCount', function (next) {
        engineer.increaseObjectTypeCount({github: 'cloudcome'}, 'help', 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.setBlock', function (next) {
        engineer.setBlock({
            github: 'cloudcome'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.cancelBlock', function (next) {
        engineer.cancelBlock({
            github: 'cloudcome'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('engineer.joinOrganization', function (next) {
        engineer.joinOrganization({
            github: 'cloudcome'
        }, random.string(24), function () {
            console.log(arguments);
            next();
        });
    })
    .start();