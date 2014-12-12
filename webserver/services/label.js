/*!
 * lebel service
 * @author ydr.me
 * @create 2014-12-10 17:37
 */

'use strict';


var label = require('../models/').label;
var dato = require('ydr-util').dato;
var keys = ['name'];


/**
 * 创建一个 label
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (data, callback) {
    var data2 = dato.pick(data, keys);

    label.createOne(data2, callback);
};


/**
 * 更新一个 label
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (conditions, data, callback) {
    var data2 = dato.pick(data, keys);

    label.findOneAndUpdate(conditions, data2, callback);
};


/**
 * 查找
 */
exports.findOne = label.findOne;


/**
 * 增加 label 中的 object 数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新数量
 * @param callback {Function} 回调
 */
exports.increaseObjectCount = function (conditions, count, callback) {
    label.mustIncrease(conditions, 'objectCount', count, callback);
};