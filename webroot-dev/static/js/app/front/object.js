/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:53
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var Response = require('../../widget/common/Response/');
    var app = {};

    app.response = function () {
        var $title = selector.query('#object-title')[0];
        var object = window['-object-'];
        var res = new Response('#response', {
            id: object.id,
            query: {
                page: window['-page-'],
                limit: 3,
                object: object.id
            },
            list: {
                engineer: window['-engineer-'],
                author: window['-author-'],
                object: object
            },
            count: {
                comment: object.commentByCount,
                reply: object.replyByCount
            },
            respond: {
                id: object.id,
                avatar: window['-engineer-'].avatar
            },
            acceptByResponse: object.acceptByResponse
        });

        res.on('accept', function (boolean) {
            if (boolean) {
                attribute.addClass($title, 'has-accepted');
                attribute.removeClass($title, 'un-accepted');
            } else {
                attribute.addClass($title, 'un-accepted');
                attribute.removeClass($title, 'has-accepted');
            }
        });
    };

    app.response();
    require('../../widget/front/login.js');
    require('../../widget/front/nav.js');
});