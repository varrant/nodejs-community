/*!
 * response service
 * @author ydr.me
 * @create 2014-12-12 17:07
 */

'use strict';


var configs = require('../../configs/');
var scoreMap = configs.score;
var response = require('../models/').response;
var object = require('./object.js');
var developer = require('./developer.js');
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
        .follow(function (err, responseObject, parentResponse, doc) {
            callback(err, doc);

            if (!err && doc) {
                // 数
                // 评论
                if (!doc.parent) {
                    // 作者的评论数量
                    developer.increaseCommentCount({_id: author.id}, 1, log.holdError);
                    // object 的被评论数量
                    object.increaseCommentByCount({_id: doc.object}, 1, log.holdError);
                }
                // 回复
                else {
                    // 作者的回复数量
                    developer.increaseReplyCount({_id: author.id}, 1, log.holdError);
                    // 被回复评论作者的被回复数量
                    developer.increaseReplyByCount({_id: parentResponse.author}, 1, log.holdError);
                    // object 的被回复数量
                    object.increaseReplyByCount({_id: doc.object}, 1, log.holdError);
                    // response 的被回复数量
                    response.increase({_id: parentResponse.id}, 'replyByCount', 1, log.holdError);
                }


                // 分
                // 评论
                if(!doc.parent){
                    if (author.id.toString() !== responseObject.author.toString()) {
                        // 增加主动用户评论积分
                        developer.increaseScore({_id: author.id}, scoreMap.comment, log.holdError);
                        // 增加被动用户评论积分
                        developer.increaseScore({_id: responseObject.author}, scoreMap.commentBy, log.holdError);
                    }
                }
                // 回复
                else{
                    if (author.id.toString() !== responseObject.author.toString() &&
                        author.id.toString() !== parentResponse.author.toString()) {
                        // 增加主动用户回复积分
                        developer.increaseScore({_id: author.id}, scoreMap.reply, log.holdError);
                        // 增加被动用户回复积分
                        developer.increaseScore({_id: responseObject.author}, scoreMap.replyBy, log.holdError);
                        // 增加被动用户回复积分
                        developer.increaseScore({_id: parentResponse.author}, scoreMap.replyBy, log.holdError);
                    }
                }



                // 知
                // 评论
                if(!doc.parent){
                    // 通知 object 作者
                    _noticeObjectAuthor(author, responseObject, doc);
                }
                // 回复
                else{
                    // 通知被 reply 作者
                    _noticeCommentAuthor(author, responseObject, parentResponse);
                }


                // 其他
                // 推入 object 的 contributors
                object.pushContributor({_id: doc.object}, author, log.holdError);
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
            }, true, function (err, value) {
                next(err, value, doc);
            });
        })
        // 顺序串行
        .follow(function (err, value, agreeByResponse) {
            callback(err, value);

            if (!err) {
                // 写入赞同信息
                response.increase(conditions, 'agreeByCount', value, log.holdError);

                // 用户被赞数量
                developer.increaseAgreeByCount({_id: agreeByResponse.author}, value, log.holdError);

                // 为他人点赞才计分
                if (agreeByResponse.author.toString() !== operator.id.toString()) {
                    // 点赞、消赞
                    if (value !== 0) {
                        developer.increaseScore({_id: agreeByResponse.author}, value * scoreMap.agreeBy, log.holdError);
                    }

                    // 为他人点赞
                    if (value === 1) {
                        howdo
                            // 查 object 作者
                            .task(function (done) {
                                developer.findOne({_id: agreeByResponse.author}, done);
                            })
                            // 查 object
                            .task(function (done) {
                                object.findOne({id: agreeByResponse.object}, done);
                            })
                            // 异步并行
                            .together(function (err, agreeInObjectAuthor, agreeInObject) {

                                if (!err && agreeInObjectAuthor && agreeInObject) {
                                    // 评论
                                    if (agreeByResponse.parent === null) {
                                        notice.agreeComment(operator, agreeInObjectAuthor, agreeInObject, agreeByResponse);
                                    }
                                    // 回复
                                    else {
                                        notice.agreeReply(operator, agreeInObjectAuthor, agreeInObject, agreeByResponse);
                                    }
                                }
                            });
                    }
                }

                // 点赞、消赞
                if (value !== 0) {
                    // 自己加少量分
                    developer.increaseScore({_id: operator.id}, value * scoreMap.agree, log.holdError)
                }
            }
        });
};


/**
 * 通知 object 作者
 * @param repondAuthor {Object} 评论人
 * @param responseObject {Object} 被评论 object
 * @param responseComment {Object} 评论
 * @private
 */
function _noticeObjectAuthor(repondAuthor, responseObject, responseComment) {
    howdo
        // 1. 查找 object 作者
        .task(function (next) {
            developer.findOne({_id: responseObject.author}, next);
        })
        // 顺序串行
        .follow(function (err, objectAuthor) {
            if (err) {
                return log.holdError(err);
            }

            if (!objectAuthor) {
                err = new Error('该作者不存在');
                err.type = 'notFound';
                err.code = 404;
                return log.holdError(err);
            }

            // 评论通知
            notice.comment(repondAuthor, objectAuthor, responseObject, responseComment);
        });
}


/**
 * 通知 comment 作者
 * @param replyAuthor {Object} 回复人
 * @param replyInObject {Object} 回复的 object
 * @param parentResponse {Object} 被回复 response
 * @private
 */
function _noticeCommentAuthor(replyAuthor, replyInObject, parentResponse) {
    howdo
        // 1. 查找 parentResponse 作者
        .task(function (next) {
            developer.findOne({_id: parentResponse.author}, next);
        })
        // 顺序串行
        .follow(function (err, parentResponseAuthor) {
            if (err) {
                return log.holdError(err);
            }

            if (!parentResponseAuthor) {
                err = new Error('该评论作者不存在');
                err.type = 'notFound';
                err.code = 404;
                return log.holdError(err);
            }

            // 回复通知
            notice.reply(replyAuthor, parentResponseAuthor, replyInObject, parentResponse);
        });
}

