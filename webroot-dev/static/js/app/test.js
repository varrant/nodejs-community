/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-23 21:20
 */


define(function (require, exports, module) {

    /**
     * 自增
     * @param id {String} DOM id
     * @param max {Number} 最大值
     * @param interval {Number} 定时器时间间隔
     */
    var increase = function (id, max, interval) {
        var node = document.getElementById(id);
        var begin = 0;
        var _increase = function () {
            if (timer && begin === max) {
                clearInterval(timer);
            }

            node.innerHTML = String(begin++);
        };
        var timer = setInterval(_increase, interval);
    };

    increase('fly1', 100, 1000);
});