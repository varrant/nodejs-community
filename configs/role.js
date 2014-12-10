/*!
 * 角色值配置
 * @author ydr.me
 * @create 2014-12-10 13:50
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    exports['role 0'] = _pow(0);
    exports['role 1'] = _pow(1);
    exports['role 2'] = _pow(2);
    exports['role 3'] = _pow(3);
    exports['role 4'] = _pow(4);
    exports['role 5'] = _pow(5);
    exports['role 6'] = _pow(6);
    exports['role 7'] = _pow(7);
    exports['role 8'] = _pow(8);
    exports['role 9'] = _pow(9);
    exports['role 10'] = _pow(10);
    exports['role 11'] = _pow(11);
    exports['role 12'] = _pow(12);
    exports['role 13'] = _pow(13);
    exports['role 14'] = _pow(14);
    exports['role 15'] = _pow(15);
    exports['role 16'] = _pow(16);
    exports['role 17'] = _pow(17);
    exports['role 18'] = _pow(18);
    exports['role 19'] = _pow(19);
    exports['role 20'] = _pow(20);

    return exports;
};

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * 2 的指数
 * @param num {Number}
 * @returns {number}
 * @private
 *
 * @example
 * _pow(3);
 * // => 8 = 2^3 = 2 * 2 *2
 */
function _pow(num) {
    return Math.pow(2, num);
}
