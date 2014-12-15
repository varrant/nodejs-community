/*!
 * notification  API
 * @author ydr.me
 * @create 2014-12-14 19:41
 */

'use strict';

var notification = require('../../services/').notification;
var dato = require('ydr-util').dato;

module.exports = function (app) {
    var exports = {};

    /**
     * 未读通知计数
     * @param req
     * @param res
     * @param next
     */
    exports.count = function (req, res, next) {
        var userId = res.locals.$user._id;

        notification.count({hasActived: false, activedUser: userId}, function (err, count) {
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
    exports.setActived = function (req, res, next) {
        var userId = res.locals.$user._id;

        notification.setActived({_id: req.body.id, activedUser: userId}, function (err) {
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
    exports.list = function (req, res, next) {
        var page = dato.parseInt(req.query.page, 1);
        var limit = dato.parseInt(req.query.limit, 10);
        var actived = req.query.actived === 'true' ? true : false;
        var userId = res.locals.$user._id;
        var conditions = {activedUser: userId};

        if(page < 1){
            page = 1;
        }

        switch (req.query.type) {
            case 'actived':
                conditions.hasActived = true;
                break;

            case 'unactived':
                conditions.hasActived = false;
                break;
        }

        notification.find(conditions, {
            skip: (page - 1 ) * limit,
            limit: limit
        }, function (err, docs) {
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
