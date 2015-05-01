/*!
 * object 相关 API
 * @author ydr.me
 * @create 2014-12-07 16:51
 */

'use strict';

var object = require('../../services/').object;
var column = require('../../services/').column;
var dato = require('ydr-utils').dato;
var cache = require('ydr-utils').cache;
var filter = require('../../utils/').filter;
var howdo = require('howdo');
var role20 = 1 << 20;
var role19 = 1 << 19;

module.exports = function (app) {
    var exports = {};


    /**
     * 列出符合条件的 object
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        var conditions = dato.pick(req.query, ['section', 'author']);
        var options = filter.skipLimit(req.query);
        var section = conditions.section;

        if (!section) {
            return next();
        }

        var findSection = null;

        dato.each(cache.get('app.sectionList'), function (index, _section) {
            if (_section.id.toString() === section) {
                findSection = _section;
                return false;
            }
        });

        if (!findSection) {
            return next();
        }

        var can = (res.locals.$developer.role & (1 << findSection.role)) !== 0;

        if (!can) {
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        var operator = res.locals.$developer;


        // 有权限管理他人列表：管理员+
        if ((operator.role & role19) !== 0) {
            console.log(conditions.author);
            conditions.author = conditions.author || operator.id;
        } else {
            conditions.author = operator.id;
        }

        howdo
            // 统计总数
            .task(function (done) {
                object.count(conditions, done);
            })
            // 分页查询
            .task(function (done) {
                options.sort = {publishAt: -1};
                object.find(conditions, options, done);
            })
            // 查找 category
            .task(function (done) {
                done(null, cache.get('app.categoryList'));
            })
            // 查找 columns
            .task(function (done) {
                column.find({
                    author: res.locals.$developer.id
                }, done);
            })
            // 异步并行
            .together(function (err, count, docs, categories, columns) {
                if (err) {
                    return next(err);
                }

                docs = docs || [];

                res.json({
                    code: 200,
                    data: {
                        list: docs,
                        count: count,
                        categories: categories,
                        columns: columns
                    }
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

        howdo
            // 查找 columns
            .task(function (done) {
                column.find({
                    author: res.locals.$developer.id
                }, done);
            })
            // 查找 object
            .task(function (done) {
                if (!req.query.id) {
                    return done();
                }

                object.findOne({_id: id}, {populate: ['author']}, done);
            })
            .together(function (err, columns, object) {
                if (err) {
                    return next(err);
                }

                console.log(cache.get('app.categoryList'));
                res.json({
                    code: 200,
                    data: {
                        categories: cache.get('app.categoryList'),
                        columns: columns,
                        object: object
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
        object.createOne(res.locals.$developer, req.body, function (err, doc) {
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
        object.updateOne(res.locals.$developer, {_id: req.body.id}, req.body, function (err, doc) {
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
     * 采纳
     * @param req
     * @param res
     * @param next
     */
    exports.accept = function (req, res, next) {
        var objectId = req.body.object;
        var responseId = req.body.response;

        object.acceptByResponse(res.locals.$developer, {
            _id: objectId
        }, responseId, function (err, newDoc, oldDoc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: oldDoc && oldDoc.acceptByResponse
            });
        });
    };


    exports.remove = function (req, res, next) {
        var id = req.body.id;

        object.findOneAndRemove(res.locals.$developer, {
            _id: id
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200
            });
        });
    };

    return exports;
};
