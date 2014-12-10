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
        interactive.push({
            model: 'user',
            path: 'followCount',
            object: random.string(24, 'a0'),
            operator: random.string(24, 'a0'),
            value: 1
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .start();