/*!
 * service label test
 * @author ydr.me
 * @create 2014-12-12 14:01
 */

'use strict';

var test = require('../test.js');
var label = require('../../webserver/services/').label;

test
    .push('label.createOne', function (next) {
        label.createOne({
            name: 'label1',
            uri: 'label1',
            introduction: '呵呵\n\n\n\n\n\n\n哈哈',
            cover: '1234567890'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('label.updateOne', function (next) {
        label.updateOne({
            name: 'label1'
        }, {
            introduction: '呵呵\n\n\n\n\n\n\n哈哈' + Date.now()
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('label.increaseObjectCount', function (next) {
        label.increaseObjectCount({
            name: 'label1'
        }, 312, function () {
            console.log(arguments);
            next();
        });
    })
    .start();
