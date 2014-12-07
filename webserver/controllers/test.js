/*!
 * 测试控制器
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var configs = require('../../configs/');
var user = require('../services/').user;
var setting = require('../services/').setting;
var ydrAliOss = require('ydr-ali-oss');
var random = require('ydr-util').random;


module.exports = function (app) {
    var exports = {};
    var options = app.locals.options;
    var alioss = new ydrAliOss(options.alioss);

    exports.test1 = function (req, res, next) {
        if (configs.app.env === 'pro') {
            return next();
        }

        res.send('');
    };

    exports.test2Page = function (req, res, next) {
        res.render('test2.html');
    };

    return exports;
};


