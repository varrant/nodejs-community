/*!
 * response service
 * @author ydr.me
 * @create 2014-12-12 17:07
 */

'use strict';


var configs = require('../../configs/');
var scoreMap = configs.score;
var scoreUtil = require('../utils/').score;
var response = require('../models/').response;
var object = require('./object.js');
var developer = require('./developer.js');
var notification = require('./notification.js');
var email = require('./email.js');
var notice = require('./notice.js');
var interactive = require('./interactive.js');
var dato = require('ydr-utils').dato;
var howdo = require('howdo');
var log = require('ydr-utils').log;


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
 * 更新
 */
exports.findOneAndUpdate = response.findOneAndUpdate;


/**
 * 创建一条评论/回复
 * @param author {Object} 评论者
 * @param author.id {String} 评论者 ID
 * @param data {Object} 评论数据
 * @param meta {Object} 评论 meta 数据，如IP、UA等
 * @param callback {Function} 回调
 */
exports.createOne = function (author, data, meta, callback) {
    var data2 = dato.select(data, ['content', 'parentResponse', 'object']);
    var atList3 = [];

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
                    err = new Error('评论 object 不存在');
                    err.type = 'notFound';
                    err.code = 404;
                    return next();
                }

                next(err, doc);
            });
        })
        // 2. 检查父级评论是否存在
        .task(function (next, responseObject) {
            if (!data2.parentResponse) {
                return next(null, responseObject);
            }

            response.findOne({
                _id: data2.parentResponse
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

                if (doc.parentResponse) {
                    err = new Error('不能补充他人的回复');
                    return next(err);
                }

                next(err, responseObject, doc);
            });
        })
        // 3. 写入
        .task(function (next, responseObject, parentResponse) {


            response.validator.validateAll(data2, function (err, data3) {
                if (err) {
                    return next(err);
                }

                var atList = data3.atList;

                data3.atList = [];

                howdo
                    .each(atList, function (index, githubLogin, done) {
                        developer.findOne({
                            githubLogin: githubLogin
                        }, function (err, d) {
                            if (d) {
                                atList3.push(d);
                                data3.atList.push(d.id);
                            }

                            done();
                        });
                    })
                    .together(function () {
                        response.createOne(data3, function (err, doc) {
                            next(err, responseObject, parentResponse, doc);
                        });
                    });
            });
        })
        // 顺序串行
        .follow(function (err, responseObject, parentResponse, doc) {
            callback(err, doc, responseObject);

            if (!err && doc) {
                // 数
                // 评论
                if (!doc.parentResponse) {
                    // 作者的评论数量
                    developer.increaseCommentCount({_id: author.id.toString()}, 1, log.holdError);

                    // object 作者的被评论数量
                    developer.increaseCommentByCount({_id: responseObject.author.toString()}, 1, log.holdError);

                    // object 的被评论数量
                    object.increaseCommentByCount({_id: doc.object}, 1, log.holdError);

                    // 写入交互
                    interactive.active({
                        source: author.id.toString(),
                        target: responseObject.author.toString(),
                        type: 'comment',
                        object: responseObject.id.toString(),
                        response: doc.id.toString()
                    }, log.holdError);
                }
                // 回复
                else {
                    // 作者的回复数量
                    developer.increaseReplyCount({_id: author.id.toString()}, 1, log.holdError);

                    // 被回复评论作者的被回复数量
                    developer.increaseReplyByCount({_id: parentResponse.author.toString()}, 1, log.holdError);

                    // object 的被回复数量
                    object.increaseReplyByCount({_id: doc.object}, 1, log.holdError);

                    // response 的被回复数量
                    response.increase({_id: parentResponse.id.toString()}, 'replyByCount', 1, log.holdError);

                    // 写入交互
                    interactive.active({
                        source: author.id.toString(),
                        target: parentResponse.author.toString(),
                        type: 'reply',
                        object: responseObject.id.toString(),
                        response: doc.id.toString()
                    }, log.holdError);
                }


                // 分
                // 评论
                if (!doc.parentResponse) {
                    if (author.id.toString() !== responseObject.author.toString()) {
                        // 增加主动用户评论积分
                        developer.increaseScore({_id: author.id}, scoreMap.comment, log.holdError);
                        // 增加被动用户评论积分
                        developer.increaseScore({_id: responseObject.author.toString()}, scoreUtil.commentBy(author, responseObject.author.toString()), log.holdError);
                    }
                }
                // 回复
                else {
                    if (
                        author.id.toString() !== responseObject.author.toString() &&
                        author.id.toString() !== parentResponse.author.toString()
                    ) {
                        // 增加主动用户回复积分
                        developer.increaseScore({_id: author.id}, scoreMap.reply, log.holdError);
                    }

                    if (
                        author.id.toString() !== responseObject.author.toString()
                    ) {
                        // 增加被动回复文章的作者回复积分
                        developer.increaseScore({_id: responseObject.author.toString()}, scoreUtil.replyBy(author, responseObject.author.toString()), log.holdError);
                    }

                    if (
                        author.id.toString() !== parentResponse.author.toString()
                    ) {
                        // 增加被评论的作者回复积分
                        developer.increaseScore({_id: parentResponse.author.toString()}, scoreUtil.replyBy(author, parentResponse.author.toString()), log.holdError);
                    }
                }


                // 知
                // 通知 object 作者
                _noticeToObjectAuthor(author, responseObject, doc);

                // 回复
                if (doc.parentResponse) {
                    // 通知 comment 作者
                    _noticeToCommentAuthor(author, responseObject, doc, parentResponse);
                } else {
                    // 其他
                    // 推入 object 的 contributors
                    object.pushContributor({_id: doc.object}, author, log.holdError);
                }

                // at
                atList3.forEach(function (atTo) {
                    notice.at(author, atTo, responseObject, doc);
                });
            }
        });
};


