/*!
 * link service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var model = require('../models/').link;
var dato = require('ydr-utils').dato;
var keys = ['type', 'category', 'author', 'text', 'url', 'index'];


/**
 * 查找
 */
exports.findOne = model.findOne;


/**
 * 查找
 */
exports.find = model.find;


/**
 * 删除
 */
exports.findOneAndRemove = model.findOneAndRemove;


/**
 * 创建一个 link
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (data, callback) {
    var data2 = dato.select(data, keys);

    model.createOne(data2, callback);
};


/**
 * 更新一个 link
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.findOneAndUpdate = function (conditions, data, callback) {
    var data2 = dato.select(data, keys);

    model.findOneAndUpdate(conditions, data2, callback);
};


/**
 * 确保由一个 link
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.existOne = function (conditions, data, callback) {
    var data2 = dato.select(data, keys);

    model.existOne(conditions, data2, callback);
};

