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
    var confirm = require('../common/confirm.js');
    var app = {};
    var activeClass = 'active';
    var unfoldClass = 'unfolded';
    var hasLogin = !!window['-developer-'].id;

    // 导航切换
    app.toggle = function () {
        var $header = selector.query('#header')[0];
        var $nav = selector.query('#nav')[0];
        var nodes = selector.query('.j-flag', $header);
        var $bg = nodes[0];
        var $toggle = nodes[1];
        var $menu = nodes[2];
        var $group = nodes[3];
        var $downlist = nodes[4];
        //var $downlist = nodes[4];
        var section = window['-section-'] && window['-section-'].uri || 'home';
        var $active = selector.query('.nav-item-' + section, $menu)[0];

        attribute.addClass($active, activeClass);

        event.on($toggle, 'click tap', function () {
            attribute.addClass($nav, unfoldClass);
            return false;
        });

        event.on($bg, 'click tap', function () {
            attribute.removeClass($nav, unfoldClass);
            return false;
        });

        if (hasLogin) {
            event.on($group, 'click tap', function () {
                if (attribute.hasClass($header, activeClass)) {
                    attribute.removeClass($header, activeClass);
                } else {
                    attribute.addClass($header, activeClass);
                }
                return false;
            });

            event.on($downlist, 'click tap', function (eve) {
                eve.stopPropagation();
            });

            event.on(document, 'click tap', function () {
                attribute.removeClass($header, activeClass);
            });
        }
    };

    // 未读通知
    app.notification = function () {
        if (!hasLogin) {
            return;
        }

        var $notification = selector.query('.j-notification-wrap');

        if (!$notification.length) {
            return;
        }

        ajax({
            url: '/admin/api/notification/count/'
        }).on('success', function (json) {
            if (json.code !== 200) {
                return alert(json);
            }

            var val = json.data || 0;
            var text = val > 9 ? 'N' : val;

            $notification.forEach(function ($wrap) {
                var $span = modification.create('span', {
                    class: 'j-notification-count f-transition',
                    'data-value': val
                });

                $span.innerHTML = text;
                attribute.css($span, 'display', val ? '' : 'none');
                modification.insert($span, $wrap);
            });
        }).on('error', alert);
    };


    // 退出
    app.logout = function () {
        var logout = function () {
            ajax({
                method: 'post',
                url: '/api/developer/logout/'
            }).on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                location.reload();
            }).on('error', alert);
        };

        event.on(document, 'click', '.j-logout', function (eve) {
            eve.preventDefault();
            confirm('确定要登出吗？', logout);
        });
    };

    app.toggle();
    app.notification();
    app.logout();
});