/**
 * 赞同/取消赞同某条评论
 * @param operator
 * @param conditions
 * @param callback
 */
exports.agree = function (operator, conditions, callback) {
    howdo
        // 1. 检测该评论是否存在
        .task(function (next) {
            response.findOne(conditions, next);
        })
        // 2. 查找该 object
        .task(function (next, inResponse) {
            if (!inResponse) {
                var err = new Error('该 response 不存在');
                err.code = 404;
                return next(err);
            }

            object.findOne({
                _id: inResponse.object.toString()
            }, function (err, responseAtObject) {
                if (!responseAtObject) {
                    err = new Error('该 object 不存在');
                    err.code = 404;
                    return next(err);
                }

                next(err, inResponse, responseAtObject);
            });
        })
        // 3. 判断用户是否赞同过
        .task(function (next, inResponse, responseAtObject) {
            // 默认点赞
            interactive.toggle({
                source: operator.id.toString(),
                target: inResponse.author.toString(),
                type: 'agree',
                object: responseAtObject.id.toString(),
                response: inResponse.id.toString()
            }, true, function (err, interactiveValue, newInteractive, oldInteractive) {
                next(err, interactiveValue, inResponse, oldInteractive);
            });
        })
        // 4. 写入5个最新赞同用户
        .task(function (next, interactiveValue, inResponse, oldInteractive) {
            interactive.find({
                type: 'agree',
                response: inResponse.id.toString(),
                hasApproved: true
            }, {
                limit: 5,
                sort: {
                    interactiveAt: -1
                },
                populate: ['source']
            }, function (err, fiveInteractive) {
                if (err) {
                    return next(err);
                }

                var agreers = fiveInteractive.map(function (doc) {
                    return doc.source;
                });

                var agreerIds = fiveInteractive.map(function (doc) {
                    return doc.source.id.toString();
                });

                response.findOneAndUpdate({
                    _id: inResponse.id
                }, {
                    agreers: agreerIds
                }, log.holdError);

                next(null, interactiveValue, inResponse, oldInteractive, agreers);
            });
        })
        // 顺序串行
        .follow(function (err, interactiveValue, inResponse, oldInteractive, agreers) {
            callback(err, interactiveValue, agreers);

            if (!err) {
                // 赞
                if (interactiveValue === 1) {
                    howdo
                        // 查 object 作者
                        .task(function (done) {
                            developer.findOne({_id: inResponse.author.toString()}, done);
                        })
                        // 查 object
                        .task(function (done) {
                            object.findOne({_id: inResponse.object}, done);
                        })
                        // 异步并行
                        .together(function (err, agreeByResponseAuthor, agreeInObject) {
                            // 只在第一次赞同时通知
                            if (!err && agreeInObject && !oldInteractive) {
                                // 评论
                                if (inResponse.parentResponse === null) {
                                    notice.agreeComment(operator, agreeByResponseAuthor, agreeInObject, inResponse);
                                }
                                // 回复
                                else {
                                    notice.agreeReply(operator, agreeByResponseAuthor, agreeInObject, inResponse);
                                }
                            }
                        });
                }


                // 赞或取消赞
                if (interactiveValue !== 0) {
                    // 被赞数量
                    response.increase(conditions, 'agreeByCount', interactiveValue, log.holdError);

                    // 用户赞数量
                    developer.increaseAgreeCount({_id: operator.id}, interactiveValue, log.holdError);

                    // 用户被赞数量
                    developer.increaseAgreeByCount({_id: inResponse.author.toString()}, interactiveValue, log.holdError);

                    // 自己加少量分
                    developer.increaseScore({_id: operator.id}, interactiveValue * scoreMap.agree, log.holdError);

                    // 为他人点赞才计分
                    if (inResponse.author.toString() !== operator.id.toString()) {
                        var s = interactiveValue > 0 ?
                            +scoreUtil.agreeBy(operator, inResponse.author.toString()) :
                            -scoreMap.agreeBy;
                        developer.increaseScore({_id: inResponse.author.toString()}, s, log.holdError);
                    }
                }
            }
        });
};


///**
// * 最多推入 5 个最新的赞同者
// * @param conditions {Object} 查询条件
// * @param agreer {Object} 赞同者
// * @param callback {Function} 回调
// */
//exports.pushAgreer = function (conditions, agreer, callback) {
//    object.push(conditions, 'agreers', agreer.id, {maxLength: 5}, callback);
//};


/**
 * 通知 object 作者
 * @param repondAuthor {Object} 评论人
 * @param responseObject {Object} 被评论 object
 * @param response {Object} 评论
 * @private
 */
function _noticeToObjectAuthor(repondAuthor, responseObject, response) {
    howdo
        // 1. 查找 object 作者
        .task(function (next) {
            developer.findOne({_id: responseObject.author.toString()}, next);
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
            notice.toObjectAuthor(repondAuthor, objectAuthor, responseObject, response);
        });
}


/**
 * 通知 comment 作者
 * @param replyAuthor {Object} 回复人
 * @param replyInObject {Object} 回复的 object
 * @param replyResponse {Object} 该回复的 response
 * @param parentResponse {Object} 被回复的 response
 * @private
 */
function _noticeToCommentAuthor(replyAuthor, replyInObject, replyResponse, parentResponse) {
    howdo
        // 1. 查找 parentResponse 作者
        .task(function (next) {
            developer.findOne({_id: parentResponse.author.toString()}, next);
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
            notice.toResponseAuthor(replyAuthor, parentResponseAuthor, replyInObject, replyResponse);
        });
}

