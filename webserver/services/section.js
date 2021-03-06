/*!
 * section service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var section = require('../models/').section;
var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;
var cache = require('ydr-utils').cache;
var sync = require('../utils/').sync;
var keys = ['name', 'role', 'uri', 'cover', 'background', 'introduction'];


/**
 * 查找
 */
exports.findOne = section.findOne;


/**
 * 查找
 */
exports.find = section.find;


/**
 * 删除
 */
exports.findOneAndRemove = section.findOneAndRemove;


/**
 * 创建一个 section
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (data, callback) {
    var data2 = dato.select(data, keys);

    section.createOne(data2, callback);
};


/**
 * 更新一个 section
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.findOneAndUpdate = function (conditions, data, callback) {
    var data2 = dato.select(data, keys);

    section.findOneAndUpdate(conditions, data2, callback);
};


/**
 * 确保由一个 section
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.existOne = function (conditions, data, callback) {
    var data2 = dato.select(data, keys);

    section.existOne(conditions, data2, callback);
};


/**
 * 增加 section 中的 object 数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新数量
 * @param callback {Function} 回调
 */
exports.increaseObjectCount = function (conditions, count, callback) {
    section.increase(conditions, 'objectCount', count, function (err, doc) {
        if (typeis.function(callback)) {
            callback.apply(this, arguments);
        }

        if (!err) {
            var list = cache.get('app.sectionList').map(function (item) {
                if (item.id.toString() === doc.id.toString()) {
                    item.objectCount = doc.objectCount;
                }

                return item;
            });
            
            sync.section(list);
        }
    });
};