/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 11:58
 */

'use strict';


var user = require('../../services/').user;
var setting = require('../../services/').setting;
var howdo = require('howdo');
var configs = require('../../../configs/');


module.exports = function (app) {
    var exports = {};
    var oauthSettings = app.locals.$options.oauth;

    /**
     * 跳转至授权地址
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.oauthAuthorize = function (req, res, next) {
        var oauth = user.createOauthURL(oauthSettings, 'http://'+configs.app.domain+':18084/user/oauth/callback/');

        req.session.$state = oauth.state;
        res.render('front/oauth-authorize.html', {
            url: oauth.url
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
        var err;

        if (!req.session.$state) {
            err = new Error('请重新进行授权操作');
            err.redirect = '/user/oauth/authorize';

            return next(err);
        }

        if (!isSafe) {
            err = new Error('非法授权操作');
            err.redirect = '/user/oauth/authorize';

            return next(err);
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
            // 异步串行
            .follow(function (err, data, json) {
                req.session.$state = null;

                if (err) {
                    return next(err);
                }

                req.session.$githubOauth = json;
                res.render('front/oauth-callback.html', {
                    hasSignUp: !!data,
                    user: json
                });
            });
    };


    /**
     * 工程师主页
     * @param req
     * @param res
     * @param next
     */
    exports.getEngineer = function (req, res, next) {
        res.render('front/engineer.html', {
            title: req.params.engineer
        });
    };

    return exports;
};
