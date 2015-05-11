/*!
 * column service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var column = require('../models/').column;
var developer = require('./developer.js');
var dato = require('ydr-utils').dato;
var howdo = require('howdo');
var log = require('ydr-utils').log;


/**
 * 查找
 */
exports.findOne = column.findOne;


/**
 * 查找
 */
exports.find = column.find;
exports.count = column.count;


exports.findOneAndUpdate = column.findOneAndUpdate;


/**
 * 删除某个专辑
 * @param author
 * @param conditions
 * @param callback
 */
exports.removeOne = function (author, conditions, callback) {
    howdo
        // 1. 检查是否为作者的专辑
        .task(function (next) {
            column.findOne({
                author: author.id,
                _id: conditions._id
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该专辑不存在');
                    err.code = 404;
                    return next(err);
                }

                if (doc.objectCount > 0) {
                    err = new Error('该专辑下还有' + doc.objectCount + '个项目，无法删除');
                    return next(err);
                }

                next();
            });
        })
        // 2. 删除
        .task(function (next) {
            column.findOneAndRemove(conditions, next);
        })
        .follow(callback);
};


/**
 * 创建一个 column
 * @param author {Object} 作者
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.createOne = function (author, data, callback) {
    var data2 = dato.select(data, ['name', 'uri', 'cover', 'introduction']);

    data2.author = author.id;
    column.createOne(data2, function (err, doc) {
        callback(err, doc);

        if (!err && doc) {
            // 更新 developer.columnCount
            developer.increaseColumnCount({_id: author.id}, 1, log.holdError);
        }
    });
};


/**
 * 更新一个 column
 * @param author {Object} 作者
 * @param conditions {Object} 查询条件
 * @param data {Object} 数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (author, conditions, data, callback) {
    howdo
        // 1. 检查是否为作者的专辑
        .task(function (next) {
            column.findOne({
                author: author.id,
                _id: conditions._id
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该专辑不存在');
                    err.code = 404;
                    return next(err);
                }

                next();
            });
        })
        // 2. 检查 uri 是否重复
        .task(function (next) {
            var _condtions = {
                uri: data.uri
            };

            column.findOne(_condtions, {
                nor: {_id: conditions._id}
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (doc) {
                    err = new Error('专辑 URI 重复');
                    return next(err);
                }

                next();
            });
        })
        // 2. 更新
        .task(function (next) {
            var data2 = dato.select(data, ['name', 'uri', 'cover', 'introduction']);
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


/**
 * 增加 column 阅读数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 数量
 * @param callback {Function} 回调
 */
exports.increaseViewByCount = function (conditions, count, callback) {
    column.increase(conditions, 'viewByCount', count, callback);
};
