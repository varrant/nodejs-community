/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-12 18:15
 */

'use strict';

var notification = require('../models/').notification;
var configs = require('../../configs/');
var email = require('./email.js');
var from = configs.smtp.from;
var log = require('ydr-util').log;
var noticonfig = configs.notification;

/**
 * 创建一条通知
 * @param activeUser
 * @param activedUser
 * @param bject
 */
exports.createOne = function (type, activeUser, activedUser, object) {
    var data = {
        type: type,
        activeUser: activedUser.id,
        activedUser: activedUser.id,
        obejct: object.id
    };
    var notitemplate = noticonfig[type];
    var subject = notitemplate.subject;
    var content = notitemplate.template.render({});

    // 创建通知
    notification.createOne(data, log.holdError);
    // 发送邮件
    email.send(activedUser.nickname, activedUser.email, subject, content);
};


/**
 * 设置为已激活
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.setActived = function (conditions, callback) {
    notification.toggle(conditions, 'hasActived', true, callback);
};

/**
 * 设置为未激活
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.cancelActived = function (conditions, callback) {
    notification.toggle(conditions, 'hasActived', false, callback);
};
