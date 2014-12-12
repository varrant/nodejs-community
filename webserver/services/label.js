/*!
 * lebel service
 * @author ydr.me
 * @create 2014-12-10 17:37
 */

'use strict';


var label = require('../models/').label;


/**
 * 创建一个 label
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (data, callback) {
    var newData = {
        name: data.name
    };

    label.createOne(newData, callback);
};


/**
 * 更新一个 label
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (conditions, data, callback) {
    var newData = {
        name: data.name
    };

    label.findOneAndUpdate(conditions, newData, callback);
};


/**
 * 查找
 */
exports.findOne = label.findOne;


/**
 * 增加 scope 中的 object 数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新数量
 * @param callback {Function} 回调
 */
exports.increaseObjectCount = function (conditions, count, callback) {
    label.increase(conditions, 'objectCount', count, callback);
};