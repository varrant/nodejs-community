/*!
 * 角色权限
 * @author ydr.me
 * @create 2014-12-15 19:59
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    /**
     * 列出权限
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        var data = {
            title: '权限管理'
        };

        res.render('admin/role.html', data);
    };
    return exports;
};
