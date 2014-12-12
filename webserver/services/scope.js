/*!
 * scope service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var scope = require('../models/').scope;
var howdo = require('howdo');


/**
 * 插入一个 scope，如果存在则 objectCount + 1，否则新建一个 scope
 * @param data {Object} 插入数据
 * @param callback {Function} 回调
 */
exports.insertOne = function (data, callback) {
    var conditions = {
        name: data.name,
        uri: data.uri
    };

    howdo
        // 1. find one scope
        .task(function (next) {
            scope.findOne(conditions, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    return next();
                }

                next(err, doc);
            });
        })
        // 2. if exist update
        .task(function (next, doc) {
            if (!doc) {
                return next();
            }

            data.objectCount = doc.objectCount + 1;
            exports.createOne(data, next);
        })
        // 3. else create
        .task(function (next, doc) {
            if (doc) {
                return next();
            }

            exports.updateOne(conditions, data, next);
        })
        // 顺序串行
        .follow(callback);
};


/**
 * 创建一个 scope
 * @param data {Object} 插入数据
 * @param callback {Function} 回调
 */
exports.createOne = function (data, callback) {
    var data2 = {
        name: data.name,
        uri: data.uri,
        cover: data.cover,
        introduction: data.introduction
    };

    scope.createOne(data2, callback);
};


/**
 * 更新一个 scope
 * @param conditions {Object} 查询条件
 * @param data {Object} 插入数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (conditions, data, callback) {
    var data2 = {
        name: data.name,
        uri: data.uri,
        cover: data.cover,
        introduction: data.introduction
    };

    scope.findOneAndUpdate(conditions, data2, callback);
};


/**
 * 查找
 */
exports.findOne = scope.findOne;


/**
 * 增加 scope 中的 object 数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新数量
 * @param callback {Function} 回调
 */
exports.increaseObjectCount = function (conditions, count, callback) {
    scope.increase(conditions, 'objectCount', count, callback);
};