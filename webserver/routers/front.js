/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function (app, ctrlFront) {
    var section = app.locals.$section.map(function (item) {
        return item.uri;
    });

    // user
    app.get('/engineer/oauth/authorize/', ctrlFront.engineer.oauthAuthorize);
    app.get('/engineer/oauth/callback/', ctrlFront.engineer.oauthCallback);


    // home
    app.get('/', ctrlFront.main.getHome);


    // list + detail
    // in category at column on label
    section.forEach(function (uri) {
        // ''
        app.get('/' + uri + '/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'page/:page/', ctrlFront.main.getList(uri));

        // category
        app.get('/' + uri + '/' + 'in/:category/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:category/page/:page/', ctrlFront.main.getList(uri));

        // column
        app.get('/' + uri + '/' + 'at/:column/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'at/:column/page/:page/', ctrlFront.main.getList(uri));

        // label
        app.get('/' + uri + '/' + 'on/:label/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/page/:page/', ctrlFront.main.getList(uri));

        // category + column
        app.get('/' + uri + '/' + 'in/:category/at/:column/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:category/at/:column/page/:page/', ctrlFront.main.getList(uri));

        // category + label
        app.get('/' + uri + '/' + 'in/:category/on/:label/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:category/on/:label/page/:page/', ctrlFront.main.getList(uri));

        // column + category
        app.get('/' + uri + '/' + 'at/:column/in/:category/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'at/:column/in/:category/page/:page/', ctrlFront.main.getList(uri));

        // column + label
        app.get('/' + uri + '/' + 'at/:column/on/:label/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'at/:column/on/:label/page/:page/', ctrlFront.main.getList(uri));

        // label + column
        app.get('/' + uri + '/' + 'on/:label/at/:column/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/at/:column/page/:page/', ctrlFront.main.getList(uri));

        // label + category
        app.get('/' + uri + '/' + 'on/:label/in/:category/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/in/:category/page/:page/', ctrlFront.main.getList(uri));

        // category + column + label
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/page/:page/', ctrlFront.main.getList(uri));

        // category + label + column
        app.get('/' + uri + '/' + 'in/:category/on/:label/at/:column/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:category/on/:label/at/:column/page/:page/', ctrlFront.main.getList(uri));

        // column + category + label
        app.get('/' + uri + '/' + 'at/:column/in/:category/on/:label/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'at/:column/in/:category/on/:label/page/:page/', ctrlFront.main.getList(uri));

        // column + label + category
        app.get('/' + uri + '/' + 'at/:column/on/:label/in/:category/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'at/:column/on/:label/in/:category/page/:page/', ctrlFront.main.getList(uri));

        // label + category + column
        app.get('/' + uri + '/' + 'on/:label/in/:category/at/:column/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/in/:category/at/:column/page/:page/', ctrlFront.main.getList(uri));

        // label + column + category
        app.get('/' + uri + '/' + 'on/:label/at/:column/in/:category/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/at/:column/in/:category/page/:page/', ctrlFront.main.getList(uri));

        app.get('/' + uri + '/' + ':uri.html', ctrlFront.main.getPost(uri));
    });


    // engineer
    app.get('/engineer/:engineer/', ctrlFront.engineer.getEngineer);
};