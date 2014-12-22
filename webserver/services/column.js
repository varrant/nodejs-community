/*!
 * column service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var column = require('../models/').column;
var dato = require('ydr-util').dato;
var howdo = require('howdo');


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
 * @param author {Object} 作者
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (author, data, callback) {
    var data2 = dato.pick(data, ['name', 'uri', 'cover', 'introduction']);

    howdo
        // 1、检查是否有重复
        .task(function (next) {
            column.findOne({
                uri: data.uri
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (doc) {
                    err = new Error('专栏 URI 重复');
                    return next(err);
                }

                next();
            });
        })
        // 2、插入数据
        .task(function (next) {
            column.createOne(data2, next);
        })
        // 异步串行
        .follow(callback);
};


/**
 * 更新一个 column
 * @param author {Object} 作者
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (author, conditions, data, callback) {
    var data2 = dato.pick(data, ['name', 'cover', 'introduction']);

    howdo
        // 1. 检查是否为作者的专栏
        .task(function (next) {
            var _condtions = dato.extend({author: author.id}, conditions);
            column.findOne(_condtions, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该专栏不存在');
                    err.status = 404;
                    return next(err);
                }

                next();
            });
        })
        // 2. 更新
        .task(function (next) {
            column.findOneAndUpdate(conditions, data2, next);
        })
        // 异步串行
        .follow(callback);
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