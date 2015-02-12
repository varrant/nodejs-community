/*!
 * api column controller
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var column = require('../../services/').column;
var permission = require('../../services/').permission;
var dato = require('ydr-util').dato;

module.exports = function (app) {
    var exports = {};

    /**
     * 获取所有版块
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        if(!permission.can(res.locals.$developer, 'column')){
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        column.find({
            author: res.locals.$developer.id
        }, function (err, docs) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: docs
            });
        });
    };


    /**
     * 新建/保存版块
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        if(!permission.can(res.locals.$developer, 'column')){
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        var id = req.body.id;

        if (id) {
            return column.updateOne(res.locals.$developer, {
                _id: id
            }, req.body, function (err, doc) {
                if (err) {
                    return next(err);
                }

                res.json({
                    code: 200,
                    data: doc
                });
            });
        }

        column.createOne(res.locals.$developer, req.body, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: doc
            });
        });
    };


    /**
     * 删除专辑
     * @param req
     * @param res
     * @param next
     */
    exports.delete = function (req, res, next) {
        if(!permission.can(res.locals.$developer, 'column')){
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        var id = req.body.id;

        column.removeOne(res.locals.$developer, {_id: id}, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200
            });
        });
    };

    return exports;
}
