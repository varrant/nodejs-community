/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-04-22 20:04
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var modification = require('../../alien/core/dom/modification.js');
    var animation = require('../../alien/core/dom/animation.js');
    var event = require('../../alien/core/event/base.js');
    var controller = require('../../alien/utils/controller.js');
    var random = require('../../alien/utils/random.js');
    var Scroll = require('../../alien/libs/scroll.js');
    var win = window;
    var app = {};


    // 滚动进度条
    app.scrollProgress = function () {
        var $progress = selector.query('#scrollProgress')[0];
        var scroll = new Scroll(win);

        scroll.on('y', function (ret) {
            animation.transition($progress, {
                width: ret.ratioY * 100 + '%'
            }, {
                duration: 100
            });
        });
    };


    // 回到顶部
    app.gotop = function () {
        var $gotop = selector.query('#gotop')[0];
        var isGoing = false;
        var animationOptions = {durtaion: 567};
        var activeClass = 'active';

        event.on(win, 'scroll', controller.debounce(function () {
            var st = attribute.scrollTop(window);

            attribute[(st > 20 ? 'add' : 'remove') + 'Class']($gotop, activeClass);
        }));

        event.on($gotop, 'click', function () {
            if (isGoing) {
                return;
            }

            isGoing = true;
            animation.scrollTo(win, {
                y: 0
            }, animationOptions, function () {
                isGoing = false;
                attribute.removeClass($gotop, activeClass);
                attribute.css($gotop, 'bottom', '');
            });

            animation.transition($gotop, {
                bottom: '100%'
            }, animationOptions);
        });
    };

    app.scrollProgress();
    app.gotop();
});