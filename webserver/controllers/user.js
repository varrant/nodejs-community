/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 22:28
 */

'use strict';


var config = require('../../webconfig/');
var user = require('../services/').user;
var setting = require('../services/').setting;


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

        user.oauthCallback(oauthSettings, code, function (err, json) {
            if (err) {
                return next(err);
            }

            res.send(JSON.stringify(json, null, 4));
        });
    };

    return exports;
};
