/*!
 * 控制器
 * @author ydr.me
 * @create 2014-12-20 16:42
 */


define(function (require, exports, module) {
    /**
     * @module utils/controller
     */
    'use strict';

    var typeis = require('./typeis.js');
    var compatible = require('../core/navigator/compatible.js');
    // MutationObserver 给开发者们提供了一种能在某个范围内的 DOM 树发生变化时作出适当反应的能力.
    // 该 API 设计用来替换掉在 DOM3 事件规范中引入的 Mutation 事件.
    var MutationObserver = compatible.html5('MutationObserver', window);

    /**
     * 至少间隔一段时间执行
     * @param fn {Function} 需要控制的方法
     * @param [wait=123] {Number} 反复执行控制的时间，单位毫秒
     * @param [isExecAtFirstTime=true] {Boolean} 是否第一次执行
     * @returns {Function}
     *
     * @example
     * window.onscroll = controller.throttle(function(){
     *    // 至少需要间隔 123ms 后执行
     * });
     */
    exports.throttle = function (fn, wait, isExecAtFirstTime) {
        var time1 = 0;
        var hasExec = false;

        wait = wait || 123;

        if (typeis.undefined(isExecAtFirstTime)) {
            isExecAtFirstTime = true;
        }

        return function () {
            if (isExecAtFirstTime && !hasExec) {
                hasExec = true;
                fn.apply(this, arguments);
            }

            if (!time1) {
                time1 = Date.now();
            }

            if (Date.now() - time1 > wait) {
                fn.apply(this, arguments);
                time1 = Date.now();
            }
        };
    };

    /**
     * 至少在最后一次触发的一段时间后执行
     * @param fn {Function} 需要控制的方法
     * @param [wait=123] {Number} 反复执行控制的时间，单位毫秒
     * @param [isExecAtFirstTime=true] {Boolean} 是否第一次执行
     * @returns {Function}
     *
     * @example
     * window.onscroll = controller.debounce(function(){
     *    // 只在最后一次触发的 123ms 后执行
     * });
     */
    exports.debounce = function (fn, wait, isExecAtFirstTime) {
        var timer = 0;
        var hasExec = false;

        wait = wait || 123;

        if (typeis.undefined(isExecAtFirstTime)) {
            isExecAtFirstTime = true;
        }

        return function () {
            var the = this;
            var args = arguments;

            if (timer) {
                clearTimeout(timer);
            }

            if (isExecAtFirstTime && !hasExec) {
                hasExec = true;
                fn.apply(this, arguments);
            }

            timer = setTimeout(function () {
                fn.apply(the, args);
                timer = 0;
            }, wait);
        };
    };


    /**
     * 只执行一次
     * @param fn {Function} 需要执行的方法
     * @returns {Function}
     *
     * @example
     * document.onclick = controller.once(function(){
     *     // 最多执行 1 次
     * });
     */
    exports.once = function (fn) {
        var hasExec = false;

        return function () {
            if (!hasExec) {
                hasExec = true;
                fn.apply(this, arguments);
            }
        };
    };


    /**
     * 切换执行
     * @returns {Function}
     *
     * @example
     * document.onclick = controller.toggle(fn1, fn2, fn3);
     * // 第 1 次执行 fn1
     * // 第 2 次执行 fn2
     * // 第 3 次执行 fn3
     * // 第 4 次执行 fn1
     * // 第 5 次执行 fn2
     * // 第 6 次执行 fn3
     * // ...
     */
    exports.toggle = function (/*fn*/) {
        var fns = Array.prototype.slice.call(arguments);
        var index = 0;
        var length = fns.length;

        return function () {
            fns[index++].apply(this, arguments);

            if (index >= length) {
                index = 0;
            }
        };
    };


    /**
     * 下一步
     * @param callback {Function} 回调
     * @param [context=window] {Object} 上下文
     * @param [args=[]] {Array} 参数
     */
    exports.nextTick = function (callback, context, args) {
        context = context || window;
        args = args || [];

        var $doc = document;
        var $body = $doc.body;
        var fn = exports.once(function () {
            callback.apply(context, args);
        });

        // chrome18+, safari6+, firefox14+,ie11+,opera15
        if (MutationObserver) {
            var $input = $doc.createElement('input');
            var observer = new MutationObserver(fn);

            observer.observe($input, {
                attributes: true
            });
            $input.value = Math.random();

            return;
        } else if (window.VBArray) {
            var $script = $doc.createElement('script');

            // IE下这个通常只要1ms,而且没有副作用，不会发现请求
            $script.onreadystatechange = function () {
                fn(); //在interactive阶段就触发
                $script.onreadystatechange = null;
                $body.removeChild($script);
                $script = null;
            };

            $body.appendChild($script);

            return;
        }

        setTimeout(fn, 0);
    };
});