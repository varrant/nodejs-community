/*!
 * comment service
 * @author ydr.me
 * @create 2014-12-12 17:07
 */

'use strict';


var configs = require('../../configs/');
var notiComment = configs.notification.comment;
var notiReply = configs.notification.reply;
var comment = require('../models/').comment;
var object = require('./object.js');
var engineer = require('./engineer.js');
var notification = require('./notification.js');
var email = require('./email.js');
var dato = require('ydr-util').dato;
var howdo = require('howdo');
var log = require('ydr-log');


/**
 * 查找
 */
exports.findOne = comment.findOne;


/**
 * 查找
 */
exports.find = comment.find;


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
                    err = new Error('the object is not exist');
                    err.type = 'notFound';
                    return next(err);
                }

                next();
            });
        })
        // 2. 检查父级分类是否存在
        .task(function (next) {
            if (!data2.parent) {
                return next();
            }

            comment.findOne({
                _id: data2.parent
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('the parent is not exist');
                    err.type = 'notFound';
                    return next(err);
                }

                if(doc){

                }

                next(err, doc);
            });
        })
        // 3. 写入
        .task(function (next, parent) {
            comment.createOne(data2, function (err, doc) {
                next(err, doc, parent);
            });
        })
        // 顺序串行
        .follow(function (err, doc, parent) {
            callback(err, doc);

            if (!err && doc) {
                // object.commentCount
                object.increaseCommentByCount({_id: doc.object}, 1, log.holdError);

                // engineer.commentCount
                engineer.increaseCommentCount({_id: author.id}, 1, log.holdError);

                // 通知 object 作者
                _noticeObjectAuthor(author.id, doc.object);

                // 推入 object 的 contributors
                object.pushContributor({_id: doc.object}, author, log.holdError);

                // 评论父级
                if (parent) {
                    // commnet2.replyCount
                    comment.increase({_id: parent.id}, 'replyCount', 1, function (err, doc) {
                        if (err) {
                            return log.holdError(err);
                        }

                        // 忽略错误
                        if (doc) {
                            // user2.repliedCount
                            engineer.increaseReplyByCount({_id: doc.author}, 1, log.holdError);
                        }
                    });

                    // 通知被 comment 作者
                    _noticeCommentAuthor(author.id, parent);
                }
            }
        });
};


/**
 * 通知 object 作者
 * @param activeUserId
 * @param objectId
 * @private
 */
function _noticeObjectAuthor(source, objectId) {
    howdo
        // 1. 查找 object
        .task(function (next) {
            object.findOne({_id: objectId}, next);
        })
        // 2. 查找 object 作者
        .task(function (next, doc) {
            engineer.findOne({_id: doc.author}, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            if (err) {
                return log.holdError(err);
            }

            if (!doc) {
                err = new Error('the object author is not exist');
                err.type = 'notFound';
                return log.holdError(err);
            }

            // 通知 object 作者
            notification.createOne({
                type: 'comment',
                source: source,
                target: doc.id,
                object: objectId
            }, log.holdError);

            var subject = notiComment.subject;
            var content = notiComment.template.render({});

            // 邮件 object 作者
            email.send(doc.nickname, doc.email, subject, content);
        });
}


/**
 * 通知 comment 作者
 * @param commentId
 * @private
 */
function _noticeCommentAuthor(source, comment) {
    howdo
        // 1. 查找 comment 作者
        .task(function (next) {
            engineer.findOne({_id: comment.author}, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            if (err) {
                return log.holdError(err);
            }

            if (!doc) {
                err = new Error('the comment author is not exist');
                err.type = 'notFound';
                return log.holdError(err);
            }

            // 通知 object 作者
            notification.createOne({
                type: 'comment',
                source: source,
                target: doc.id,
                object: comment.id
            }, log.holdError);

            var subject = notiReply.subject;
            var content = notiReply.template.render({});

            // 邮件 object 作者
            email.send(doc.nickname, doc.email, subject, content);
        });
}

