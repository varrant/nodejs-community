/*!
 * 用户相关 API
 * @author ydr.me
 * @create 2014-11-23 11:51
 */

'use strict';



var config = require('../../../webconfig/');
var user = require('../../services/').user;
var setting = require('../../services/').setting;


module.exports = function (app) {
    var exports = {};

    /**
     * 登录 API
     * @param req
     * @param res
     * @param next
     */
    exports.signIn = function (req, res, next) {
        var data = req.body.data || {};

        data.signInAt = new Date();
        user.existOne({
            _id: data._id
        }, data, function (err, data) {
            if (err) {
                return next(err);
            }

            var cookie = ydrUtil.crypto.encode(data.id, config.secret.cookie.secret);

            res.cookie(config.secret.cookie.userKey, cookie, {
                domain: '',
                path: '/',
                secure: false,
                httpOnly: true,
                expires: new Date(Date.now() + config.secret.cookie.userAge),
                maxAge: config.secret.cookie.userAge
            });
            res.locals._user = {
                id: data.id,
                email: data.email,
                nickname: data.nickname,
                role: data.role
            };

            res.send('登录成功');
        });
    };

    return exports;
};
