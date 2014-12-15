/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:53
 */

'use strict';

var fs = require('fs');

module.exports = function (app) {
    var exports = {};

    /**
     * 列出域
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        var data = {
            title: '域管理'
        };
        res.render('admin/scope.html', data);
    }

    return exports;
}
