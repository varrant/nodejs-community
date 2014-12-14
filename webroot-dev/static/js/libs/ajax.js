/*!
 * ajax
 * @author ydr.me
 * @create 2014-12-13 22:25
 */


define(function (require, exports, module) {
    'use strict';

    var xhr = require('../alien/core/communication/xhr.js');
    var json = 'application/json; charset=utf-8';

    module.exports = function (options) {
        options.headers = options.headers || {};
        options.headers['content-type'] = json;
        options.headers['accept'] = json;
        options.headers['x-request-csrf'] = window['-csrf-'];
        options.data = JSON.stringify(options.data);

        return xhr.ajax(options).on('success', function (json) {
            var screenW = window.screen.width;
            var screenH = window.screen.height;
            var winW = 1080;
            var winH = 600;
            var left = (screenW - winW) / 2;
            var top = (screenH - winH) / 3;

            if(json.code === 401){
                window.open('/user/oauth/authorize/', '授权 github 登录到前端开发者社区',
                    'width=' + winW + ',height=' + winH + ',top=' + top + ',left=' + left + ',' +
                    'scrollbars=no,resizable=no,menubar=no');
            }
        });
    };
});