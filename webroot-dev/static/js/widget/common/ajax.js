/*!
 * ajax
 * @author ydr.me
 * @create 2014-12-13 22:25
 */


define(function (require, exports, module) {
    'use strict';

    var xhr = require('../../alien/core/communication/xhr.js');
    var json = 'application/json; charset=utf-8';

    module.exports = function (options) {
        var isFormData = options.data && options.data.constructor === FormData;

        options.headers = options.headers || {};

        if (!isFormData) {
            options.headers['content-type'] = options.headers['content-type'] || json;

        }

        options.headers['accept'] = json;
        options.headers['x-request-csrf'] = window['-csrf-'];

        if (!isFormData) {
            options.body = JSON.stringify(options.body);
        }

        return xhr.ajax(options)
            .on('success', function (json) {
                switch (json.code) {
                    // 认证不合法
                    case 400:
                    // 认证不正确
                    case 406:
                        window['-csrf-'] = json.data || '';
                        break;

                    // 未登陆
                    case 401:
                        break;
                }
            });
    };
});