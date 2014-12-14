/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 14:52
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    /**
     * 板块列表
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        var data = {
            title: '板块管理',
            nav: 2
        };

        res.render('admin/types.html', data);
    };

    return exports;
};
