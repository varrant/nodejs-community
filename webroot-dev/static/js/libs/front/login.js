/*!
 * 登录
 * @author ydr.me
 * @create 2014-12-13 23:17
 */


define(function (require, exports, module) {
    'use strict';

    var event = require('../../alien/core/event/base.js');
    var modification = require('../../alien/core/dom/modification.js');
    var Dialog = require('../../alien/ui/Dialog/index.js');
    var page = {};

    page.initDom = function () {
        var $div = modification.create('div');

        modification.insert($div, document.body, 'beforeend');
        this.dialog = new Dialog($div, {
            title: '登录',
            remote: '/user/oauth/authorize/'
        });
    };

    page.initEvent = function () {
        event.on(document.body, 'click', '.j-login', function (eve) {
            eve.preventDefault();

            var screenW = window.screen.width;
            var screenH = window.screen.height;
            var winW = 1080;
            var winH = 600;
            var left = (screenW - winW) / 2;
            var top = (screenH - winH) / 3;

            window.open('/user/oauth/authorize/', '授权 github 登录到前端开发者社区',
                'width=' + winW + ',height=' + winH + ',top=' + top + ',left=' + left + ',' +
                'scrollbars=no,resizable=no,menubar=no');
        });
    };

    page.initEvent();
});