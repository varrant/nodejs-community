/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:53
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var animation = require('../../alien/core/dom/animation.js');
    var event = require('../../alien/core/event/base.js');
    var Response = require('../../widget/common/Response/');
    var Imgview = require('../../alien/ui/Imgview/');
    var Prettify = require('../../alien/ui/Prettify/');
    var dato = require('../../alien/utils/dato.js');
    var url = require('../../alien/utils/url.js');
    var share = require('../../widget/common/share.js');
    var app = {};

    // toc
    app.toc = function () {
        //var $content = selector.query('#content');

        event.on(window, 'hashchange', function (eve) {
            var u = url.parse(eve.newURL);
            var hash = u.hash;
            var $target = selector.query(hash)[0];

            if (!$target) {
                return;
            }

            var top = attribute.top($target);

            animation.scrollTo(window, {
                y: top - 70
            }, {
                duration: 123
            });
        });
    };

    // 评论
    app.response = function () {
        var $title = selector.query('#object-title')[0];
        var object = window['-object-'];
        var location = window.location;
        var matches = location.href.match(/^(.*\.html)(\/page\/(\d+)\/)?($|#)/);
        var base = matches[1];
        var page = dato.parseInt(matches[3], 1);
        var history = window.history;
        var res = new Response('#response', {
            developer: window['-developer-'],
            id: object.id,
            query: {
                page: page,
                limit: 10,
                object: object.id
            },
            list: {
                developer: window['-developer-'],
                author: window['-author-'],
                object: object,
                canAccept: window['-section-'].uri === 'question'
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
            history.pushState({page: page}, null, base + '/page/' + page + '/' + location.hash);
        });

        event.on(window, 'popstate', function () {
            res.changePage(history.state ? history.state.page : 1);
        });
    };

    // 图片预览
    app.imgview = function () {
        var imgview = new Imgview();
        var onview = function () {
            imgview.open([this.src]);
        };

        event.on(document.body, 'click', '.alien-ui-response-content img', onview);
        event.on(document.body, 'click', '.postmain-content img', onview);
    };

    // 代码高亮
    app.prettify = function () {
        new Prettify('.postmain-content pre');
    };

    app.toc();
    app.response();
    app.imgview();
    app.prettify();
    share('#share');
    require('../../widget/front/login.js');
    require('../../widget/front/nav.js');
});