/*!
 * 用户相关
 * @author ydr.me
 * @create 2014-11-22 15:26
 */

'use strict';

var user = require('../models/').user;
var ydrUtil = require('ydr-util');
var config = require('../../webconfig/');


/**
 * 注册
 */
exports.signUp = user.createOne;


/**
 * 查找
 */
exports.findOne = user.findOne;

/**
 * 获取meta
 */
exports.getMeta = user.getMeta;


/**
 * 设置meta
 */
exports.setMeta = user.setMeta;


/**
 * 评论自增
 * @param conditions
 * @param callback
 */
exports.increaseComment = function (conditions, callback) {
    _increase(conditions, 'comments', 1, callback);
};

/**
 * 阅读自增
 * @param conditions
 * @param callback
 */
exports.increaseView = function (conditions, callback) {
    _increase(conditions, 'views', 1, callback);
};

/**
 * 点赞自增
 * @param conditions
 * @param callback
 */
exports.increasePraise = function (conditions, callback) {
    _increase(conditions, 'praises', 1, callback);
};


/**
 * 增加积分
 * @param conditions
 * @param callback
 */
exports.increaseCoins = function (conditions, count, callback) {
    _increase(conditions, 'coins', count, callback);
};


exports.createOauthURL = function (redirect, callback) {
    var state = redirect + '|' + ydrUtil.random.number(1, 100);
    var params = {
        scope: 'user:email',
        redirect_uri: redirect,
        state: ydrUtil.crypto.encode(state, config.secret.session.secret),
        client_id: 1
    };
};


////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////[private api]//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/**
 * 增加数量，比如评论数、点赞数、阅读数等
 * @param conditions
 * @param metaKey
 * @param count
 * @param callback
 * @private
 */
function _increase(conditions, metaKey, count, callback) {
    count = ydrUtil.dato.parseInt(count, 0);

    user.getMeta(conditions, function (err, meta) {
        if (err) {
            return callback(err);
        }

        if (!meta[metaKey]) {
            meta[metaKey] = count;
        } else {
            meta[metaKey] = ydrUtil.dato.parseInt(meta[metaKey], 0) + count;
        }

        if (meta[metaKey] < 0) {
            meta[metaKey] = 0;
        }

        user.setMeta(conditions, meta, callback);
    });
}