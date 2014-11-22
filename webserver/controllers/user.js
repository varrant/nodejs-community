/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 22:28
 */

'use strict';


var config = require('../../webconfig/');
var user = require('../services/').user;
var setting = require('../services/').setting;
var howdo = require('howdo');


module.exports = function (app) {
    var exports = {};
    var oauthSettings = app.locals.settings2.oauth;

    /**
     * 跳转至授权地址
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.oauthAuthorize = function (req, res, next) {
        var url = user.createOauthURL(oauthSettings, 'http://sb.com:18084/api/user/oauth/callback/');

        res.render('frontend/oauth-authorize.html', {
            url: url
        });
    };


    /**
     * 跳转回调
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.oauthCallback = function (req, res, next) {
        var query = req.query;
        var code = query.code;
        var state = query.state;
        var isSafe = user.isSafeOauthState(state);

        if (!isSafe) {
            return next(new Error('非法授权'));
        }

        howdo
            // 1. 授权
            .task(function (next) {
                user.oauthCallback(oauthSettings, code, next);
            })
            // 2. 查找用户
            .task(function (next, json) {
                var conditions = {
                    github: json.github
                };

                user.findOne(conditions, function (err, data) {
                    next(err, data, json);
                });
            })
            //// 3. 通向注册
            //.task(function (next, data, json) {
            //    if(data){
            //        return next(null, data, json);
            //    }
            //
            //    user.signUp(json, next);
            //})
            //// 4. 通向登录
            //.task(function (next, data, json) {
            //    if(!data){
            //        return next(null, data, json);
            //    }
            //
            //    user.signIn(data, res, next);
            //})
            // 异步串行
            .follow(function (err, data, json) {
                if (err) {
                    return next(err);
                }

                res.render('frontend/oauth-callback.html', {
                    isSignIn: !!data,
                    user: json
                });
            });
    };


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
