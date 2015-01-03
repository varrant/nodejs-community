/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 16:26
 */


define(function (require, exports, module) {
    'use strict';

    var Item = require('../../widget/admin/Item.js');
    var Tab = require('../../alien/ui/Tab/');
    var Response = require('../../widget/common/Response/');
    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var app = {};

    app.tab = function () {
        var $tab = selector.query('#object-tab')[0];

        if(!$tab){
            return;
        }

        var tab = new Tab('#object-tab');

        tab.on('change', function (index, $activeTab, $activeContent) {
            attribute.removeClass($activeContent, 'f-none');

            var $siblings = selector.siblings($activeContent);

            $siblings.forEach(function ($sibling) {
                attribute.addClass($sibling, 'f-none');
            });
        });
    };


    app.object = function () {
        var item = new Item('#form', '#content', {
            section: window['-section-'],
            id: window['-id-']
        });

        item.on('success', app.response);
    };


    app.response = function (data) {
        var object = data.object;

        if (!object) {
            return;
        }

        var $tab = selector.query('#tab-response')[0];

        if(!$tab){
            return;
        }

        var author = object.author;
        new Response('#tab-response', {
            id: object.id,
            query: {
                page: 1,
                limit: 10,
                object: object.id
            },
            list: {
                developer: window['-developer-'],
                author: author,
                object: object
            },
            count: {
                comment: object.commentByCount,
                reply: object.replyByCount
            },
            respond: null,
            acceptByResponse: object.acceptByResponse
        });
    };

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');
    app.tab();
    app.object();
});