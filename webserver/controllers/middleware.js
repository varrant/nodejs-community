/*!
 * 路由过滤
 * @author ydr.me
 * @create 2014-11-23 13:18
 */

'use strict';

var URL = require('url');
var ydrUtil = require('ydr-util');
var configs = require('../../configs/');
var REG_ENDXIE = /(\/|\.[^\.\/]+)$/;
var REG_ACCEPT = /^application\/json;\s*charset=utf-8$/i;

module.exports = function (app) {
    var exports = {};


    /**
     * 严格路由
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.strictRouting = function (req, res, next) {
        var urlParser = URL.parse(req.url);
        var pathname = urlParser.pathname;
        var search = urlParser.search;

        res.set('X-Frame-Options', 'deny');
        res.set('X-Website-Author', 'ydr.me');

        if (!REG_ENDXIE.test(pathname)) {
            return res.redirect(pathname + '/' + (search ? search : ''));
        }

        next();
    };


    /**
     * 创建 csrf
     * @param req
     * @param res
     * @param next
     */
    exports.createCsrf = function (req, res, next) {
        var csrf = _generatorCsrf();

        req.session.csrf = res.locals.$csrf = csrf;
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

        if (REG_ACCEPT.test(headers.accept) &&
            headers['x-request-with'] === 'XMLHttpRequest' &&
            req.session && req.session.csrf &&
            headersCsrf === req.session.csrf
        ) {

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
    var timeString = ydrUtil.dato.parseInt(Date.now() / configs.secret.session.csrfAge, 0) + '';
    var csrf = ydrUtil.crypto.encode(timeString, configs.secret.session.secret);

    return csrf;
}
