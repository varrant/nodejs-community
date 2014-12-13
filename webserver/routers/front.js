/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function (app, ctrlFront) {
    var types = app.locals.$options.types;
    var names = [];

    types.forEach(function (type) {
        if (names.indexOf(type.name) === -1 && type.isDisplay) {
            names.push(type.name);
        }
    });

    // user
    app.get('/user/oauth/authorize/', ctrlFront.user.oauthAuthorize);
    app.get('/user/oauth/callback/', ctrlFront.user.oauthCallback);

    // home
    app.get('/', ctrlFront.main.getHome);

    // list + detail
    names.forEach(function (name) {
        app.get('/' + name + '/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'page/:page/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'in/:scope/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'in/:scope/page/:page/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'on/:label/page/:page/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'in/:scope/on/:label/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'in/:scope/on/:label/page/:page/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'on/:label/in/:scope/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + 'on/:label/in/:scope/page/:page/', ctrlFront.main.getList(name));
        app.get('/' + name + '/' + ':uri.html', ctrlFront.main.getPost(name));
    });

    // engineer
    app.get('/engineer/:engineer/', ctrlFront.user.getEngineer);
};