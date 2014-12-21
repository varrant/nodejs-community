/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-21 14:56
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    exports.get = function (req, res, next) {
        var data = {
            title: '用户管理'
        };

        res.render('admin/engineer-list.html', data);
    };

    return exports;
};
