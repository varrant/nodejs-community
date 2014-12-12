/*!
 * test object service
 * @author ydr.me
 * @create 2014-12-12 14:24
 */

'use strict';

var test = require('../test.js');
var object = require('../../webserver/services/').object;
var author = {
    id: '5487fa5fc57b05a81f23037d',
    role: 2097151
};
var scopeId1 = '548a7ec5a676da7c21699aa4';
var scopeId2 = '548a801be28ac2c008276a1e';
var content = 'url:/customer/rest/statistics/chat/custom?platformId=14&customId=25&startTime=1414800000000&endTime=1418256000000&pageNo=1&pageSize=10url:/customer/rest/statistics/chat/custom?platformId=14&customId=25&startTime=1414800000000&endTime=1418256000000&pageNo=1&pageSize=10url:/customer/rest/statistics/chat/custom?platformId=14&customId=25&startTime=1414800000000&endTime=1418256000000&pageNo=1&pageSize=10';

test
    .push('object.createOne', function (next) {
        object.createOne(author, {
            scope: scopeId1,
            title: '世界，你好',
            type: 'help',
            uri: 'hello-world',
            content: content
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .start();
