/*!
 * category service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var category = require('../models/').category;
var dato = require('ydr-utils').dato;
var keys = ['name', 'uri', 'cover', 'introduction'];


/**
 * 查找
 */
exports.findOne = category.findOne;


/**
 * 查找
 */
exports.find = category.find;


/**
 * 删除
 */
exports.findOneAndRemove = category.findOneAndRemove;


/**
 * 创建一个 category
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (data, callback) {
    var data2 = dato.pick(data, keys);

    category.createOne(data2, callback);
};


/**
 * 更新一个 category
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.findOneAndUpdate = function (conditions, data, callback) {
    var data2 = dato.pick(data, keys);

    category.findOneAndUpdate(conditions, data2, callback);
};


/**
 * 确保由一个 category
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.existOne = function (conditions, data, callback) {
    var data2 = dato.pick(data, keys);

    category.existOne(conditions, data2, callback);
};


/**
 * 增加 category 中的 object 数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新数量
 * @param callback {Function} 回调
 */
exports.increaseObjectCount = function (conditions, count, callback) {
    category.increase(conditions, 'objectCount', count, callback);
};