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
        static: path.join(__dirname, '../static-' + app.env),
        // 资源
        resource: path.join(__dirname, '../resouce'),
        // 资源
        upload: path.join(__dirname, '../resouce/upload')
    };
};
