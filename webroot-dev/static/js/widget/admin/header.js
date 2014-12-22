/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:19
 */


define(function (require) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var selector = require('../../alien/core/dom/selector.js');
    var event = require('../../alien/core/event/base.js');
    var page = {};

    // 通知
    page.notification = function () {
        var $span = selector.query('#notification')[0];
        var html_1 = '<i class="i i-exclamation-triangle s-danger"></i>';

        ajax({
            url: '/admin/api/notification/count/'
        }).on('success', function (json) {
            if (json.code === 200) {
                $span.innerHTML = '<a class="badge badge-' +
                (json.data === 0 ? 'default' : 'danger') +
                '" href="/admin/notification/"><i class="i i-at"></i>' + json.data + '</a>';
            } else {
                $span.innerHTML = html_1;
            }
        }).on('error', function () {
            $span.innerHTML = html_1;
        });
    };


    // 退出
    page.logout = function () {
        var logout = function () {
            ajax({
                method: 'post',
                url: '/api/engineer/logout/'
            }).on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                location.href = '/';
            }).on('error', alert);
        };

        event.on(document, 'click', '.j-logout', function (eve) {
            eve.preventDefault();
            confirm('确定要登出吗？', logout);
        });
    };

    page.notification();
    page.logout();
});