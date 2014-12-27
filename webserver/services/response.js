/*!
 * response service
 * @author ydr.me
 * @create 2014-12-12 17:07
 */

'use strict';


var configs = require('../../configs/');
var response = require('../models/').response;
var object = require('./object.js');
var engineer = require('./engineer.js');
var notification = require('./notification.js');
var email = require('./email.js');
var notice = require('./notice.js');
var interactive = require('./interactive.js');
var dato = require('ydr-util').dato;
var howdo = require('howdo');
var log = require('ydr-log');


/**
 * 查找
 */
exports.findOne = response.findOne;


/**
 * 查找
 */
exports.find = response.find;


/**
 * 查找
 */
exports.count = response.count;


/**
 * 创建一条评论
 * @param author {Object} 评论者
 * @param author.id {String} 评论者 ID
 * @param data {Object} 评论数据
 * @param meta {Object} 评论 meta 数据，如IP、UA等
 * @param callback {Function} 回调
 */
exports.createOne = function (author, data, meta, callback) {
    var data2 = dato.pick(data, ['content', 'parent', 'object']);

    data2.author = author.id;
    data2.meta = meta;

    howdo
        // 1. 检查 object 是否存在
        .task(function (next) {
            object.findOne({
                _id: data2.object
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('评论目标不存在');
                    err.type = 'notFound';
                    err.code = 404;
                    return next();
                }

                next(err, doc);
            });
        })
        // 2. 检查父级评论是否存在
        .task(function (next, responseObject) {
            if (!data2.parent) {
                return next(null, responseObject);
            }

            response.findOne({
                _id: data2.parent
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('父级评论不存在');
                    err.type = 'notFound';
                    err.code = 404;
                    return next(err);
                }

                if (doc.parent) {
                    err = new Error('不能补充他人的回复');
                    return next(err);
                }

                next(err, responseObject, doc);
            });
        })
        // 3. 写入
        .task(function (next, responseObject, parentResponse) {
            response.createOne(data2, function (err, doc) {
                next(err, responseObject, parentResponse, doc);
            });
        })
        // 顺序串行
        .follow(function (err, responseObject, parentResponse, response) {
            callback(err, response);

            if (!err && response) {
                // object.commentByCount
                if (!response.parent) {
                    object.increaseCommentByCount({_id: response.object}, 1, log.holdError);
                }
                // object.replyByCount
                else {
                    object.increaseReplyByCount({_id: response.object}, 1, log.holdError);
                }


                // engineer.commentCount
                if (!response.parent) {
                    engineer.increaseCommentCount({_id: author.id}, 1, log.holdError);
                }
                // engineer.replyCount
                else {
                    engineer.increaseReplyCount({_id: author.id}, 1, log.holdError);
                }

                // 通知 object 作者
                _noticeObjectAuthor(author, responseObject);

                // 推入 object 的 contributors
                object.pushContributor({_id: response.object}, author, log.holdError);

                // 评论父级
                if (parentResponse) {
                    // parentResponse response.replyCount
                    response.increase({_id: parentResponse.id}, 'replyCount', 1, log.holdError);

                    // parentResponse engineer.replyByCount
                    engineer.increaseReplyByCount({_id: parentResponse.author}, 1, log.holdError);

                    // 通知被 reply 作者
                    _noticeCommentAuthor(author, parentResponse);
                }
            }
        });
};


/**
 * 赞同/取消赞同某条评论
 * @param operator
 * @param conditions
 * @param boolean
 * @param callback
 */
exports.agree = function (operator, conditions, callback) {
    howdo
        // 1. 检测该评论是否存在
        .task(function (next) {
            response.findOne(conditions, next);
        })
        // 2. 判断用户是否赞同过
        .task(function (next, doc) {
            if (!doc) {
                var err = new Error('该 response 不存在');
                err.code = 404;
                return next(err);
            }

            // 默认点赞
            interactive.toggle({
                operator: operator.id,
                model: 'response',
                path: 'agreeCount',
                response: doc.id
            }, true, next);
        })
        // 顺序串行
        .follow(function (err, value) {
            // 写入赞同信息
            response.increase(conditions, 'agreeCount', value, log.holdError);
            callback(err, value);
        });
};


/**
 * 通知 object 作者
 * @param repondAuthor {Object} 评论人
 * @param responseObject {Object} 被评论 object
 * @private
 */
function _noticeObjectAuthor(repondAuthor, responseObject) {
    howdo
        // 1. 查找 object 作者
        .task(function (next) {
            engineer.findOne({_id: responseObject.author}, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            if (err) {
                return log.holdError(err);
            }

            if (!doc) {
                err = new Error('该作者不存在');
                err.type = 'notFound';
                err.code = 404;
                return log.holdError(err);
            }

            // 评论通知
            notice.comment(repondAuthor, doc, responseObject);
        });
}


/**
 * 通知 comment 作者
 * @param replyAuthor {Object} 回复人
 * @param parentResponse {Object} 被回复 response
 * @private
 */
function _noticeCommentAuthor(replyAuthor, parentResponse) {
    howdo
        // 1. 查找 parentResponse 作者
        .task(function (next) {
            engineer.findOne({_id: parentResponse.author}, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            if (err) {
                return log.holdError(err);
            }

            if (!doc) {
                err = new Error('该评论作者不存在');
                err.type = 'notFound';
                err.code = 404;
                return log.holdError(err);
            }

            // 回复通知
            notice.reply(replyAuthor, doc, parentResponse);
        });
}

