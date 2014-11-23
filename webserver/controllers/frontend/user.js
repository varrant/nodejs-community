/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 11:58
 */

'use strict';


var config = require('../../../webconfig/');
var user = require('../../services/').user;
var setting = require('../../services/').setting;
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
        var url = user.createOauthURL(oauthSettings, 'http://sb.com:18084/user/oauth/callback/');

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
            // 异步串行
            .follow(function (err, data, json) {
                if (err) {
                    return next(err);
                }

                req.session.accessToken = json.accessToken;
                res.render('frontend/oauth-callback.html', {
                    hasSignUp: !!data,
                    user: json
                });
            });
    };

    return exports;
};
