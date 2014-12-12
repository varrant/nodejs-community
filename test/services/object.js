/*!
 * test object service
 * @author ydr.me
 * @create 2014-12-12 14:24
 */

'use strict';

var random = require('ydr-util').random;
var test = require('../test.js');
var object = require('../../webserver/services/').object;
var author = {
    id: '548a9fca75cb8cf00877b994',
    role: 2097151
};
var scope1Id = '548aa0638a5cc85c27c6fffa';
var scope2Id = '548aa07592a2a9dc252266b9';
var content = 'url:/customer/rest/statistics/chat/custom?platformId=14&customId=25&startTime=1414800000000&endTime=1418256000000&pageNo=1&pageSize=10url:/customer/rest/statistics/chat/custom?platformId=14&customId=25&startTime=1414800000000&endTime=1418256000000&pageNo=1&pageSize=10url:/customer/rest/statistics/chat/custom?platformId=14&customId=25&startTime=1414800000000&endTime=1418256000000&pageNo=1&pageSize=10';

test
    .push('object.createOne', function (next) {
        object.createOne(author, {
            scope: scope1Id,
            title: '世界，你好',
            type: 'help',
            uri: 'hello-world',
            content: content,
            labels: ['label1', 'label2', 'label3']
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('object.updateOne', function (next) {
        object.updateOne(author, {
            type: 'help',
            uri: 'hello-world'
        }, {
            scope: scope2Id,
            title: '世界，你好',
            content: content,
            labels: ['label6']
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .start();
