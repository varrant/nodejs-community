/*!
 * 后端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';

module.exports = function (app, ctrlAdmin) {
    // 中间件
    app.use(/^\/admin\/.*$/i, ctrlAdmin.middleware.login);


    // 主页
    app.get('/admin/', ctrlAdmin.main.home);


    // column
    app.get('/admin/column/', ctrlAdmin.column.get);


    // list
    app.locals.$section.forEach(function (section) {
        app.get('/admin/object/' + section.uri + '/list/', ctrlAdmin.object.list(section));
        app.get('/admin/object/' + section.uri + '/', ctrlAdmin.object.get(section));
    });


    // notification
    app.get('/admin/notification/', ctrlAdmin.notification.get);
};