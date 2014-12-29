/*!
 * notification  API
 * @author ydr.me
 * @create 2014-12-14 19:41
 */

'use strict';

var notification = require('../../services/').notification;
var dato = require('ydr-util').dato;
var filter = require('../../utils/').filter;
var howdo = require('howdo');

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
                code: 200
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
        var conditions = {
            target: res.locals.$engineer.id
        };
        var options = filter.skipLimit(req.query);

        switch (req.query.type) {
            case 'active':
                conditions.hasActived = true;
                break;

            case 'unactive':
                conditions.hasActived = false;
                break;
        }

        options.populate = ['source', 'object', 'response'];
        howdo
            // 计数
            .task(function (done) {
                notification.count(conditions, done);
            })
            // 列表
            .task(function (done) {
                notification.find(conditions, options, done);
            })
            // 异步并行
            .together(function (err, count, list) {
                if (err) {
                    return next(err);
                }

                res.json({
                    code: 200,
                    data: {
                        count: count,
                        list: list
                    }
                });
            });
    };

    return exports;
};
