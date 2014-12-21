/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

var settings = ['oauth', 'smtp', 'types', 'website', 'alioss', 'roles'];

module.exports = function (app, ctrlApi) {
    // notification
    app.get('/admin/api/notification/count/', ctrlApi.notification.count);
    app.get('/admin/api/notification/', ctrlApi.notification.get);
    app.put('/admin/api/notification/', ctrlApi.notification.setActive);


    // nav
    app.get('/admin/api/nav/', ctrlApi.nav.list);


    // scope
    app.get('/admin/api/scope/', ctrlApi.scope.list);
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
    settings.forEach(function (key) {
        app.get('/admin/api/setting/' + key + '/', ctrlApi.setting.get(key));
        app.put('/admin/api/setting/' + key + '/', ctrlApi.setting.put(key));
    });


    // engineer
    app.post('/api/engineer/login/', ctrlApi.engineer.login);
    app.get('/api/engineer/', ctrlApi.engineer.get);
    app.get('/admin/api/engineer/', ctrlApi.engineer.detail);
    app.post('/admin/api/engineer/', ctrlApi.engineer.role);


    // translate
    app.get('/api/translate/', ctrlApi.translate.get);
};
