/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 16:13
 */

'use strict';

var setting = require('../../services/').setting;

module.exports = function (app) {
    var exports = {};

    /**
     * 列出类型
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        res.json({
            code: 200,
            data: app.locals.$settings.types
        });
    };


    /**
     * 保存类型
     * @param req
     * @param res
     * @param next
     */
    exports.save = function (req, res, next) {
        var body = req.body;

        return res.json({
            code: 300,
            message: '呵呵'
        });

        setting.set('types', body.types, function (err, doc) {
            if (err) {
                return next(err);
            }

            app.locals.$settings.types = doc.toObject().val;
            res.json({
                code: 200
            });
        });
    };

    return exports;
};
