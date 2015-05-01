/*!
 * setting api controller
 * @author ydr.me
 * @create 2014-12-20 20:20
 */

'use strict';

var cache = require('ydr-utils').cache;
var setting = require('../../services/').setting;
var permission = require('../../services/').permission;

module.exports = function (app) {
    var exports = {};

    /**
     * 列出配置
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        if (!permission.can(res.locals.$developer, 'setting')) {
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }
        res.json({
            code: 200,
            data: cache.get('app.settings')
        });
    };


    /**
     * 保存配置
     * @param key
     */
    exports.put = function (key) {
        return function (req, res, next) {
            if (!permission.can(res.locals.$developer, 'setting')) {
                var err = new Error('权限不足');
                err.code = 403;
                return next(err);
            }

            setting.set(key, req.body, function (err, doc) {
                if (err) {
                    return next(err);
                }

                cache.get('app.settings')[key] = doc.val;
                res.json({
                    code: 200,
                    data: cache.get('app.settings')[key]
                });
            });
        };
    };


    return exports;
}
