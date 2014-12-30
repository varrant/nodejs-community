/*!
 * login
 * @author ydr.me
 * @create 2014-12-14 20:21
 */


define(function (require, exports, module) {
    'use strict';

    module.exports = function () {
        var screenW = window.screen.width;
        var screenH = window.screen.height;
        var winW = 1080;
        var winH = 600;
        var left = (screenW - winW) / 2;
        var top = (screenH - winH) / 3;

        window.open('/developer/oauth/authorize/', '授权 github 登录到前端开发者社区',
            'width=' + winW + ',height=' + winH + ',top=' + top + ',left=' + left + ',' +
            'scrollbars=no,resizable=no,menubar=no');
    };
});