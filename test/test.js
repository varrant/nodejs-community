/*!
 * 测试启动
 * @author ydr.me
 * @create 2014-12-10 14:27
 */

'use strict';

var howdo = require('howdo');
var mongoose = require('../webserver/mongoose.js');
var Test = function () {
    this._list = [];
};
var pro = Test.prototype;

/**
 * 推入测试用例
 * @param name
 * @param fn
 */
pro.push = function (name, fn) {
    this._list.push({
        name: name,
        fn: fn
    });

    return this;
};


/**
 * 执行测试用例
 */
pro.start = function () {
    var the = this;

    mongoose(function (err) {
        if (err) {
            console.log('mongoose error');
            console.error(err);
            return process.exit(-1);
        }

        console.log('=========== test start ===========');
        var t1 = Date.now();
        var length = the._list.length;

        howdo.each(the._list, function (index, item, next) {
            console.log('\n=========== test ' + item.name + ' (' + (index + 1) + '/' + length + ') ===========');

            item.fn(next);
        }).follow(function () {
            var t = Date.now() - t1;
            console.log('\n=========== test end (' + t + 'ms) ===========');
            process.exit();
        })
    });
};


/**
 * 推入测试用例
 * @param name
 * @param fn
 * @returns {Test}
 */
exports.push = function (name, fn) {
    var test = new Test();

    test.push(name, fn);

    return test;
};
