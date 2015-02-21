/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 16:26
 */


define(function (require, exports, module) {
    'use strict';

    var Item = require('../../widget/admin/Item.js');
    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var event = require('../../alien/core/event/base.js');
    var app = {};


    app.object = function () {
        var item = new Item('#form', '#content', {
            section: window['-section-'].id,
            id: window['-id-']
        });

        item.on('success', app.response);
    };

    require('../../widget/front/nav.js');


    app.object();
});