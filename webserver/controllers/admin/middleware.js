/*!
 * admin middleware controller
 * @author ydr.me
 * @create 2014-12-13 23:05
 */

'use strict';
var setting = require('../../services/').setting;

module.exports = function (app) {
    var exports = {};

    /**
     * 检查是否有登录信息并且是否有权限访问
     * @param req
     * @param res
     * @param next
     */
    exports.login = function (req, res, next) {
        var err;

        if (!req.session.$developer || !req.session.$developer.id) {
            err = new Error('请确认登录后再继续刚才操作。');
            err.redirect = '/developer/oauth/authorize/';
            err.code = 401;
            req.session.$redirect = req.originalUrl;
            return next(err);
        }

        if (req.session.$developer.isBlock) {
            err = new Error('您已被禁止访问管理后台，如有疑问请联系管理员。');
            err.redirect = '/';
            err.code = 403;
            return next(err);
        }

        next();
    };

    return exports;
};


