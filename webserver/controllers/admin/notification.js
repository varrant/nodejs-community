/*!
 * notification controller
 * @author ydr.me
 * @create 2014-12-21 22:07
 */

'use strict';

var cache = require('ydr-utils').cache;

module.exports = function (app) {
    var exports = {};

    exports.get = function (req, res, next) {
        var data = {
            title: '我的通知',
            sectionURIMap: cache.get('app.sectionURIMap')
        };

        res.render('admin/notification.html', data);
    };

    return exports;
};
