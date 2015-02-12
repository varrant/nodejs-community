/*!
 * column controller
 * @author ydr.me
 * @create 2014-12-19 18:38
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    /**
     * 分类设置主页
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        var data = {
            title: '专辑设置'
        };

        res.render('admin/column.html', data);
    };



    return exports;
}
