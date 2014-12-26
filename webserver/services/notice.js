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
 * @param object {Object} object
 */
exports.comment = function (sourceEngineer, objectAuthor, object) {
    // 1. 站内通知
    notification.createOne({
        type: 'comment',
        source: sourceEngineer.id,
        target: objectAuthor.id,
        object: object.id
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
 * @param object {Object} object
 */
exports.reply = function (sourceEngineer, commentAuthor, comment) {
    // 1. 站内通知
    notification.createOne({
        type: 'reply',
        source: sourceEngineer.id,
        target: commentAuthor.id,
        response: comment.id
    }, log.holdError);

    // 2. 邮件通知
    var notiReply = configs.notification.reply;
    var subject = notiReply.subject;
    var content = notiReply.template.render({});
    email.send(commentAuthor, subject, content);
};

