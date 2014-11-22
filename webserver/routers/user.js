/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 22:26
 */

'use strict';


module.exports = function(app, controller){
    app.get('/api/user/oauth/authorize/', controller.oauthAuthorize);
    app.get('/api/user/oauth/callback/', controller.oauthCallback);
};