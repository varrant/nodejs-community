/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-28 20:47
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var modification = require('../../alien/core/dom/modification.js');
    var see = require('../../alien/core/dom/see.js');
    //var compatible = require('../../alien/core/navigator/compatible.js');
    var event = require('../../alien/core/event/base.js');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var app = {};

    // 导航切换
    app.toggle = function () {
        var $nav = selector.query('#nav')[0];
        var nodes = selector.query('.j-flag', $nav);
        var $bg = nodes[0];
        var $toggle = nodes[1];
        var $menu = nodes[2];
        var section = window['-section-'] || 'home';
        var $active = selector.query('.nav-item-' + section, $menu)[0];

        attribute.addClass($active, 'active');

        if (see.visibility($menu) === 'visible') {
            return;
        }

        event.on($toggle, 'click', function (eve) {
            eve.preventDefault();
            attribute.css($bg, 'display', 'block');
            attribute.css($menu, 'display', 'flex');
        });

        event.on($bg, 'click', function () {
            attribute.css($bg, 'display', 'none');
            attribute.css($menu, 'display', 'none');
        });
    };

    // 未读通知
    app.notice = function () {
        var $link = selector.query('#admin-enter')[0];

        if (!$link) {
            return;
        }

        ajax({
            url: '/admin/api/notification/count/'
        }).on('success', function (json) {
            if (json.code !== 200) {
                return alert(json);
            }

            if (!json.data) {
                return;
            }

            var $span = modification.create('span', {
                class: 'badge badge-danger'
            });

            $span.innerHTML = json.data;
            attribute.addClass($link, 'active');
            modification.insert($span, $link);
        }).on('error', alert);
    };

    app.toggle();
    app.notice();
});