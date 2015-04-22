/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-04-22 20:04
 */


define(function (require, exports, module) {
    /**
     * @module parent/footer
     */
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var modification = require('../../alien/core/dom/modification.js');
    var animation = require('../../alien/core/dom/animation.js');
    var event = require('../../alien/core/event/base.js');
    var controller = require('../../alien/utils/controller.js');
    var Scroll = require('../../alien/ui/Scroll/');
    var win = window;
    var app = {};


    app.loadProgress = function () {
        var REG_LOADED = /loaded|complete/;
        var $progress = selector.query('#loadProgress')[0];
        var percent = 50;
        var onload = function () {
            clearInterval(timeid);
            attribute.css($progress, 'width', '100%');

            setTimeout(function () {
                attribute.css($progress, 'opacity', 0);
            }, 500);
        };
        var timeid = setInterval(function () {
            if (REG_LOADED.test(document.readyState) || win.loaded) {
                return onload();
            }

            percent += 5;

            if (percent >= 90) {
                percent = 90;
            }

            attribute.css($progress, 'width', percent + '%');
        }, 200);

        event.on(win, 'load', onload);
    };


    app.scrollProgress = function () {
        var $progress = selector.query('#scrollProgress')[0];
        var scroll = new Scroll(win);

        scroll.on('y', function (ret) {
            animation.transition($progress, {
                width: ret.ratio * 100 + '%'
            }, {
                duration: 100
            });
        });
    };

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

    app.loadProgress();
    app.scrollProgress();
    app.gotop();
});