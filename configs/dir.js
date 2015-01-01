/*!
 * 路径
 * @author ydr.me
 * @create 2014-11-22 12:43
 */

'use strict';

var path = require('path');

module.exports = function (app) {
    return {
        // 资源
        webroot: path.join(__dirname, '../webroot-' + app.env),
        // 资源
        log: path.join(__dirname, '../logs'),
        // oss 上传目录
        upload: '/f/i/'
    };
};
