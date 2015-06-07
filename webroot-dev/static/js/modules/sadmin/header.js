/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:19
 */


define(function (require) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var animation = require('../../alien/core/dom/animation.js');
    var event = require('../../alien/core/event/base.js');
    var app = {};

    app.scrollTop = function () {
        var $header = selector.query('header')[0];

        event.on($header, 'selectstart', function (eve) {
            eve.preventDefault();
        });

        event.on($header, 'dblclick', function (eve) {
            animation.scrollTo(window, {
                y: 0
            }, {
                duration: 234
            });

            eve.preventDefault();
        });
    };


    app.scrollTop();
});