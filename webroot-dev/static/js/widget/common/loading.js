/*!
 * loading
 * @author ydr.me
 * @create 2015-03-16 11:08
 */


define(function (require, exports, module) {
    'use strict';

    var Msg = require('../../alien/ui/Msg/');
    var style = require('css!./loading.css');
    var modification = require('../../alien/core/dom/modification.js');
    var typeis = require('../../alien/utils/typeis.js');

    modification.importStyle(style);
    module.exports = function (content, size) {
        var args = arguments;
        var argL = args.length;

        if (argL === 1) {
            // loading(100)
            if (typeis.number(args[0])) {
                size = args[0];
                content = '加载中';
            }
        }

        content = content || '加载中';
        size = size || 35;

        return new Msg({
            addClass: 'dk-loading',
            width: 'height',
            height: 'width',
            title: null,
            content: '<div><div class="loading-icon" style="font-size: ' + size + 'px;">' +
            '<span class="loading-icon-x1"></span>' +
            '<span class="loading-icon-x2"></span>' +
            '<span class="loading-icon-x3"></span>' +
            '<span class="loading-icon-x4"></span>' +
            '</div></div>' + content,
            isModal: true,
            canDrag: false
        });
    };
});