/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:41
 */

'use strict';

var notification = require('../../services/').notification;

module.exports = function (app) {
    var exports = {};

    /**
     * 未读通知计数
     * @param req
     * @param res
     * @param next
     */
    exports.count = function (req, res, next) {
        notification.count({hasActived: false}, function (err, count) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: count
            });
        });
    };

    return exports;
};
