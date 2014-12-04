/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function(app, ctrlFrontend){
    // user
    app.get('/user/oauth/authorize/', ctrlFrontend.user.oauthAuthorize);
    app.get('/user/oauth/callback/', ctrlFrontend.user.oauthCallback);

    // home
    app.get('/', ctrlFrontend.frontend.home);
};