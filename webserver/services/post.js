/*!
 * post service
 * @author ydr.me
 * @create 2014-12-07 16:58
 */

'use strict';

var post = require('../models').post;
var howdo = require('howdo');

/**
 * 根据文章类型和 uir 获取文章信息
 * @param type {String} 文章类型，如 opinion
 * @param uri {String} 文章URI
 * @param callback {Function}
 */
exports.get = function (type, uri, callback) {
    var conditions = {
        type: type,
        uri: uri
    };

    post.findOne(conditions, callback);
};


/**
 * 增加文章分数
 * @param user {Object} 操作者
 * @param id {String} 操作文章ID
 * @param count {Number} 分值
 * @param callback {Function} 回调
 */
exports.increaseScore = function (user, id, count, callback) {
    var conditions = {
        _id: id
    };

    howdo.task(function (done) {
        post.increase(conditions, 'score', count, done);
    }).task(function (done) {
        post.push(conditions, 'score', {
            date: new Date(),
            value: count,
            user: user.id
        }, done);
    }).together(callback);
};


/**
 * 增加文章阅读数量
 * @param id
 * @param count
 * @param callback
 */
exports.increaseViewCount = function (id, count, callback) {
    post.increase({_id: id}, 'viewCount', count, callback);
};

/**
 * 增加文章评论数量
 * @param id
 * @param count
 * @param callback
 */
exports.increaseCommentCount = function (id, count, callback) {
    post.increase({_id: id}, 'commentCount', count, callback);
};

/**
 * 增加文章点赞数量
 * @param id
 * @param count
 * @param callback
 */
exports.increasePraiseCount = function (id, count, callback) {
    post.increase({_id: id}, 'praiseCount', count, callback);
};

/**
 * 增加文章点赞收藏数量
 * @param id
 * @param count
 * @param callback
 */
exports.increaseFavoriteCount = function (id, count, callback) {
    post.increase({_id: id}, 'favoriteCount', count, callback);
};

/**
 * 增加组织申请数量
 * @param id
 * @param count
 * @param callback
 */
exports.increaseApplyCount = function (id, count, callback) {
    post.increase({_id: id}, 'applyCount', count, callback);
};
