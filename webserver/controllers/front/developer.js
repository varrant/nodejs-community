/*!
 * developer
 * @author ydr.me
 * @create 2014-11-23 11:58
 */

'use strict';


var developer = require('../../services/').developer;
var setting = require('../../services/').setting;
var howdo = require('howdo');
var configs = require('../../../configs/');


module.exports = function (app) {
    var exports = {};
    var oauthSettings = app.locals.$setting.oauth;

    /**
     * 跳转至授权地址
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.oauthAuthorize = function (req, res, next) {
        var oauth = developer.createOauthURL(oauthSettings, configs.app.host + '/developer/oauth/callback/');

        req.session.$state = oauth.state;
        res.render('front/oauth-authorize.html', {
            title: '授权登录',
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
        var isSafe = developer.isSafeOauthState(state);
        var err;

        if (!isSafe) {
            err = new Error('非法授权操作');
            err.redirect = '/developer/oauth/authorize/';

            return next(err);
        }

        if (!req.session.$state) {
            err = new Error('请重新授权操作');
            err.redirect = '/developer/oauth/authorize/';

            return next(err);
        }

        if (req.session.$github) {
            return res.render('front/oauth-callback.html', {
                title: '确认登录',
                github: req.session.$github
            });
        }

        howdo
            // 1. 授权
            .task(function (next) {
                developer.oauthCallback(oauthSettings, code, next);
            })
            // 2. 查找用户
            .task(function (next, json) {
                var conditions = {
                    githubId: json.githubId
                };

                developer.findOne(conditions, function (err, data) {
                    next(err, data, json);
                });
            })
            // 异步串行
            .follow(function (err, data, json) {
                if (err) {
                    return next(err);
                }

                json.hasRegister = !!data;
                req.session.$github = json;
                res.render('front/oauth-callback.html', {
                    title: '确认登录',
                    github: json
                });
            });
    };


    /**
     * 开发者主页
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var sectionUriIdMap = {};

        app.locals.$section.forEach(function (section) {
            sectionUriIdMap[section.uri] = section.id;
        });

        developer.findOne({
            githubLogin: githubLogin
        }, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (!doc) {
                return next();
            }

            var data = {
                developer: doc,
                title: doc.nickname,
                sectionUriIdMap: sectionUriIdMap
            };

            res.render('front/developer.html', data);
        });
    };

    return exports;
};
