/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-13 23:05
 */

'use strict';

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

        if (!req.session.$user) {
            err = new Error('必须先登录');
            err.redirect = '/';
            return next(err);
        }

        if (req.session.$user.isBlock) {
            err = new Error('您已被禁止登录');
            err.redirect = '/';
            return next(err);
        }

        next();
    };

    return exports;
}


