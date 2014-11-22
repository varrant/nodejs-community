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

        var conditions = {_id: '5470c3d40736a4a22dbf3f81'};


        user.findOneAndUpdate(conditions, {
            email: 'cloudcome@163.com',
            nickname: '云淡然22222',
            signInAt: new Date()
        },function () {
            console.log(arguments);
            res.send('done');
        });
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


