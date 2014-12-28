/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-28 20:47
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    //var compatible = require('../../alien/core/navigator/compatible.js');
    var event = require('../../alien/core/event/base.js');
    var app = {};

    //alert(compatible.css3('flex'));

    app.toggle = function () {
        var $nav = selector.query('#nav')[0];
        var nodes = selector.query('.j-flag', $nav);
        var $bg = nodes[0];
        var $toggle = nodes[1];
        var $menu = nodes[2];

        event.on($toggle, 'click', function (eve) {
            eve.preventDefault();
            attribute.css($bg, 'display', 'block');
            attribute.css($menu, 'display', 'flex');
        });

        event.on($bg, 'click', function () {
            attribute.css($bg, 'display', 'none');
            attribute.css($menu, 'display', 'none');
        });
    }

    app.toggle();
});