/*!
 * main controller
 * @author ydr.me
 * @create 2014-12-13 23:10
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    // 发现管理
    exports.getHome = function (req, res, next) {
        var data = {
            title: '发现管理'
        };

        res.render('sadmin/discover.html', data);
    };

    return exports;
};
