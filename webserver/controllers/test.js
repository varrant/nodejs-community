/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var config = require('../../webconfig/');
var user = require('../services/').user;

exports.test = function (req, res, next) {
    if (config.app.env === 'pro') {
        return next();
    }


};
