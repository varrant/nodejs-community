/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function(app, ctrlFront){
    // user
    app.get('/user/oauth/authorize/', ctrlFront.user.oauthAuthorize);
    app.get('/user/oauth/callback/', ctrlFront.user.oauthCallback);

    // home
    app.get('/', ctrlFront.main.home);
};