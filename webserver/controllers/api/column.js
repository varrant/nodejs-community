/*!
 * 文件描述
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
        if(!permission.can(res.locals.$engineer, 'column')){
            var err = new Error('权限不足');
            err.status = 403;
            return next(err);
        }

        column.find({
            author: res.locals.$engineer.id
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
        var id = req.body.id;

        if(!permission.can(res.locals.$engineer, 'column')){
            var err = new Error('权限不足');
            err.status = 403;
            return next(err);
        }

        if (id) {
            return column.findOneAndUpdate(res.locals.$engineer, {
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

        column.createOne(res.locals.$engineer, req.body, function (err, doc) {
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
     * 删除专栏
     * @param req
     * @param res
     * @param next
     */
    exports.delete = function (req, res, next) {
        if(!permission.can(res.locals.$engineer, 'column')){
            var err = new Error('权限不足');
            err.status = 403;
            return next(err);
        }

        var id = req.body.id;

        column.findOneAndRemove(res.locals.$engineer, {_id: id}, function (err, doc) {
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
