/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-10 15:05
 */

'use strict';

var test = require('../test.js');
var interactive = require('../../webserver/services/').interactive;
var random = require('ydr-util').random;

test
    .push('interactive.push', function (next) {
        interactive.active({
            operator: '5487fa5fc57b05a81f23037d',
            model: 'user',
            path: 'followCount',
            object: '5487fab2eb3108d014e6abad',
            value: 1
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .start();