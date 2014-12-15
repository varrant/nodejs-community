/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 20:55
 */

'use strict';

var setting = require('../../services/').setting;
var locals = require('../../utils/').locals;

module.exports = function (app) {
    var exports = {};
    /**
     * 列出权限
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        res.json({
            code: 200,
            data: app.locals.$settings.roles
        });
    };


    /**
     * 保存权限
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        setting.set('types', req.body, function (err, doc) {
            if (err) {
                return next(err);
            }

            app.locals.$settings.roles = doc.toObject().val;
            locals.$settings(app);
            res.json({
                code: 200
            });
        });
    };


    return exports;
};
