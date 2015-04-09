/*!
 * 测试控制器
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var configs = require('../../configs/');
var setting = require('../services/').setting;
var random = require('ydr-utils').random;


module.exports = function (app) {
    var exports = {};

    exports.test1 = function (req, res, next) {
        res.render('test1.html');
    };

    exports.test2 = function (req, res, next) {
        res.render('test2.html');
    };

    return exports;
};


