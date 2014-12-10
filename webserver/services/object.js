/*!
 * post service
 * @author ydr.me
 * @create 2014-12-07 16:58
 */

'use strict';

var object = require('../models').object;
var howdo = require('howdo');

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
        object.push(conditions, 'score', {
            date: new Date(),
            value: count,
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
