/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:53
 */


define(function (require, exports, module) {
    'use strict';

    require('.././front/login.js');
    require('.././front/nav.js');
    require('.././front/footer.js');
    require('.././common/share.js');

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var animation = require('../../alien/core/dom/animation.js');
    var event = require('../../alien/core/event/touch.js');
    var Response = require('.././common/Response/');
    var Imgview = require('../../alien/ui/Imgview/');
    var Prettify = require('../../alien/ui/Prettify/');
    var dato = require('../../alien/utils/dato.js');
    var number = require('../../alien/utils/number.js');
    var url = require('../../alien/utils/url.js');
    var ajax = require('.././common/ajax.js');
    var win = window;
    var winObject = win['-object-'];
    var winSection = win['-section-'];
    var winDeveloper = win['-developer-'];
    var winAuthor = win['-author-'];
    var app = {};

    winObject.hasHidden = winObject.hasHidden === 'true';
    winObject.hasResponsed = winObject.hasResponsed === 'true';

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

            animation.scrollTo(win, {
                y: top - 70
            }, {
                duration: 123
            });
        });
    };


    // 评论
    app.response = function () {
        var $title = selector.query('#object-title')[0];
        var object = winObject;
        var location = window.location;
        var matches = location.href.match(/^(.*\.html)(\/page\/(\d+)\/)?($|#)/);
        var base = matches[1];
        var page = number.parseInt(matches[3], 1);
        var history = window.history;
        var res = new Response('#response', {
            developer: winDeveloper,
            id: object.id,
            query: {
                page: page,
                limit: 10,
                object: object.id
            },
            list: {
                developer: winDeveloper,
                author: winAuthor,
                object: object,
                canAccept: winSection.uri === 'question'
            },
            count: {
                comment: object.commentByCount,
                reply: object.replyByCount
            },
            respond: {
                githubLogin: winDeveloper.githubLogin,
                id: object.id,
                avatar: winDeveloper.avatar
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
        var postImgList = selector.query('.post-content img:not(.favicon)').map(function ($img) {
            return $img.src;
        });

        event.on(document.body, 'click', '.post-content img:not(.favicon)', function () {
            var src = this.src;
            var index = postImgList.indexOf(src);

            imgview.open(postImgList, index);
        });
    };


    // 代码高亮
    app.prettify = function () {
        new Prettify('.post-content pre');
    };

    app.toc();
    app.response();
    app.imgview();
    app.prettify();
});