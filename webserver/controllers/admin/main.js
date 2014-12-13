/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-13 23:10
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    exports.home = function (req, res, next) {
        res.send('管理员首页');
    };

    return exports;
};
