/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:54
 */

'use strict';

var scope = require('../../services/').scope;
var typeis = require('ydr-util').typeis;
var howdo = require('howdo');

module.exports = function (app) {
    var exports = {};


    /**
     * 列出所有 scope
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        scope.find({}, function (err, docs) {
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


    /**
     * 创建一个 scope
     * @param req
     * @param res
     * @param next
     */
    exports.post = function (req, res, next) {
        scope.createOne(req.body, function (err, doc) {
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
     * 更新或创建一个 scope
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        scope.existOne({_id: req.body._id}, req.body, function (err, doc) {
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
     * 删除 scope
     * @param req
     * @param res
     * @param next
     */
    exports.delete = function (req, res, next) {
        scope.findOneAndRemove({_id: req.body.id}, function (err) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: true
            });
        });
    };

    return exports;
}
