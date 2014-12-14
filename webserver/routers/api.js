/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

module.exports = function (app, ctrlApi) {
    // notification
    app.get('/api/notification/count/', ctrlApi.notification.count);


    // object
    //app.post('/api/user/login/', ctrlApi.user.login);


    // oss
    app.put('/api/oss/', ctrlApi.oss.put);


    // type
    app.get('/api/type/', ctrlApi.type.list);
    app.put('/api/type/', ctrlApi.type.save);


    // user
    app.post('/api/user/login/', ctrlApi.user.login);
};
