/*!
 * test object service
 * @author ydr.me
 * @create 2014-12-12 14:24
 */

'use strict';

var random = require('ydr-util').random;
var test = require('../test.js');
var engineer = require('../../webserver/services/').engineer;
var scope = require('../../webserver/services/').scope;
var object = require('../../webserver/services/').object;
var author = {};
var scope1Id = '5491729fb70d9d0000f8d363';
var content = '# 测试数据\n\n需要用什么系统，怎么安装呢需要用什么系统，怎么安装呢需要用什么系统，怎么安装呢需要用什么系统，怎么安装呢';
var howdo = require('howdo');

test
    .push('get author', function (next) {
        engineer.findOne({}, function (err, doc) {
            author = doc;
            next();
        });
    })
    .push('get scope', function (next) {
        scope.findOne({
            uri: 'default'
        }, function (err, doc) {
            scope1Id = doc._id;
            next();
        });
    })
    .push('object.createOne', function (next) {
        var arr = new Array(random.number(2, 30));

        howdo
            .each(arr, function (index, val, done) {
                object.createOne(author, {
                    scope: scope1Id,
                    title: '世界，你好 ' + random.string(20),
                    type: 'question',
                    uri: 'hello-world-' + random.string(20),
                    content: content,
                    labels: [random.string(6),random.string(6),random.string(6),random.string(6),random.string(6)]
                }, done);
            })
            .together(next);

    })
    //.push('object.updateOne', function (next) {
    //    object.updateOne(author, {
    //        type: 'help',
    //        uri: 'hello-world'
    //    }, {
    //        scope: scope2Id,
    //        title: '世界，你好',
    //        content: content,
    //        labels: ['label6']
    //    }, function () {
    //        console.log(arguments);
    //        next();
    //    });
    //})
    //.push('object.findOne', function (next) {
    //    object.findOne({uri: 'hello-world'}, function (err, doc) {
    //        console.log(doc);
    //        next();
    //    });
    //})
    .start();
