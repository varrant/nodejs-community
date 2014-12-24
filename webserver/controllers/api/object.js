/*!
 * object 相关 API
 * @author ydr.me
 * @create 2014-12-07 16:51
 */

'use strict';

var object = require('../../services/').object;
var dato = require('ydr-util').dato;
var filter = require('../../utils/').filter;
var howdo = require('howdo');

module.exports = function (app) {
    var exports = {};
    var uris = app.locals.$section.map(function (section) {
        return section.uri;
    });
    var sectionMap = {};

    app.locals.$section.forEach(function (section) {
        sectionMap[section.uri] = section;
    });


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

        var can = (res.locals.$engineer.role & Math.pow(2, sectionMap[type].role)) > 0;

        if (!can) {
            var err = new Error('权限不足');
            err.status = 403;
            return next(err);
        }

        howdo
            // 统计总数
            .task(function (done) {
                object.count(conditions, done);
            })
            // 分页查询
            .task(function (done) {
                object.find(conditions, options, done);
            })
            // 异步并行
            .together(function (err, count, docs) {
                if (err) {
                    return next(err);
                }

                docs = docs || [];

                res.json({
                    code: 200,
                    count: count,
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
        var id = req.query.id;

        if (!req.query.id) {
            var err = new Error('不存在');
            err.status = 404;
            return next(err);
        }

        object.findOne({_id: id}, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: {
                    category: app.locals.$category,
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
        object.updateOne(res.locals.$engineer, {_id: req.body.id}, req.body, function (err, doc) {
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
