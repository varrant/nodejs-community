/*!
 * 路由过滤
 * @author ydr.me
 * @create 2014-11-23 13:18
 */

'use strict';

var urlHelper = require('url');
var crypto = require('ydr-utils').encryption;
var dato = require('ydr-utils').dato;
var cache = require('ydr-utils').cache;
var configs = require('../../configs/');
var developer = require('../services/').developer;
var cookie = require('../utils/').cookie;
var REG_ENDXIE = /(\/|\.[^\.\/]+)$/;
var REG_ACCEPT = /^application\/json;\s*charset=utf-8/i;
var REG_SCHEMA = /^https?:\/\/$/i;
var permission = require('../services/').permission;
var csrf = require('ydr-utils').csrf;

csrf.config({
    key: configs.secret.session.secret,
    expires: configs.secret.session.csrfAge
});

module.exports = function (app) {
    var exports = {};

    // 跨域支持
    exports.crossOrigin = function (req, res, next) {
        //res.set('access-control-allow-origin', '*');
        //res.set('access-control-allow-methods', 'get,post');
        //res.set('access-control-allow-headers', 'x-request-with');
        next();
    };


    /**
     * 严格路由
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.strictRouting = function (req, res, next) {
        var urlParser = urlHelper.parse(req.originalUrl);
        var pathname = urlParser.pathname;
        var search = urlParser.search;

        res.set('x-frame-options', 'sameorigin');
        res.set('x-website-author', 'ydr.me');
        res.set('x-ua-compatible', 'IE=Edge,chrome=1');

        if (!REG_ENDXIE.test(pathname)) {
            return res.redirect(pathname + '/' + (search ? search : ''));
        }

        next();
    };


    /**
     * 严格头信息
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.strictHost = function (req, res, next) {
        if (configs.app.env === 'dev') {
            return next();
        }

        var reqHost = req.headers.host;
        var configHost = configs.app.host.toLowerCase();
        var schema = configHost.replace(reqHost, '');

        if (REG_SCHEMA.test(schema)) {
            return next();
        }

        var urlParser = urlHelper.parse(req.originalUrl);
        var pathname = urlParser.pathname;
        var search = urlParser.search;

        res.redirect(configs.app.host.toLowerCase() + pathname + (search ? search : ''));
    };


    /**
     * 创建 csrf
     * @param req
     * @param res
     * @param next
     */
    exports.createCsrf = function (req, res, next) {
        req.session.$csrf = res.locals.$csrf = csrf.create();
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
            csrf.validate(req.session.$csrf, headersCsrf)
        ) {
            return next();
        }

        //if (req.session.$csrf && req.session.$csrf !== headersCsrf) {
        //    err = new Error('当前会话信息不正确，请稍后再试');
        //    err.code = 406;
        //    err.data = req.session.$csrf;
        //    return next(err);
        //}

        err = new Error('当前会话信息已过期，请稍后再试');
        err.code = 400;
        next(err);
    };


    /**
     * 读取请求信息中的用户数据
     * @param req
     * @param res
     * @param next
     */
    exports.readDeveloper = function (req, res, next) {
        if (!req.cookies) {
            return next();
        }

        var userCookie = req.cookies[configs.secret.cookie.userKey];

        // 不存在 cookie
        if (!userCookie) {
            cookie.logout(req, res);
            return next();
        }

        var developerId = crypto.decode(userCookie, configs.secret.cookie.secret);

        // 解析错误
        if (!developerId) {
            cookie.logout(req, res);
            return next();
        }

        // 与 session 不匹配
        if (req.session.$developer && req.session.$developer.id !== developerId) {
            cookie.logout(req, res);
            return next();
        }

        // 与 session 匹配
        if (req.session.$developer && req.session.$developer.id === developerId) {
            res.locals.$developer = req.session.$developer;

            var modifyDevelopers = cache.get('modify.developers');

            if (modifyDevelopers[developerId]) {
                res.locals.$developer = req.session.$developer = modifyDevelopers[developerId];
                cache.removeProp('modify.developers', developerId);
            }

            return next();
        }

        //var developerId = '54a4cb2777421233efe45af8';

        // 不存在则读取数据库
        developer.findOne({_id: developerId}, function (err, doc) {
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


    // 版块
    exports.readSection = function (req, res, next) {
        res.locals.$sectionList = cache.get('app.sectionList');
        res.locals.$sectionIDMap = cache.get('app.sectionIDMap');
        res.locals.$sectionURIMap = cache.get('app.sectionURIMap');
        next();
    };


    // 读取权限
    exports.readPermission = function (req, res, next) {
        var $developer = res.locals.$developer;
        var $sectionURIMap = cache.get('app.sectionURIMap');

        console.log($sectionURIMap);

        res.locals.$permission = {
            column: permission.can($developer, 'column'),
            help: ($developer.role & $sectionURIMap.help.role) !== 0
        };
        next();
    };


    // 读取当前 url
    exports.readURL = function (req, res, next) {
        res.locals.$url = urlHelper.parse(req.originalUrl, true, true);
        next();
    };


    // 读取当前 url
    exports.readSettings = function (req, res, next) {
        res.locals.$settings = cache.get('app.settings');
        next();
    };

    return exports;
};