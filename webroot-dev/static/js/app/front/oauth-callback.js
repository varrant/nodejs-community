/*!
 * 授权登录回调
 * @author ydr.me
 * @create 2014-12-13 22:20
 */


define(function (require) {
    'use strict';

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
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
            data: locals
        }).on('success', function (json) {
            if (json.code !== 200) {
                app.redirect = json.redirect;
                return app._message('danger', json.message);
            }

            if (json.data) {
                // 有打开源
                if (window.opener) {
                    if (!window.opener['-norefresh-']) {
                        window.opener.location.reload();
                    }

                    setTimeout(function () {
                        window.close();
                    }, 345);
                }
                // 当前页
                else {
                    window.location.href = json.redirect;
                }
            }

            app._message('success', json.message);
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