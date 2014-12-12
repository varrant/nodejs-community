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
        // 2. 新建数据
        .task(function (next) {
            var date = new Date();
            var data2 = {
                author: authorId,
                title: data.title,
                uri: data.uri,
                type: data.type,
                scope: data.scope,
                labels: data.labels,
                introduction: data.introduction,
                content: data.content,
                updateAt: date,
                updateList: [{
                    user: authorId,
                    date: date
                }],
                isDisplay: typeis(data.isDisplay) === 'undefined' ? true : !!data.isDisplay
            };

            object.createOne(data2, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            callback.apply(this, arguments);

            // 更新 scope
            scope.increaseObjectCount({
                _id: data.scope
            }, 1, noop);
            // 更新 label
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
            object.findOneAndValidate(conditions, data, next);
        })
        // 3. 原生更新
        .task(function (next, newData) {
            newData.updateAt = date;
            newData.updateList.push({
                user: userId,
                date: date
            });
            newData.isDisplay = typeis(newData.isDisplay) === 'undefined' ? true : !!newData.isDisplay

            object.rawModel.findOneAndUpdate(conditions, newData, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            callback.apply(this, arguments);

            // 更新 scope
            // 更新 label

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
