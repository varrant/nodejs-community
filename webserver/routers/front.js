/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function (app, ctrlFront) {
    // user
    app.get('/developer/oauth/authorize/', ctrlFront.developer.oauthAuthorize);
    app.get('/developer/oauth/callback/', ctrlFront.developer.oauthCallback);


    // home
    app.get('/', ctrlFront.main.getHome);


    // list + detail
    // in category at column on label
    app.locals.$section.forEach(function (section) {
        var uri = section.uri;

        // ''
        app.get('/' + uri + '/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'page/:page/', ctrlFront.main.getList(section));

        // category
        app.get('/' + uri + '/' + 'in/:category/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/page/:page/', ctrlFront.main.getList(section));

        // column
        app.get('/' + uri + '/' + 'at/:column/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/page/:page/', ctrlFront.main.getList(section));

        // label
        app.get('/' + uri + '/' + 'on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/page/:page/', ctrlFront.main.getList(section));

        // category + column
        app.get('/' + uri + '/' + 'in/:category/at/:column/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/page/:page/', ctrlFront.main.getList(section));

        // category + label
        app.get('/' + uri + '/' + 'in/:category/on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/page/:page/', ctrlFront.main.getList(section));

        // column + category
        app.get('/' + uri + '/' + 'at/:column/in/:category/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/in/:category/page/:page/', ctrlFront.main.getList(section));

        // column + label
        app.get('/' + uri + '/' + 'at/:column/on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/page/:page/', ctrlFront.main.getList(section));

        // label + column
        app.get('/' + uri + '/' + 'on/:label/at/:column/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/at/:column/page/:page/', ctrlFront.main.getList(section));

        // label + category
        app.get('/' + uri + '/' + 'on/:label/in/:category/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/in/:category/page/:page/', ctrlFront.main.getList(section));

        // category + column + label
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/page/:page/', ctrlFront.main.getList(section));

        // category + label + column
        app.get('/' + uri + '/' + 'in/:category/on/:label/at/:column/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/at/:column/page/:page/', ctrlFront.main.getList(section));

        // column + category + label
        app.get('/' + uri + '/' + 'at/:column/in/:category/on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/in/:category/on/:label/page/:page/', ctrlFront.main.getList(section));

        // column + label + category
        app.get('/' + uri + '/' + 'at/:column/on/:label/in/:category/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/in/:category/page/:page/', ctrlFront.main.getList(section));

        // label + category + column
        app.get('/' + uri + '/' + 'on/:label/in/:category/at/:column/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/in/:category/at/:column/page/:page/', ctrlFront.main.getList(section));

        // label + column + category
        app.get('/' + uri + '/' + 'on/:label/at/:column/in/:category/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/at/:column/in/:category/page/:page/', ctrlFront.main.getList(section));

        app.get('/object/', ctrlFront.main.redirect);
        app.get('/' + uri + '/' + ':uri.html', ctrlFront.main.getObject(section));
    });


    // developer
    app.get('/developer/:githubLogin/', ctrlFront.developer.get);
};