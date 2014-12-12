/*!
 * service scope test
 * @author ydr.me
 * @create 2014-12-12 13:27
 */

'use strict';

var test = require('../test.js');
var scope = require('../../webserver/services/').scope;

test
    .push('scope.createOne', function (next) {
        scope.createOne({
            name: 'scope2',
            uri: 'scope2',
            introduction: '呵呵\n\n\n\n\n\n\n哈哈',
            cover: '1234567890'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('scope.updateOne', function (next) {
        scope.updateOne({
            name: 'scope1'
        }, {
            introduction: '呵呵\n\n\n\n\n\n\n哈哈' + Date.now()
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('scope.increaseObjectCount', function (next) {
        scope.increaseObjectCount({
            name: 'scope1'
        }, 312, function () {
            console.log(arguments);
            next();
        });
    })
    .start();
