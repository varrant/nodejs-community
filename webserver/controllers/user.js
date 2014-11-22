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


    /**
     * 跳转至授权地址
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.oauthAuthorize = function (req, res, next) {
        if (config.app.env === 'pro') {
            return next();
        }

        var url = user.createOauthURL(app.locals.settings2.oauth, 'http://sb.com:18084/api/user/oauth/callback/');

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
        if (config.app.env === 'pro') {
            return next();
        }

        var query = req.query;
        var code = query.code;
        var state = query.state;
        var ret = user.parseOauthState(state);

        res.send(JSON.stringify(ret, null, 4));
    };

    return exports;
};
