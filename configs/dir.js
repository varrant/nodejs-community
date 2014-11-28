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
        statics: path.join(__dirname, '../resource/static-' + app.env),
        // 资源
        resource: path.join(__dirname, '../resource'),
        // 资源
        logs: path.join(__dirname, '../logs'),
        // 资源
        uploads: path.join(__dirname, '../resource/upload')
    };
};
