/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 12:43
 */

'use strict';

var path = require('path');

module.exports = function (app) {
    return {
        // 静态
        static: path.join(__dirname, '../webroot/static-' + app.env),
        // 资源
        webroot: path.join(__dirname, '../webroot'),
        // 资源
        weblog: path.join(__dirname, '../weblog'),
        // 资源
        upload: path.join(__dirname, '../webroot/upload')
    };
};
