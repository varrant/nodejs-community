/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:53
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var event = require('../../alien/core/event/base.js');
    var Response = require('../../widget/common/Response/');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var Imgview = require('../../alien/ui/Imgview/');
    var app = {};

    app.response = function () {
        var $title = selector.query('#object-title')[0];
        var object = window['-object-'];
        var res = new Response('#response', {
            id: object.id,
            query: {
                page: hashbang.get('query', 'page') || 1,
                limit: 10,
                object: object.id
            },
            list: {
                developer: window['-developer-'],
                author: window['-author-'],
                object: object
            },
            count: {
                comment: object.commentByCount,
                reply: object.replyByCount
            },
            respond: {
                githubLogin: window['-developer-'].githubLogin,
                id: object.id,
                avatar: window['-developer-'].avatar
            },
            acceptByResponse: object.acceptByResponse
        });

        res.on('accept', function () {
            attribute.addClass($title, 'has-accepted');
            attribute.removeClass($title, 'un-accepted');
        });

        res.on('page', function (page) {
            hashbang.set('query', {
                page: page
            });
        });

        hashbang.on('query', 'page', function (eve, neo, old) {
            res.changePage(neo.query.page);
        });
    };


    app.imgview = function () {
        var imgview = new Imgview();
        var onview = function () {
            imgview.open([this.src]);
        };

        event.on(document.body, 'click', '.alien-ui-response-content img', onview);
        event.on(document.body, 'click', '.postmain-content img', onview);
    };

    app.response();
    app.imgview();
    require('../../widget/front/login.js');
    require('../../widget/front/nav.js');
});