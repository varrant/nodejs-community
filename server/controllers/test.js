/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var config = require('../../webconfig/');
var user = require('../services/').user;
var setting = require('../services/').setting;


module.exports = function (app) {
    var exports = {};

    exports.test1 = function (req, res, next) {
        if (config.app.env === 'pro') {
            return next();
        }

        res.send('<!doctype html><meta charset="utf8"><iframe src="/user/oauth/authorize"></iframe>');
    };

    exports.test2Page = function (req, res, next) {
        res.render('test2.html');
    };

    exports.test2Upload = function (req, res, next) {
        console.log(req.files);
        console.log(req.body);
        res.send('test2');
    };

    return exports;
};


