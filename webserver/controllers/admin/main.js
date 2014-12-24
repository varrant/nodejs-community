/*!
 * main
 * @author ydr.me
 * @create 2014-12-13 23:10
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    /**
     * 管理首页
     * @param req
     * @param res
     * @param next
     */
    exports.home = function (req, res, next) {
        var data = {
            title: '管理首页'
        };

        res.render('admin/home.html', data);
    };

    return exports;
};
