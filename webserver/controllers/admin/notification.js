/*!
 * notification controller
 * @author ydr.me
 * @create 2014-12-21 22:07
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    exports.get = function (req, res, next) {
        var sectionURIMap = {};

        app.locals.$section.forEach(function (section) {
            sectionURIMap[section.id] = section.uri;
        });

        var data = {
            title: '提醒',
            sectionURIMap: JSON.stringify(sectionURIMap)
        };

        res.render('admin/notification.html', data);
    };

    return exports;
}
