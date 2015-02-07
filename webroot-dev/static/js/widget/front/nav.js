/*!
 * 前端导航
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
    var controller = require('../../alien/util/controller.js');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var app = {};
    var activeClass = 'active';
    var unfoldClass = 'unfolded';

    // 导航切换
    app.toggle = function () {
        var $header = selector.query('#header')[0];
        var $nav = selector.query('#nav')[0];
        var nodes = selector.query('.j-flag', $header);
        var $bg = nodes[0];
        var $toggle = nodes[1];
        var $menu = nodes[2];
        var $group = nodes[3];
        //var $downlist = nodes[4];
        var section = window['-section-'] || 'home';
        var $active = selector.query('.nav-item-' + section, $menu)[0];

        attribute.addClass($active, activeClass);

        event.on($toggle, 'click', function () {
            attribute.addClass($nav, unfoldClass);
        });

        event.on($bg, 'click', function () {
            attribute.removeClass($nav, unfoldClass);
        });

        event.on($group, 'click', controller.toggle(function () {
            attribute.addClass($header, activeClass);
        }, function () {
            attribute.removeClass($header, activeClass);
        }));
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
            attribute.addClass($link, activeClass);
            modification.insert($span, $link);
        }).on('error', alert);
    };

    app.toggle();
    app.notice();
});