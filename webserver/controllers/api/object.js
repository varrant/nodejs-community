/*!
 * object 相关 API
 * @author ydr.me
 * @create 2014-12-07 16:51
 */

'use strict';

var object = require('../../services/').object;
var scope = require('../../services/').scope;
var dato = require('ydr-util').dato;
var filter = require('../../utils/filter.js');
var howdo = require('howdo');

module.exports = function (app) {
    var exports = {};
    var uris = app.locals.$settings._displayTypeUris;

    /**
     * 列出符合条件的 object
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        var conditions = dato.pick(req.query, ['type', 'author']);
        var options = filter.skipLimit(req);
        var type = conditions.type;

        // 未指定 type 直接返回空
        if (!type) {
            return res.json({
                code: 200,
                data: []
            });
        }

        // 不显示的 type 直接输出空
        if (type && uris.indexOf(type) === -1) {
            return res.json({
                code: 200,
                data: []
            });
        }

        var can = (res.locals.$engineer.role & app.locals.$settings._typesMap[type].roleVal) > 0;

        if (!can) {
            return res.json({
                code: 403,
                data: [],
                message: '无权限'
            });
        }

        object.find(conditions, options, function (err, docs) {
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
     * 根据条件获取 object
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        howdo
            // 查找 scope
            .task(function (done) {
                scope.find({}, done);
            })
            // 查找 object
            .task(function (done) {
                if (!req.query.id) {
                    return done();
                }

                object.findOne({_id: req.query.id}, done);
            })
            .together(function (err, docs, doc) {
                if (err) {
                    return next(err);
                }

                res.json({
                    code: 200,
                    data: {
                        scopes: docs,
                        object: doc
                    }
                });
            });
    };


    /**
     * 创建一个新的 object
     * @param req
     * @param res
     * @param next
     */
    exports.post = function (req, res, next) {
        object.createOne(res.locals.$engineer, req.body, function (err, doc) {
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
     * 更新一个已有的 object
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        object.updateOne(res.locals.$engineer, {_id: req.body._id}, req.body, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: doc
            });
        });
    };

    return exports;
};
