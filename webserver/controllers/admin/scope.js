/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 23:58
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    exports.get = function (req, res, next) {
        res.render('admin/scope.html', {
            title: '领域设置'
        });
    }

    return exports;
};
