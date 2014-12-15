/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

module.exports = function (app, ctrlApi) {
    // notification
    app.get('/admin/api/notification/count/', ctrlApi.notification.count);


    // scope
    app.get('/admin/api/scope/', ctrlApi.scope.list);
    app.post('/admin/api/scope/', ctrlApi.scope.post);
    app.put('/admin/api/scope/', ctrlApi.scope.put);


    // object
    app.get('/admin/api/object/', ctrlApi.object.list);


    // oss
    app.put('/admin/api/oss/', ctrlApi.oss.put);


    // type
    app.get('/admin/api/type/', ctrlApi.type.list);
    app.put('/admin/api/type/', ctrlApi.type.put);


    // role
    app.get('/admin/api/role/', ctrlApi.role.list);
    app.put('/admin/api/role/', ctrlApi.role.put);


    // user
    app.post('/api/user/login/', ctrlApi.user.login);
};
