/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var config = require('../../webconfig/');
var setting = require('../services/').setting;

exports.test = function (req, res, next) {
    if (config.app.env === 'pro') {
        return next();
    }

    setting.get(function (err, doc) {
        if (err) {
            console.log(err);
            return res.send(err.message);
        }

        res.set('Content-Type', 'text/plain');
        res.send(JSON.stringify(doc, null, 4));
    });
};
