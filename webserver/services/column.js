/*!
 * column service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var column = require('../models/').column;
var dato = require('ydr-util').dato;
var keys = ['name', 'uri', 'cover', 'introduction'];


/**
 * 查找
 */
exports.findOne = column.findOne;


/**
 * 查找
 */
exports.find = column.find;


/**
 * 删除
 */
exports.findOneAndRemove = column.findOneAndRemove;


/**
 * 创建一个 column
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (data, callback) {
    var data2 = dato.pick(data, keys);

    column.createOne(data2, callback);
};


/**
 * 更新一个 column
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (conditions, data, callback) {
    var data2 = dato.pick(data, keys);

    column.findOneAndUpdate(conditions, data2, callback);
};


/**
 * 确保由一个 column
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.existOne = function (conditions, data, callback) {
    var data2 = dato.pick(data, keys);

    column.existOne(conditions, data2, callback);
};


/**
 * 增加 column 中的 object 数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新数量
 * @param callback {Function} 回调
 */
exports.increaseObjectCount = function (conditions, count, callback) {
    column.increase(conditions, 'objectCount', count, callback);
};