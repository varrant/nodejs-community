/*!
 * section controller
 * @author ydr.me
 * @create 2014-12-19 18:38
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    /**
     * 版块设置主页
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        var data = {
            title: '版块设置'
        };

        res.render('sadmin/section.html', data);
    };



    return exports;
}
