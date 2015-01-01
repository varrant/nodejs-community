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
var response = require('./response.js');
var log = require('ydr-log');
var email = require('./email.js');


/**
 * 评论通知 object 作者
 * @param sourceDeveloper {Object} 评论人
 * @param targetDeveloper {Object} object 作者
 * @param object {commentByObject} 被评论的 object
 */
exports.toObjectAuthor = function (respondDeveloper, objectAuthor, commentInObject, response) {
    // 自己不必通知自己
    if (respondDeveloper.id.toString() === objectAuthor.id.toString()) {
        return;
    }

    // 1. 站内通知
    var type = response.parent ? 'replyObject' : 'commentObject';
    notification.createOne({
        type: type,
        source: respondDeveloper.id,
        target: objectAuthor.id,
        object: commentInObject.id,
        response: response.id
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification[type];
    var subject = noti.subject;
    var data = {
        from: configs.smtp.from,
        sender: {
            nickname: respondDeveloper.nickname,
            response: response.contentHTML
        },
        receiver: {
            nickname: objectAuthor.nickname,
            object: commentInObject.title,
            link: configs.app.host + '/object/?id=' + commentInObject.id
        }
    };
    var content = noti.template.render(data);
    email.send(objectAuthor, subject, content);
};


/**
 * 回复通知评论者
 * @param sourceDeveloper {Object} 评论人
 * @param targetDeveloper {Object} object 作者
 * @param replyInObject {Object} 所在的 object
 * @param replyByComment {Object} 被回复的评论
 */
exports.toResponseAuthor = function (sourceDeveloper, commentAuthor, replyInObject, replyResponse) {
    // 自己不必通知自己
    if (sourceDeveloper.id.toString() === commentAuthor.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'reply',
        source: sourceDeveloper.id,
        target: commentAuthor.id,
        object: replyInObject.id,
        response: replyResponse.id
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.reply;
    var subject = noti.subject;
    var data = {
        from: configs.smtp.from,
        sender: {
            nickname: sourceDeveloper.nickname,
            response: replyResponse.contentHTML
        },
        receiver: {
            nickname: commentAuthor.nickname,
            object: replyInObject.title,
            link: configs.app.host + '/object/?id=' + replyInObject.id
        }
    };

    var content = noti.template.render(data);
    email.send(commentAuthor, subject, content);
};


/**
 * 权限变动通知
 * @param operator {Object} 操作者
 * @param operatorBy {Object} 被操作者
 */
exports.role = function (operator, operatorBy, group) {
    // 自己不必通知自己
    if (operator.id.toString() === operatorBy.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'role',
        source: operator.id,
        target: operatorBy.id,
        value: group
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.role;
    var subject = noti.subject;
    var content = noti.template.render({});
    email.send(operatorBy, subject, content);
};


/**
 * 回答被采纳通知
 * @param askDeveloper {Object} 问者
 * @param answerDeveloper {Object} 答者
 * @param questionObject {Object} 题
 * @param questionResponse {Object} 答
 */
exports.accept = function (askDeveloper, answerDeveloper, questionObject, questionResponse) {
    // 自己不必通知自己
    if (askDeveloper.id.toString() === answerDeveloper.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'accept',
        source: askDeveloper.id,
        target: answerDeveloper.id,
        object: questionObject.id,
        response: questionResponse.id
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.accept;
    var subject = noti.subject;
    var content = noti.template.render({});
    email.send(answerDeveloper, subject, content);
};


/**
 * 评论被赞同通知
 * @param askDeveloper {Object} 问者
 * @param answerDeveloper {Object} 答者
 * @param questionObject {Object} 题
 * @param questionResponse {Object} 答
 */
exports.agreeComment = function (agreeDeveloper, agreeByDeveloper, agreeinObject, agreeByResponse) {
    // 自己不必通知自己
    if (agreeDeveloper.id.toString() === agreeByDeveloper.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'agreeComment',
        source: agreeDeveloper.id,
        target: agreeByDeveloper.id,
        object: agreeinObject.id,
        response: agreeByResponse.id
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.agreeComment;
    var subject = noti.subject;
    var content = noti.template.render({});
    email.send(agreeByDeveloper, subject, content);
};


/**
 * 回复被赞同通知
 * @param askDeveloper {Object} 问者
 * @param answerDeveloper {Object} 答者
 * @param questionObject {Object} 题
 * @param questionResponse {Object} 答
 */
exports.agreeReply = function (agreeDeveloper, agreeByDeveloper, agreeinObject, agreeByResponse) {
    // 自己不必通知自己
    if (agreeDeveloper.id.toString() === agreeByDeveloper.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'agreeReply',
        source: agreeDeveloper.id,
        target: agreeByDeveloper.id,
        object: agreeinObject.id,
        response: agreeByResponse.id
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.agreeReply;
    var subject = noti.subject;
    var content = noti.template.render({});
    email.send(agreeByDeveloper, subject, content);
};
