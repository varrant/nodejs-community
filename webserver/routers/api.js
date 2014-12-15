/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

module.exports = function (app, ctrlApi) {
    // notification
    app.get('/admin/api/notification/count/', ctrlApi.notification.count);


    // object
    //app.post('/api/user/login/', ctrlApi.user.login);


    // oss
    app.put('/admin/api/oss/', ctrlApi.oss.put);


    // type
    app.get('/admin/api/type/', ctrlApi.type.list);
    app.put('/admin/api/type/', ctrlApi.type.put);


    // user
    app.post('/api/user/login/', ctrlApi.user.login);
};
