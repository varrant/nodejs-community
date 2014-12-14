/*!
 * 授权登录回调
 * @author ydr.me
 * @create 2014-12-13 22:20
 */


define(function (require) {
    'use strict';

    var ajax = require('../../libs/ajax.js');
    var selector = require('../../alien/core/dom/selector.js');
    var page = {};
    var locals = window.locals || {};

    page._login = function () {
        var $msg = document.getElementById('msg');

        ajax({
            url: '/api/user/login/',
            method: 'post',
            data: locals
        }).on('success', function (json) {
            if (json.data) {
                if (window.opener && !window.opener['-norefresh-']) {
                    window.opener.location.reload();
                }

                window.close();
            }
            $msg.innerHTML = json.message;
        }).on('error', function (err) {
            $msg.innerHTML = err.message;
        });
    };

    page.init = function () {
        var the = this;
        var $btn = document.getElementById('btn');

        if (!$btn) {
            return the._login();
        }

        $btn.onclick = the._login;
    };

    page.init();
});