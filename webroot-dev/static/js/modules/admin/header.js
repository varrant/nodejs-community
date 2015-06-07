/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:19
 */


define(function (require) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../../alien/widgets/alert.js');
    var confirm = require('../../alien/widgets/confirm.js');
    var selector = require('../../alien/core/dom/selector.js');
    var animation = require('../../alien/core/dom/animation.js');
    var event = require('../../alien/core/event/base.js');
    var app = {};
    var winDeveloper = window['-developer-'];

    app.scrollTop = function () {
        var $header = selector.query('header')[0];

        event.on($header, 'selectstart', function (eve) {
            eve.preventDefault();
        });

        event.on($header, 'dblclick', function (eve) {
            animation.scrollTo(window, {
                y: 0
            }, {
                duration: 234
            });

            eve.preventDefault();
        });
    };

    // 通知
    app.notification = function () {
        if (!winDeveloper.id) {
            return;
        }

        var $span = selector.query('#notification')[0];
        var html_1 = '<i class="fi fi-exclamation-triangle s-danger"></i>';

        ajax({
            url: '/admin/api/notification/count/',
            loading: false
        }).on('success', function (data) {
            $span.innerHTML = '<a class="badge badge-' +
                (data === 0 ? 'default' : 'danger') +
                '" href="/admin/notification/"><i class="fi fi-at"></i><span>' + data + '</span></a>';
        }).on('error', function () {
            $span.innerHTML = html_1;
        });
    };


    // 退出
    app.logout = function () {
        var logout = function () {
            ajax({
                method: 'post',
                url: '/api/developer/logout/',
                loading: '注销中'
            }).on('success', function () {
                location.href = '/';
            }).on('error', alert);
        };

        event.on(document, 'click', '.j-logout', function (eve) {
            eve.preventDefault();
            confirm('确定要登出吗？').on('sure', logout);
        });
    };

    app.scrollTop();
    app.notification();
    app.logout();
});