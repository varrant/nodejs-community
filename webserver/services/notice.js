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
var log = require('ydr-utils').log;
var email = require('./email.js');


/**
 * 评论通知 object 作者
 * @param respondDeveloper {Object} 评论人
 * @param objectAuthor {Object} object 作者
 * @param commentInObject {Object} 被评论的 object
 * @param response {Object} 被评论的 object
 */
exports.toObjectAuthor = function (respondDeveloper, objectAuthor, commentInObject, response) {
    // 自己不必通知自己
    if (respondDeveloper.id.toString() === objectAuthor.id.toString()) {
        return;
    }

    // 1. 站内通知
    var type = response.parentResponse ? 'replyObject' : 'commentObject';
    notification.createOne({
        type: type,
        source: respondDeveloper.id.toString(),
        target: objectAuthor.id.toString(),
        object: commentInObject.id.toString(),
        response: response.id.toString()
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
 * @param commentAuthor {Object} object 作者
 * @param replyInObject {Object} 所在的 object
 * @param replyResponse {Object} 被回复的评论
 */
exports.toResponseAuthor = function (sourceDeveloper, commentAuthor, replyInObject, replyResponse) {
    // 自己不必通知自己
    if (sourceDeveloper.id.toString() === commentAuthor.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'reply',
        source: sourceDeveloper.id.toString(),
        target: commentAuthor.id.toString(),
        object: replyInObject.id.toString(),
        response: replyResponse.id.toString()
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
 * @param group {String} 变动后的分组
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
    var data = {
        from: configs.smtp.from,
        receiver: {
            nickname: operatorBy.nickname,
            group: group
        }
    };
    var content = noti.template.render(data);
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
        source: askDeveloper.id.toString(),
        target: answerDeveloper.id.toString(),
        object: questionObject.id.toString(),
        response: questionResponse.id.toString()
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.accept;
    var subject = noti.subject;
    var data = {
        from: configs.smtp.from,
        sender: {
            nickname: askDeveloper.nickname
        },
        receiver: {
            nickname: answerDeveloper.nickname,
            object: questionObject.title,
            link: configs.app.host + '/object/?id=' + questionObject.id,
            response: questionResponse.contentHTML
        }
    };
    var content = noti.template.render(data);
    email.send(answerDeveloper, subject, content);
};


/**
 * 评论被赞同通知
 * @param agreeDeveloper {Object} 赞同者
 * @param agreeByDeveloper {Object} 被赞同者
 * @param agreeinObject {Object} 所在object
 * @param agreeByResponse {Object} 所在响应
 */
exports.agreeComment = function (agreeDeveloper, agreeByDeveloper, agreeinObject, agreeByResponse) {
    // 自己不必通知自己
    if (agreeDeveloper.id.toString() === agreeByDeveloper.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'agreeComment',
        source: agreeDeveloper.id.toString(),
        target: agreeByDeveloper.id.toString(),
        object: agreeinObject.id.toString(),
        response: agreeByResponse.id.toString()
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.agreeComment;
    var subject = noti.subject;
    var data = {
        from: configs.smtp.from,
        sender: {
            nickname: agreeDeveloper.nickname
        },
        receiver: {
            nickname: agreeByDeveloper.nickname,
            response: agreeByResponse.contentHTML,
            object: agreeinObject.title,
            link: configs.app.host + '/object/?id=' + agreeinObject.id
        }
    };
    var content = noti.template.render(data);
    email.send(agreeByDeveloper, subject, content);
};


/**
 * 回复被赞同通知
 * @param agreeDeveloper {Object} 赞同者
 * @param agreeByDeveloper {Object} 被赞同者
 * @param agreeinObject {Object} 所在 object
 * @param agreeByResponse {Object} 所在响应
 */
exports.agreeReply = function (agreeDeveloper, agreeByDeveloper, agreeinObject, agreeByResponse) {
    // 自己不必通知自己
    if (agreeDeveloper.id.toString() === agreeByDeveloper.id.toString()) {
        return;
    }

    // 1. 站内通知
    notification.createOne({
        type: 'agreeReply',
        source: agreeDeveloper.id.toString(),
        target: agreeByDeveloper.id.toString(),
        object: agreeinObject.id.toString(),
        response: agreeByResponse.id.toString()
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.agreeReply;
    var subject = noti.subject;
    var data = {
        from: configs.smtp.from,
        sender: {
            nickname: agreeDeveloper.nickname
        },
        receiver: {
            nickname: agreeByDeveloper.nickname,
            response: agreeByResponse.contentHTML,
            object: agreeinObject.title,
            link: configs.app.host + '/object/?id=' + agreeinObject.id
        }
    };
    var content = noti.template.render(data);
    email.send(agreeByDeveloper, subject, content);
};


/**
 * 关注通知
 * @param follower   {Object} 关注者
 * @param byFollower {Object} 被关注者
 */
exports.follow = function (follower, byFollower) {
    // 1. 站内通知
    notification.createOne({
        type: 'follow',
        source: follower.id.toString(),
        target: byFollower.id.toString()
    }, log.holdError);

    // 2. 邮件通知
    var noti = configs.notification.follow;
    var subject = noti.subject;
    var data = {
        from: configs.smtp.from,
        sender: {
            nickname: follower.nickname
        },
        receiver: {
            nickname: byFollower.nickname
        }
    };
    var content = noti.template.render(data);

    email.send(byFollower, subject, content);
};

