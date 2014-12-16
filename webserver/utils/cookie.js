/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 20:21
 */

'use strict';

var secret = require('../../configs/').secret;
var crypto = require('ydr-util').crypto;
var dato = require('ydr-util').dato;
var defaults = secret.cookie.options;


/**
 * 登录
 * @param res {Object} 响应对象
 * @param userId {String} 用户 ID
 */
exports.login = function (res, userId) {
    var cookie = crypto.encode(userId, secret.cookie.secret);
    var options = dato.extend({}, defaults, {
        expires: new Date(Date.now() + secret.cookie.userAge),
        maxAge: secret.cookie.userAge
    });

    res.cookie(secret.cookie.userKey, cookie, options);
};


/**
 * 退出登录
 * @param res {Object} 响应对象
 */
exports.logout = function (res) {
    var options = dato.extend({}, defaults, {
        expires: new Date(Date.now() - 1),
        maxAge: -1
    });

    res.cookie(secret.cookie.userKey, '', options);
};
