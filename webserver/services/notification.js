/*!
 * notification service
 * @author ydr.me
 * @create 2014-12-12 18:15
 */

'use strict';

var notification = require('../models/').notification;
var email = require('./email.js');
var log = require('ydr-log');

/**
 * 创建一条通知
 */
exports.createOne = notification.createOne;


/**
 * 计数
 */
exports.count = notification.count;


/**
 * 查找
 */
exports.find = notification.find;


/**
 * 设置为已激活
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.setActive = function (conditions, callback) {
    notification.toggle(conditions, 'hasActiveBy', true, callback);
};

/**
 * 设置为未激活
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.cancelActive = function (conditions, callback) {
    notification.toggle(conditions, 'hasActiveBy', false, callback);
};


/**
 * 创建被评论通知
 * @param commentAuthor
 * @param commentByAuthor
 * @param comment
 * @param callback
 */
exports.notiCommentBy = function (commentAuthor, commentByAuthor, response, callback) {
    var data = {
        type: 'comment',
        source: commentAuthor.id,
        target: commentAuthor.id,
        response: response.id
    };

    notification.createOne(data, callback);
};


/**
 * 创建被回复通知
 * @param commentAuthor
 * @param commentByAuthor
 * @param comment
 * @param callback
 */
exports.notiReplyBy = function (replyAuthor, replyByAuthor, response, callback) {
    var data = {
        type: 'reply',
        source: replyAuthor.id,
        target: replyByAuthor.id,
        response: response.id
    };

    notification.createOne(data, callback);
};


/**
 * 创建被回复通知
 * @param commentAuthor
 * @param commentByAuthor
 * @param comment
 * @param callback
 */
exports.notiAcceptBy = function (acceptAuthor, acceptByAuthor, object, response, callback) {
    var data = {
        type: 'accept',
        source: acceptAuthor.id,
        target: acceptByAuthor.id,
        object: object.id,
        response: response.id
    };

    notification.createOne(data, callback);
};
