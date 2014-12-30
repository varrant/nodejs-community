/*!
 * 路由过滤
 * @author ydr.me
 * @create 2014-11-23 13:18
 */

'use strict';

var URL = require('url');
var crypto = require('ydr-util').crypto;
var dato = require('ydr-util').dato;
var configs = require('../../configs/');
var developer = require('../services/').developer;
var cookie = require('../utils/').cookie;
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

        res.set('x-frame-options', 'sameorigin');
        res.set('x-website-author', 'ydr.me');

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

        req.session.$csrf = res.locals.$csrf = csrf;
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
        var err;

        if (REG_ACCEPT.test(headers.accept) &&
            headers['x-request-with'] === 'XMLHttpRequest' &&
            req.session && req.session.$csrf &&
            headersCsrf === req.session.$csrf
        ) {
            return next();
        }

        if (req.session.$csrf && req.session.$csrf !== headersCsrf) {
            err = new Error('当前会话信息不正确，请稍后再试');
            err.code = 406;
            err.data = req.session.$csrf;
            return next(err);
        }

        err = new Error('当前会话信息不合法，请稍后再试');
        err.code = 400;
        err.data = req.session.$csrf;
        next(err);
    };


    /**
     * 读取请求信息中的用户数据
     * @param req
     * @param res
     * @param next
     */
    exports.readEngineer = function (req, res, next) {
        if (!req.cookies) {
            return next();
        }

        var userCookie = req.cookies[configs.secret.cookie.userKey];

        // 不存在 cookie
        if (!userCookie) {
            cookie.logout(req, res);
            return next();
        }

        var userId = crypto.decode(userCookie, configs.secret.cookie.secret);

        // 解析错误
        if (!userId) {
            cookie.logout(req, res);
            return next();
        }

        // 与 session 不匹配
        if (req.session.$developer && req.session.$developer.id !== userId) {
            cookie.logout(req, res);
            return next();
        }

        // 与 session 匹配
        if (req.session.$developer && req.session.$developer.id === userId) {
            res.locals.$developer = req.session.$developer;
            return next();
        }

        developer.findOne({_id: userId}, function (err, doc) {
            if (err) {
                cookie.logout(req, res);
                return next(err);
            }

            // 静默失败
            if (!doc) {
                //err = new Error('the user is not exist');
                //err.type = 'notFound';
                //err.redirect = '/';
                cookie.logout(req, res);
                return next();
            }

            req.session.$developer = res.locals.$developer = doc;
            next();
        });
    };

    return exports;
};


/**
 * 生成 csrf
 * @retunrs {String}
 * @private
 */
function _generatorCsrf() {
    var timeString = dato.parseInt(Date.now() / configs.secret.session.csrfAge, 0) + '';
    var csrf = crypto.encode(timeString, configs.secret.session.secret);

    return csrf;
}
