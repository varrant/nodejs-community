/*!
 * 文件描述
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

        if (!req.session.$engineer) {
            err = new Error('您尚未登录，或登录信息已过期。');
            err.redirect = '/';
            err.code = 401;
            return next(err);
        }

        if (req.session.$engineer.isBlock) {
            err = new Error('您已被禁止访问管理后台，如有疑问请联系管理员。');
            err.redirect = '/';
            err.code = 403;
            return next(err);
        }

        next();
    };

    return exports;
}


