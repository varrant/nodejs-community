/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function(app, ctrlFront){
    var types = app.locals.options.types;
    var names = [];

    types.forEach(function (type) {
        if(names.indexOf(type.name) === -1 && type.isDisplay){
            names.push(type.name);
        }
    });

    var regPost = new RegExp('^\\/('+names.join('|')+')\\/([\\w-.]+)\\.html$');

    // user
    app.get('/user/oauth/authorize/', ctrlFront.user.oauthAuthorize);
    app.get('/user/oauth/callback/', ctrlFront.user.oauthCallback);

    // home
    app.get('/', ctrlFront.main.getHome);
    app.get(regPost, ctrlFront.main.getPost);
};