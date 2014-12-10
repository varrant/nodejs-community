/*!
 * 交互服务
 * @author ydr.me
 * @create 2014-12-10 14:57
 */

'use strict';

var typeis = require('ydr-util').typeis;
var interactive = require('../models/').interactive;
var noop = function () {
    // ignore
};


/**
 * 写入交互记录
 * @param data {Object} 写入数据
 * @param data.model {String} 模型名称
 * @param data.path {String} 模型字段
 * @param data.operator {String} 操作者 ID
 * @param data.object {String} 被操作者 ID
 * @param [data.value=1] {Number} 影响值
 * @param [data.isApprove=true] {Number} 是否通过了
 * @param [data.at] {Date} 操作时间
 * @param [callback] {Function} 回调
 */
exports.push = function (data, callback) {
    if (!data.at) {
        data.at = new Date();
    }

    if (typeis(callback) !== 'function') {
        callback = noop;
    }

    if (data.model === 'user' || data.model === 'object') {
        // 发送邮件给被动用户
    }

    interactive.createOne(data, callback);
};
