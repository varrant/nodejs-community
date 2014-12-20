/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

module.exports = function (app, ctrlApi) {
    // notification
    app.get('/admin/api/notification/count/', ctrlApi.notification.count);


    // nav
    app.get('/admin/api/nav/', ctrlApi.nav.list);

    // scope
    app.get('/admin/api/scope/list/', ctrlApi.scope.list);
    app.post('/admin/api/scope/', ctrlApi.scope.post);
    app.put('/admin/api/scope/', ctrlApi.scope.put);
    app.delete('/admin/api/scope/', ctrlApi.scope.delete);


    // object
    app.get('/admin/api/object/list/', ctrlApi.object.list);
    app.get('/admin/api/object/', ctrlApi.object.get);
    app.post('/admin/api/object/', ctrlApi.object.post);
    app.put('/admin/api/object/', ctrlApi.object.put);


    // oss
    app.put('/admin/api/oss/', ctrlApi.oss.put);


    // setting
    ['oauth', 'smtp', 'types',
        'website', 'alioss', 'roles'].forEach(function (key) {
            app.get('/admin/api/setting/' + key + '/', ctrlApi.setting.get(key));
            app.put('/admin/api/setting/' + key + '/', ctrlApi.setting.put(key));
        });

    // user
    app.post('/api/engineer/login/', ctrlApi.engineer.login);


    // translate
    app.get('/api/translate/', ctrlApi.translate.get);
};
