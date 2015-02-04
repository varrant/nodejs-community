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
    // in category at column on label as status by autho
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

        // status
        app.get('/' + uri + '/' + 'as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'as/:status/page/:page/', ctrlFront.main.getList(section));

        // author
        app.get('/' + uri + '/' + 'by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'by/:author/page/:page/', ctrlFront.main.getList(section));

        // category + column
        app.get('/' + uri + '/' + 'in/:category/at/:column/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/page/:page/', ctrlFront.main.getList(section));

        // category + label
        app.get('/' + uri + '/' + 'in/:category/on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/page/:page/', ctrlFront.main.getList(section));

        // category + status
        app.get('/' + uri + '/' + 'in/:category/as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/as/:status/page/:page/', ctrlFront.main.getList(section));

        // category + author
        app.get('/' + uri + '/' + 'in/:category/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/by/:author/page/:page/', ctrlFront.main.getList(section));

        // column + label
        app.get('/' + uri + '/' + 'at/:column/on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/page/:page/', ctrlFront.main.getList(section));

        // column + status
        app.get('/' + uri + '/' + 'at/:column/as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/as/:status/page/:page/', ctrlFront.main.getList(section));

        // column + author
        app.get('/' + uri + '/' + 'at/:column/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/by/:author/page/:page/', ctrlFront.main.getList(section));

        // label + status
        app.get('/' + uri + '/' + 'on/:label/as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/as/:status/page/:page/', ctrlFront.main.getList(section));

        // label + author
        app.get('/' + uri + '/' + 'on/:label/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/by/:author/page/:page/', ctrlFront.main.getList(section));

        // status + author
        app.get('/' + uri + '/' + 'as/:status/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'as/:status/by/:author/page/:page/', ctrlFront.main.getList(section));

        // category + column + label
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/page/:page/', ctrlFront.main.getList(section));

        // category + column + status
        app.get('/' + uri + '/' + 'in/:category/at/:column/as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/as/:status/page/:page/', ctrlFront.main.getList(section));

        // category + column + author
        app.get('/' + uri + '/' + 'in/:category/at/:column/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/by/:author/page/:page/', ctrlFront.main.getList(section));

        // category + label + status
        app.get('/' + uri + '/' + 'in/:category/on/:label/as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/as/:status/page/:page/', ctrlFront.main.getList(section));

        // category + label + author
        app.get('/' + uri + '/' + 'in/:category/on/:label/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/by/:author/page/:page/', ctrlFront.main.getList(section));

        // column + label + status
        app.get('/' + uri + '/' + 'at/:column/on/:label/as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/as/:status/page/:page/', ctrlFront.main.getList(section));

        // column + label + author
        app.get('/' + uri + '/' + 'at/:column/on/:label/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/by/:author/page/:page/', ctrlFront.main.getList(section));

        // label + status + author
        app.get('/' + uri + '/' + 'on/:label/as/:status/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/as/:status/by/:author/page/:page/', ctrlFront.main.getList(section));

        // category + column + label + status
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/page/:page/', ctrlFront.main.getList(section));

        // category + column + label + author
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/by/:author/page/:page/', ctrlFront.main.getList(section));

        // category + column + label + status + author
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/by/:author/', ctrlFront.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/by/:author/page/:page/', ctrlFront.main.getList(section));

        app.get('/object/', ctrlFront.main.redirect);
        app.get('/' + uri + '/' + ':uri.html', ctrlFront.main.getObject(section));
    });


    // developer
    app.get('/developer/:githubLogin/', ctrlFront.developer.home);
    app.get('/developer/:githubLogin/comment/', ctrlFront.developer.comment);
    app.get('/developer/:githubLogin/comment-by/', ctrlFront.developer.commentBy);
    app.get('/developer/:githubLogin/reply/', ctrlFront.developer.reply);
    app.get('/developer/:githubLogin/reply-by/', ctrlFront.developer.replyBy);
    app.get('/developer/:githubLogin/accept/', ctrlFront.developer.accept);
    app.get('/developer/:githubLogin/accept-by/', ctrlFront.developer.acceptBy);
    app.get('/developer/:githubLogin/agree/', ctrlFront.developer.agree);
    app.get('/developer/:githubLogin/agree-by/', ctrlFront.developer.agreeBy);
    //app.locals.$section.forEach(function (sec) {
    //    app.get('/developer/:githubLogin/' + sec.uri + '/', ctrlFront.developer.object(sec.id));
    //});
};