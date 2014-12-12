/*!
 * post service
 * @author ydr.me
 * @create 2014-12-07 16:58
 */

'use strict';

var typeis = require('ydr-util').typeis;
var object = require('../models').object;
var scope = require('./scope.js');
var label = require('./label.js');
var howdo = require('howdo');
var dato = require('ydr-util').dato;
var keys = ['title', 'uri', 'type', 'scope', 'labels', 'introduction', 'content', 'isDisplay'];
var noop = function () {
    // ignore
};


/**
 * 新建一个 object
 * @param authorId {String} 作者 ID
 * @param data {Object} 更新数据
 * @param callback {Function} 回调
 */
exports.createOne = function (authorId, data, callback) {
    howdo
        // 1. 检查 scope 是否存在
        .task(function (next) {
            scope.findOne({_id: data.scope}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('the scope is not exist');
                    err.type = 'notFound';
                    return next(err);
                }

                next();
            });
        })
        // 2. 新建数据
        .task(function (next) {
            var date = new Date();
            var data2 = dato.pick(data, keys);
            var data3 = {
                author: authorId,
                updateAt: date,
                updateList: [{
                    user: authorId,
                    date: date
                }]
            };
            var data4 = dato.extend(data2, data3);

            object.createOne(data4, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            callback.apply(this, arguments);

            // 更新 scope
            scope.increaseObjectCount({
                _id: data.scope
            }, 1, noop);

            // 更新 label
            label.increaseObjectCount({
                _id: data.scope
            }, 1, noop);
        });
};


/**
 * 更新 object
 * @param userId {String} 更新用户
 * @param conditions {Object} 查询条件
 * @param data {Object} 更新数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (userId, conditions, data, callback) {
    howdo
        // 1.检查 scope 是否存在
        .task(function (next) {
            scope.findOne({_id: data.scope}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('the scope is not exist');
                    err.type = 'notFound';
                    return next(err);
                }

                next();
            });
        })
        // 2. 数据预验证
        .task(function (next) {
            var data2 = dato.pick(data, keys);

            object.findOneAndValidate(conditions, data2, next);
        })
        // 3. 原生更新
        .task(function (next, data3) {
            data3.updateAt = date;
            data3.updateList.push({
                user: userId,
                date: date
            });

            object.findOneAndUpdate(conditions, data3, next);
        })
        // 顺序串行
        .follow(function (err, doc, oldDoc) {
            callback.apply(this, arguments);

            // 更新 scope
            scope.increaseObjectCount({_id: doc.scope}, 1, noop);
            scope.increaseObjectCount({_id: oldDoc.scope}, -1, noop);

            // 更新 label
            var diff = dato.compare(doc.labels, oldDoc.labels);
            var only1 = diff.only[0];
            var only2 = diff.only[1];

            only1.forEach(function (name) {
                label.increaseObjectCount({name: name}, 1, noop);
            });

            only2.forEach(function (name) {
                label.increaseObjectCount({name: name}, -1, noop);
            });
        });
};


/**
 * findOne
 */
exports.findOne = object.findOne;


/**
 * 根据 object 类型和 uir 获取 object 信息
 * @param type {String}  object 类型，如 opinion
 * @param uri {String}  object URI
 * @param callback {Function}
 */
exports.get = function (type, uri, callback) {
    var conditions = {
        type: type,
        uri: uri
    };

    object.findOne(conditions, callback);
};


/**
 * 增加 object 分数
 * @param operator {Object} 操作者
 * @param id {String} 操作 object ID
 * @param count {Number} 分值
 * @param callback {Function} 回调
 */
exports.increaseScore = function (operator, id, count, callback) {
    var conditions = {
        _id: id
    };

    howdo.task(function (done) {
        object.increase(conditions, 'score', count, done);
    }).task(function (done) {
        object.push(conditions, 'scoreList', {
            date: new Date(),
            score: count,
            user: operator.id
        }, done);
    }).together(callback);
};


/**
 * 增加 object 阅读数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseViewCount = function (conditions, count, callback) {
    object.increase(conditions, 'viewCount', count, callback);
};

/**
 * 增加 object 评论数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseCommentCount = function (conditions, count, callback) {
    object.increase(conditions, 'commentCount', count, callback);
};

/**
 * 增加 object 点赞收藏数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseFavoriteCount = function (conditions, count, callback) {
    object.increase(conditions, 'favoriteCount', count, callback);
};

/**
 * 增加组织申请数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseApplyCount = function (conditions, count, callback) {
    object.increase(conditions, 'applyCount', count, callback);
};
