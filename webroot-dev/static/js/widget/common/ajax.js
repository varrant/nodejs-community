/*!
 * ajax
 * @author ydr.me
 * @create 2014-12-13 22:25
 */


define(function (require, exports, module) {
    'use strict';

    var xhr = require('../../alien/core/communication/xhr.js');
    var login = require('./login.js');
    var confirm = require('./confirm.js');
    var json = 'application/json; charset=utf-8';
    var refresh = function () {
        window.location.reload();
    };

    module.exports = function (options) {
        options.headers = options.headers || {};
        options.headers['content-type'] = json;
        options.headers['accept'] = json;
        options.headers['x-request-csrf'] = window['-csrf-'];
        options.data = JSON.stringify(options.data);

        return xhr.ajax(options)
            .on('success', function (json) {
                // 登陆
                if(json.code === 401){
                    login();
                }

                switch (json.code){
                    case 400:
                        break;

                    case 401:
                        confirm('是否要立即登陆继续操作？', login);
                        break;

                    case 406:
                        confirm('是否要刷新当前页面以更新会话的认证信息？', refresh);
                        break;
                }
            });
    };
});