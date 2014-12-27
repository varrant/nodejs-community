/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:53
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var Response = require('../../widget/front/Response/');
    var app = {};

    app.response = function () {
        var $title = selector.query('#object-title')[0];
        var res = new Response('#response', {
            id: window['-object-'],
            query: {
                page: window['-page-'],
                limit: 3,
                object: window['-object-'].id
            },
            list: {
                engineer: window['-engineer-'],
                author: window['-author-'],
                object: window['-object-']
            },
            respond: {
                id: window['-object-'].id,
                avatar: window['-engineer-'].avatar
            },
            acceptResponse: window['-object-'].acceptResponse
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
});