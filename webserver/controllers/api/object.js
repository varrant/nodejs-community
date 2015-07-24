/*!
 * object 相关 API
 * @author ydr.me
 * @create 2014-12-07 16:51
 */

'use strict';

var object = require('../../services/').object;
var column = require('../../services/').column;
var section = require('../../services/').section;
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
        var conditions = dato.select(req.query, ['section', 'author']);
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
                done(null, cache.get('app.category1List'));
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
        var sectionId = req.query.section;
        var founder = cache.get('app.founder');
        var author = req.session.$developer;
        var configs = cache.get('app.configs');
        var subject = '申请发布文章权限【' + author.githubLogin + '】';
        var body = founder.nickname + '你好，我是' + author.nickname + '，我想申请发布文章权限，我的 github 账号是：' + author.githubLogin;
        var link = 'mailto:' + founder.email + '?subject=' + subject + '&body=' + body;
        var data = {
            categories: cache.get('app.category1List')
        };

        howdo
            // 1. 检查 section 是否存在，以及发布权限
            .task(function (next) {
                section.findOne({_id: sectionId}, function (err, doc) {
                    if (err) {
                        return next(err);
                    }

                    if (!doc) {
                        err = new Error('该板块不存在');
                        err.code = 404;
                        return next(err);
                    }

                    if ((author.role & (1 << doc.role)) === 0) {
                        err = new Error('很抱歉，在该板块你暂无发布权限哦。<a href="' + link + '">点击这里联系管理员申请开通</a>。');
                        err.code = 406;
                        return next(err);
                    }

                    next(null, doc);
                });
            })
            // 2、查找 columns
            .task(function (next) {
                column.find({
                    author: res.locals.$developer.id
                }, function (err, docs) {
                    if (err) {
                        return next(err);
                    }

                    data.columns = docs;
                    next();
                });
            })
            // 3、查找 object
            .task(function (next) {
                if (!req.query.id) {
                    return next();
                }

                object.findOne({_id: id}, {populate: ['author']}, function (err, doc) {
                    if (err) {
                        return next(err);
                    }

                    data.object = doc;
                    next();
                });
            })
            .follow(function (err) {
                if (err) {
                    return next(err);
                }

                res.json({
                    code: 200,
                    data: data
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
