/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 13:18
 */

'use strict';

var ydrUtil = require('ydr-util');
var config = require('../../webconfig/');

module.exports = function (app) {
    var exports = {};


    /**
     * 创建 csrf
     * @param req
     * @param res
     * @param next
     */
    exports.createCsrf = function (req, res, next) {
        var csrf = _generatorCsrf();

        req.session.csrf = res.locals._csrf = csrf;
        console.log(res.locals._csrf);
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
        var headersCsrf = headers['x-request-csrf'];

        if (headers.accept === 'application/json' &&
            headers['x-request-with'] === 'XMLHttpRequest' &&
            headers['content-type'] === 'application/json; charset=utf-8' &&
            req.session && req.session.csrf &&
            headersCsrf === req.session.csrf) {

            return next();
        }

        if (req.session.csrf && req.session.csrf !== headersCsrf) {
            return next(new Error('请求认证已过期'));
        }

        next(new Error('非法请求'));
    };

    return exports;
};


/**
 * 生成 csrf
 * @retunrs {String}
 * @private
 */
function _generatorCsrf() {
    var timeString = ydrUtil.dato.parseInt(Date.now() / config.secret.session.csrfAge, 0) + '';
    var csrf = ydrUtil.crypto.encode(timeString, config.secret.session.secret);

    return csrf;
}
