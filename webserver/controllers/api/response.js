/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:24
 */

'use strict';

var response = require('../../services/').response;
var filter = require('../../utils/').filter;
var howdo = require('howdo');

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
        var parentId = req.query.parent;

        if (!objectId) {
            return next();
        }

        var conditions = {
            object: objectId
        };

        howdo
            // 评论数量
            .task(function (done) {
                response.count(conditions, done);
            })
            // 回复数量
            .task(function (done) {
                if (!parentId) {
                    return done(null, 0);
                }

                if (parentId) {
                    conditions.parent = parentId;
                }

                response.count(conditions, done);
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
     * get 评论/回复列表
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.get = function (req, res, next) {
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
        }

        response.find(conditions, options, function (err, docs) {
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
        
        response.createOne(res.locals.$engineer, req.body, meta, function (err, doc) {
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


    };

    return exports;
};
