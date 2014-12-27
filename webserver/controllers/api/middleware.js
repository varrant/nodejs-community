/*!
 * API 中间件
 * @author ydr.me
 * @create 2014-12-27 23:56
 */

'use strict';


module.exports = function () {
    var exports = {};

    /**
     * 仅在开发环境下，延迟 api 接口
     * @param timeout
     */
    exports.delay = function (timeout) {
        return function (req, res, next) {
            setTimeout(next, timeout || 0);
        };
    };

    return exports;
};
