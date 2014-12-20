/*!
 * 后端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';

var settings = ['oauth', 'smtp', 'types', 'website', 'alioss', 'roles'];

module.exports = function(app, ctrlAdmin){
    var uris = app.locals.$settings._displayTypeUris;

    // 中间件
    app.use(/^\/admin\/.*$/i, ctrlAdmin.middleware.login);


    // 主页
    app.get('/admin/', ctrlAdmin.main.home);


    // 设置
    settings.forEach(function (key) {
        app.get('/admin/setting/'+key+'/', ctrlAdmin.setting.get(key));
    });


    // list
    uris.forEach(function (uri) {
        app.get('/admin/object/' + uri + '/list/', ctrlAdmin.object.list(uri));
        app.get('/admin/object/' + uri + '/', ctrlAdmin.object.get(uri));
    });
};