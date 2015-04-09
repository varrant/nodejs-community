/*!
 * notification service
 * @author ydr.me
 * @create 2014-12-12 18:15
 */

'use strict';

var notification = require('../models/').notification;
var email = require('./email.js');
var log = require('ydr-utils').log;
var howdo = require('howdo');

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
    notification.toggle(conditions, 'hasActived', true, callback);
};

/**
 * 设置为未激活
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.cancelActive = function (conditions, callback) {
    notification.toggle(conditions, 'hasActived', false, callback);
};
