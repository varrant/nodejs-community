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
    var login = require('../common/login.js');
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
            login();
        });
    };

    page.initEvent();
});