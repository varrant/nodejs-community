/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var fs = require('fs');

module.exports = function (app) {
    var exports = {};

    /**
     * 获取所有版块
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        res.json({
            code: 200,
            data: app.locals.$section
        });
    };

    return exports;
}
