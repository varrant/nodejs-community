/*!
 * 授权登录回调
 * @author ydr.me
 * @create 2014-12-13 22:20
 */


define(function (require) {
    'use strict';

    var ajax = require('../../modules/common/ajax.js');
    var alert = require('../../alien/widgets/alert.js');
    var selector = require('../../alien/core/dom/selector.js');
    var app = {};
    var locals = window.locals || {};

    app._login = function () {
        var $msg = document.getElementById('msg');

        if (app.redirect) {
            return window.location.href = app.redirect;
        }

        ajax({
            url: '/api/developer/login/',
            method: 'post',
            body: locals,
            loading: '登录中'
        }).on('success', function (data) {
            if (data.login) {
                // 有打开源
                if (window.opener) {
                    if (!window.opener['-norefresh-']) {
                        window.opener.location.reload();
                    }

                    setTimeout(function () {
                        window.close();
                    }, 345);
                }
                // 跳转页
                else {
                    window.location.href = data.redirect;
                }
            }

            app._message('success', data.message);
        }).on('error', function (err) {
            app._message('danger', err.message);
        });
    };


    /**
     * 输出消息
     * @param type
     * @param message
     * @private
     */
    app._message = function (type, message) {
        var $msg = document.getElementById('msg');

        $msg.className = 's-' + type;
        $msg.innerHTML = message;
    };


    app.init = function () {
        var the = this;
        var $btn = document.getElementById('btn');

        if (!$btn) {
            return the._login();
        }

        $btn.onclick = the._login;
    };

    app.init();
});