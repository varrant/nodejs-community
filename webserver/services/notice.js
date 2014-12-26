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


exports.responsePrimary = function (sourceEngineer, targetEngineer, object) {
    // 1. 站内通知
    notification.createOne({
        type: 'comment',
        source: sourceEngineer.id,
        target: targetEngineer.id,
        object: object.id
    }, log.holdError);

    // 2. 邮件通知
    var notiComment = configs.notification.comment;
    var subject = notiComment.subject;
    var content = notiComment.template.render({});
    email.send(targetEngineer.nickname, targetEngineer.email, subject, content);
};



exports.responseSecondary = function () {
    var notiReply = configs.notification.reply;
};

