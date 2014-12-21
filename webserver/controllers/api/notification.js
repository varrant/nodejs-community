/*!
 * notification  API
 * @author ydr.me
 * @create 2014-12-14 19:41
 */

'use strict';

var notification = require('../../services/').notification;
var dato = require('ydr-util').dato;
var filter = require('../../utils/').filter;

module.exports = function (app) {
    var exports = {};

    /**
     * 未读通知计数
     * @param req
     * @param res
     * @param next
     */
    exports.count = function (req, res, next) {
        var userId = res.locals.$engineer.id;

        notification.count({hasActive: false, source: userId}, function (err, count) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: count
            });
        });
    };


    /**
     * 激活通知
     * @param req
     * @param res
     * @param next
     */
    exports.setActive = function (req, res, next) {
        var userId = res.locals.$engineer.id;

        notification.setActive({_id: req.body.id, source: userId}, function (err) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: true
            });
        });
    };


    /**
     * 列出通知
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        var userId = res.locals.$engineer.id;
        var conditions = {activedUser: userId};
        var options = filter.skipLimit(req);

        switch (req.query.type) {
            case 'active':
                conditions.hasActive = true;
                break;

            case 'unactive':
                conditions.hasActive = false;
                break;
        }

        notification.find(conditions, options, function (err, docs) {
            if (err) {
                return next(err);
            }

            docs = docs || [];

            res.json({
                code: 200,
                data: docs
            });
        });
    };

    return exports;
};
