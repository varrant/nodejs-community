/*!
 * 后端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';

var settings = ['oauth', 'smtp', 'types', 'website', 'alioss', 'roles'];

module.exports = function (app, ctrlAdmin) {
    var section = app.locals.$section.map(function (item) {
        return item.uri;
    });

    // 中间件
    app.use(/^\/admin\/.*$/i, ctrlAdmin.middleware.login);


    // 主页
    app.get('/admin/', ctrlAdmin.main.home);


    // 设置
    app.get('/admin/setting/', ctrlAdmin.setting.get);


    // section
    app.get('/admin/section/', ctrlAdmin.section.get);


    // engineer
    app.get('/admin/engineer/list/', ctrlAdmin.engineer.list);
    app.get('/admin/engineer/', ctrlAdmin.engineer.get);
    app.get('/admin/me/', ctrlAdmin.engineer.me);


    // list
    section.forEach(function (uri) {
        app.get('/admin/object/' + uri + '/list/', ctrlAdmin.object.list(uri));
        app.get('/admin/object/' + uri + '/', ctrlAdmin.object.get(uri));
    });


    // notification
    app.get('/admin/notification/', ctrlAdmin.notification.get);
};