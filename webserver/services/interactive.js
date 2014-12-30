/*!
 * 交互服务
 * @author ydr.me
 * @create 2014-12-10 14:57
 */

'use strict';

var interactive = require('../models/').interactive;
var howdo = require('howdo');
var object = require('./object.js');
var response = require('./response.js');


/**
 * 查找
 */
exports.findOne = interactive.findOne;


/**
 * 切换
 * @param data
 * @param boolean
 * @param callback
 */
exports.toggle = function (conditions, boolean, callback) {
    if (!conditions.object && !conditions.response) {
        var err = new Error('至少需要一个 object 或 response');
        return callback(err);
    }

    if (conditions.object && conditions.response) {
        var err = new Error('object 和 response 不能同时存在');
        return callback(err);
    }


    interactive.mustToggle(conditions, 'hasApproved', boolean, function (err, newDoc, oldDoc) {
        if (err) {
            return callback(err);
        }

        var value = 0;

        // 当前为 true，以前为否或不存在
        if (newDoc.hasApproved === true && (!oldDoc || oldDoc.hasApproved === false)) {
            value = 1;
        }
        // 当前为 false，以前为 true
        else if (newDoc.hasApproved === false && oldDoc && oldDoc.hasApproved === true) {
            value = -1;
        }

        callback(err, value, newDoc, oldDoc);
    });

};


/**
 * 写入交互记录
 * @param data {Object} 写入数据
 * @param data.operator {String} 操作者 ID
 * @param data.model {String} 模型名称
 * @param data.path {String} 模型字段
 * @param data.object {String} object ID
 * @param data.response {String} response ID
 * @param [data.value=0] {Number} 影响值
 * @param data.hasApproved {Number} 是否通过了
 * @param [data.at] {Date} 操作时间
 * @param callback {Function} 回调
 */
exports.active = function (data, callback) {
    // 四个的组合一定是唯一的
    // 例：用户A（operator）只能关注用户（model+path）B（object）一次
    var conditions = {
        operator: data.operator,
        model: data.model,
        path: data.path
    };
    var data2 = {
        at: new Date(),
        value: data.value,
        hasApproved: data.hasApproved
    };

    if (!data.object && !data.response) {
        var err = new Error('至少需要一个 object 或 response');
        return callback(err);
    }

    if (data.model === 'developer' || data.model === 'object') {
        // 发送邮件给被动用户
    }

    if (data.object) {
        conditions.object = data.object;
    } else {
        conditions.response = data.response;
    }

    interactive.existOne(conditions, data2, function (err, newDoc, oldDoc) {
        if (err) {
            return callback(err);
        }

        var value = 0;

        // 当前为 true，以前为否或不存在
        if (newDoc.hasApproved === true && (!oldDoc || oldDoc.hasApproved === false)) {
            value = 1;
        }
        // 当前为 false，以前为 true
        else if (newDoc.hasApproved === false && oldDoc.hasApproved === true) {
            value = -1;
        }

        callback(err, value, newDoc, oldDoc);
    });
};
