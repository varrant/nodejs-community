/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var config = require('../../webconfig/');
var user = require('../services/').user;
var setting = require('../services/').setting;


module.exports = function (app) {
    var exports = {};

    exports.test1 = function (req, res, next) {
        if (config.app.env === 'pro') {
            return next();
        }

        var url = user.createOauthURL(app.locals.settings2.oauth, 'http://sb.com:18084/test2');

        res.redirect(url);
    };

    exports.test2 = function (req, res, next) {
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


