/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

var settings = ['oauth', 'alioss', 'smtp', 'website'];

module.exports = function (app, ctrlApi) {
    // notification
    app.get('/admin/api/notification/count/', ctrlApi.notification.count);
    app.get('/admin/api/notification/', ctrlApi.notification.get);
    app.put('/admin/api/notification/', ctrlApi.notification.setActive);


    // nav
    app.get('/admin/api/nav/', ctrlApi.nav.list);


    // object
    app.get('/admin/api/object/list/', ctrlApi.object.list);
    app.get('/admin/api/object/', ctrlApi.object.get);
    app.post('/admin/api/object/', ctrlApi.object.post);
    app.put('/admin/api/object/', ctrlApi.object.put);
    app.post('/admin/api/object/accept/', ctrlApi.object.accept);
    app.delete('/admin/api/object/accept/', ctrlApi.object.acceptCancel);


    // response
    app.get('/api/response/', ctrlApi.response.get);
    app.get('/api/response/list/', ctrlApi.response.list);
    app.get('/api/response/count/', ctrlApi.response.count);
    app.post('/admin/api/response/', ctrlApi.response.post);
    app.post('/admin/api/response/agree/', ctrlApi.response.agree);


    // oss
    app.put('/admin/api/oss/', ctrlApi.oss.put);


    // setting
    app.get('/admin/api/setting/', ctrlApi.setting.get);
    settings.forEach(function (key) {
        app.put('/admin/api/setting/' + key + '/', ctrlApi.setting.put(key));
    });


    // section
    app.get('/admin/api/section/', ctrlApi.section.get);
    app.put('/admin/api/section/', ctrlApi.section.put);
    app.delete('/admin/api/section/', ctrlApi.section.delete);


    // category
    app.get('/admin/api/category/', ctrlApi.category.get);
    app.put('/admin/api/category/', ctrlApi.category.put);
    app.delete('/admin/api/category/', ctrlApi.category.delete);


    // column
    app.get('/admin/api/column/', ctrlApi.column.get);
    app.put('/admin/api/column/', ctrlApi.column.put);
    app.delete('/admin/api/column/', ctrlApi.column.delete);


    // engineer
    app.post('/api/engineer/login/', ctrlApi.engineer.login);
    app.post('/api/engineer/logout/', ctrlApi.engineer.logout);
    app.get('/api/engineer/', ctrlApi.engineer.get);
    app.get('/admin/api/engineer/', ctrlApi.engineer.detail);
    app.post('/admin/api/engineer/', ctrlApi.engineer.role);


    // translate
    app.get('/api/translate/', ctrlApi.translate.get);
};
