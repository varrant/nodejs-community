/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 16:06
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var Scrollbar = require('../../alien/ui/Scrollbar/');
    var dato = require('../../alien/util/dato.js');
    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var app = {};

    app.nav = function () {
        var navClassName = 'nav-' + (window['-nav-'] || 'home');
        var $li = selector.query('#nav .' + navClassName)[0];

        attribute.addClass($li, 'active');
    };

    app.nav();
});