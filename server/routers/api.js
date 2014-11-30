/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

module.exports = function(app, ctrlApi){
    app.post('/api/user/sign_in/', ctrlApi.user.signIn);
    app.put('/api/oss/', ctrlApi.oss.put);
};
