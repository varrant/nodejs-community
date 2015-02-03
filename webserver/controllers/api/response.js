/*!
 * response api controller
 * @author ydr.me
 * @create 2014-12-26 14:24
 */

'use strict';

var response = require('../../services/').response;
var object = require('../../services/').object;
var filter = require('../../utils/').filter;
var howdo = require('howdo');
var dato = require('ydr-util').dato;

module.exports = function (app) {
    var exports = {};

    /**
     * 计数
     * @param req
     * @param res
     * @param next
     */
    exports.count = function (req, res, next) {
        var objectId = req.query.object;

        if (!objectId) {
            return next();
        }

        howdo
            // 评论数量
            .task(function (done) {
                var conditions = {
                    object: objectId,
                    parent: null
                };

                response.count(conditions, done);
            })
            // 回复数量
            .task(function (done) {
                var conditions = {
                    object: objectId
                };
                response.count(conditions, {
                    nor: {
                        parent: null
                    }
                }, done);
            })
            .together(function (err, commentCount, replyCount) {
                if (err) {
                    return next(err);
                }

                res.json({
                    code: 200,
                    data: {
                        comment: commentCount,
                        reply: replyCount
                    }
                });
            });
    };


    /**
     * 获取某条评论
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        var id = req.query.id;

        response.findOne({_id: id}, function (err, doc) {
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
     * list 评论/回复列表
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.list = function (req, res, next) {
        var options = filter.skipLimit(req.query);
        var objectId = req.query.object;
        var parentId = req.query.parent;

        if (!objectId) {
            return next();
        }

        var conditions = {
            object: objectId
        };

        if (parentId) {
            conditions.parent = parentId;
        } else {
            conditions.parent = null;
        }

        options.populate = ['author', 'agreers'];

        howdo
            // 1. 查找 object
            .task(function (next) {
                object.findOne({
                    _id: objectId,
                    isDisplay: true
                }, next);
            })
            .follow(function (err, responseByObject) {
                if (err) {
                    return next(err);
                }

                if (!responseByObject) {
                    return next();
                }

                var acceptResponseId = responseByObject.acceptByResponse;

                howdo
                    //1. count
                    .task(function (done) {
                        response.count(conditions, done);
                    })
                    //2. list
                    .task(function (done) {
                        // 有采纳答案 && 列出第一页，
                        // 将最佳答案排除，并列到第一位
                        if (acceptResponseId && options.page === 1 && !parentId) {
                            options.nor = {
                                _id: acceptResponseId
                            };
                        }

                        howdo
                            // 最佳
                            .task(function (done) {
                                if (!acceptResponseId || options.page > 1 || parentId) {
                                    return done(null, null);
                                }

                                response.findOne({_id: acceptResponseId}, {populate: ['author', 'agreers']}, done);
                            })
                            // 列表
                            .task(function (done) {
                                response.find(conditions, options, done);
                            })
                            // 合并
                            .together(function (err, acceptByResponse, responseList) {
                                var list = [];

                                if (acceptByResponse) {
                                    list.push(acceptByResponse);
                                }

                                if (responseList) {
                                    list = list.concat(responseList);
                                }

                                done(err, list);
                            });
                    })
                    // 异步并行
                    .together(function (err, count, list) {
                        if (err) {
                            return next(err);
                        }

                        list.forEach(function (item) {
                            item.author = dato.pick(item.author, ['id', 'nickname', 'githubLogin', 'githubId', 'score', 'avatar']);
                            item.agreers = item.agreers.map(function (agreer) {
                                return dato.pick(agreer, ['id', 'nickname', 'githubLogin', 'avatarM']);
                            });
                        });

                        res.json({
                            code: 200,
                            data: {
                                count: count,
                                list: list
                            }
                        });
                    });
            });

    };


    /**
     * 写入评论/回复
     * @param req
     * @param res
     * @param next
     */
    exports.post = function (req, res, next) {
        var meta = {
            ua: req.headers['user-agent'],
            ip: req.ip
        };

        response.createOne(res.locals.$developer, req.body, meta, function (err, doc) {
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
     * 赞同某条 comment
     */
    exports.agree = function (req, res, next) {
        var id = req.body.id;

        response.agree(res.locals.$developer, {_id: id}, function (err, value, agreers) {
            if (err) {
                return next(err);
            }

            agreers = agreers.map(function (agreer) {
                return dato.pick(agreer, ['id', 'nickname', 'avatarM', 'githubLogin']);
            });

            return res.json({
                code: 200,
                data: {
                    value: value,
                    agreers: agreers
                }
            });
        });
    };


    return exports;
};
