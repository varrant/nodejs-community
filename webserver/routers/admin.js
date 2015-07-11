/*!
 * 后端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';

var cache = require('ydr-utils').cache;





module.exports = function (app, ctrl) {
    // 中间件
    app.use(/^\/admin\/.*$/i, ctrl.middleware.login);


    // 主页
    //app.get('/admin/', ctrl.main.home);


    // column
    app.get('/admin/column/', ctrl.column.get);


    // list
    cache.get('app.sectionList').forEach(function (section) {
        app.get('/admin/object/' + section.uri + '/list/', ctrl.object.list(section));
        app.get('/admin/object/' + section.uri + '/', ctrl.object.get(section));
    });


    // notification
    app.get('/admin/notification/', ctrl.notification.get);


    // me
    app.get('/admin/me/', ctrl.developer.me);
};