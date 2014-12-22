/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 20:20
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
    exports.get = function (req, res, next) {
        res.json({
            code: 200,
            data: app.locals.$settings
        });
    };


    /**
     * 保存配置
     * @param key
     */
    exports.put = function (key) {
        return function (req, res, next) {
            setting.set(key, req.body, function (err, doc) {
                if (err) {
                    return next(err);
                }

                app.locals.$settings[key] = doc.val;
                locals.$settings(app);
                res.json({
                    code: 200,
                    data: app.locals.$settings[key]
                });
            });
        };
    };


    return exports;
}
