/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 16:26
 */


define(function (require, exports, module) {
    'use strict';

    var Item = require('../../widget/admin/Item.js');
    var Tab = require('../../alien/ui/Tab/');
    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    new Item('#form', '#content', {
        section: window['-section-'],
        id: window['-id-']
    });

    var tab = new Tab('#object-tab');

    tab.on('change', function (index, $activeTab, $activeContent) {
        attribute.removeClass($activeContent, 'f-none');

        var $siblings = selector.siblings($activeContent);

        $siblings.forEach(function ($sibling) {
            attribute.addClass($sibling, 'f-none');
        });
    });
});