/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:19
 */


define(function (require) {
    'use strict';

    var ajax = require('./../ajax.js');
    var selector = require('../../alien/core/dom/selector.js');
    var page = {};

    // 通知
    page.notification = function () {
        var $span = selector.query('#notification')[0];
        var html_1 = '<i class="i i-exclamation-triangle"></i>';

        $span.innerHTML = '...';
        ajax({
            url: '/api/notification/count/'
        }).on('success', function (json) {
            if (json.code === 200) {
                $span.innerHTML = '<a class="badge badge-' +
                (json.data === 0 ? 'default' : 'danger') +
                '" href="/admin/notification/"><i class="i i-at"></i>' + json.data + '</a>';
            }
        }).on('error', function () {
            $span.innerHTML = html_1;
        });
    };


    // 退出
    page.logout = function () {

    };

    page.notification();
    page.logout();
});