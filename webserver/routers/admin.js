/*!
 * 后端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function(app, ctrlAdmin){
    var uris = app.locals.$settings._displayTypeUris;

    // 中间件
    app.use(/^\/admin\/.*$/i, ctrlAdmin.middleware.login);


    // 主页
    app.get('/admin/', ctrlAdmin.main.home);


    // 板块
    app.get('/admin/type/', ctrlAdmin.type.list);


    // 权限
    app.get('/admin/role/', ctrlAdmin.role.list);


    // scope
    app.get('/admin/scope/', ctrlAdmin.scope.list);


    // list
    uris.forEach(function (uri) {
        app.get('/admin/' + uri + '/list/', ctrlAdmin.object.list(uri));
        app.get('/admin/' + uri + '/', ctrlAdmin.object.get(uri));
    });
};