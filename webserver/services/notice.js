/*!
 * 通知
 * 包括 notification.createOne
 * 包括 email.send
 * @author ydr.me
 * @create 2014-12-26 10:15
 */

'use strict';

var configs = require('../../configs/');
var notification = require('./notification.js');
var log = require('ydr-log');
var email = require('./email.js');


/**
 * 评论通知
 * @param sourceEngineer {Object} 评论人
 * @param targetEngineer {Object} object 作者
 * @param object {commentByObject} 被评论的 object
 */
exports.comment = function (sourceEngineer, objectAuthor, commentByObject) {
    // 1. 站内通知
    notification.createOne({
        type: 'comment',
        source: sourceEngineer.id,
        target: objectAuthor.id,
        object: commentByObject.id
    }, log.holdError);

    // 2. 邮件通知
    var notiComment = configs.notification.comment;
    var subject = notiComment.subject;
    var content = notiComment.template.render({});
    email.send(objectAuthor, subject, content);
};


/**
 * 回复通知
 * @param sourceEngineer {Object} 评论人
 * @param targetEngineer {Object} object 作者
 * @param object {replyByComment} 被 reply 的 comment
 */
exports.reply = function (sourceEngineer, commentAuthor, replyByComment) {
    // 1. 站内通知
    notification.createOne({
        type: 'reply',
        source: sourceEngineer.id,
        target: commentAuthor.id,
        response: replyByComment.id
    }, log.holdError);

    // 2. 邮件通知
    var notiReply = configs.notification.reply;
    var subject = notiReply.subject;
    var content = notiReply.template.render({});
    email.send(commentAuthor, subject, content);
};


/**
 * 权限变动通知
 * @param operator {Object} 操作者
 * @param operatorBy {Object} 被操作者
 */
exports.role = function (operator, operatorBy) {
    // 1. 站内通知
    notification.createOne({
        source: operator.id,
        target: operatorBy.id
    }, log.holdError);

    // 2. 邮件通知
    var notiRole = configs.notification.role;
    var subject = notiRole.subject;
    var content = notiRole.template.render({});
    email.send(operatorBy, subject, content);
};


/**
 * 回答被采纳通知
 * @param askEngineer {Object} 问者
 * @param answerEngineer {Object} 答者
 * @param questionObject {Object} 题者
 */
exports.accept = function (askEngineer, answerEngineer, questionObject) {
    // 1. 站内通知
    notification.createOne({
        source: askEngineer.id,
        target: answerEngineer.id,
        object: questionObject.id
    }, log.holdError);

    // 2. 邮件通知
    var notiRole = configs.notification.accept;
    var subject = notiRole.subject;
    var content = notiRole.template.render({});
    email.send(answerEngineer, subject, content);
};
