/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 13:18
 */

'use strict';

var ydrUtil = require('ydr-util');

module.exports = function (app) {
    var exports = {};


    /**
     * 创建 csrf
     * @param req
     * @param res
     * @param next
     */
    exports.createCsrf = function (req, res, next) {
        var csrf = ydrUtil.random.string(32);

        res.session.csrf = res.locals._csrf = csrf;
        next();
    };


    /**
     * 对 post|put|delete 的安全性检测
     * @param req
     * @param res
     * @param next
     */
    exports.safeDetection = function (req, res, next) {
        var headers = req.headers;

        if (headers.accept === 'application/json' &&
            headers['x-request-with'] === 'XMLHttpRequest' &&
            headers['content-type'] === 'application/json; charset=utf-8' &&
            req.session && req.session.csrf &&
            headers['x-request-csrf'] === req.session.csrf) {

            return next();
        }

        next(new Error('非法请求'));
    };

    return exports;
};