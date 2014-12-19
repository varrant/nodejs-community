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


    // 设置
    app.get('/admin/setting/role/', ctrlAdmin.setting.listRole);
    app.get('/admin/setting/scope/', ctrlAdmin.setting.listScope);
    app.get('/admin/setting/type/', ctrlAdmin.setting.listType);
    app.get('/admin/setting/oss/', ctrlAdmin.setting.listOss);
    app.get('/admin/setting/oauth/', ctrlAdmin.setting.listOauth);
    app.get('/admin/setting/website/', ctrlAdmin.setting.listWebsite);


    // list
    uris.forEach(function (uri) {
        app.get('/admin/object/' + uri + '/list/', ctrlAdmin.object.list(uri));
        app.get('/admin/object/' + uri + '/', ctrlAdmin.object.get(uri));
    });
};