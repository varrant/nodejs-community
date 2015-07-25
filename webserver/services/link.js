/*!
 * link service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var model = require('../models/').link;
var dato = require('ydr-utils').dato;


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
exports.createOne = model.createOne;


/**
 * 更新一个 link
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.findOneAndUpdate = model.findOneAndUpdate;


/**
 * 确保由一个 link
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.existOne = model.existOne;

