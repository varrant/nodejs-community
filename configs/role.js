/*!
 * 角色值配置
 * @author ydr.me
 * @create 2014-12-10 13:50
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    exports['permission 0'] = {
        role: _pow(0),
        name: '权限 0'
    };

    exports['permission 1'] = {
        role: _pow(1),
        name: '权限 1'
    };


    exports['permission 2'] = {
        role: _pow(2),
        name: '权限 2'
    };


    exports['permission 3'] = {
        role: _pow(3),
        name: '权限 3'
    };


    exports['permission 4'] = {
        role: _pow(4),
        name: '权限 4'
    };


    exports['permission 5'] = {
        role: _pow(5),
        name: '权限 5'
    };


    exports['permission 6'] = {
        role: _pow(6),
        name: '权限 6'
    };


    exports['permission 7'] = {
        role: _pow(7),
        name: '权限 7'
    };


    exports['permission 8'] = {
        role: _pow(8),
        name: '权限 8'
    };


    exports['permission 9'] = {
        role: _pow(9),
        name: '权限 9'
    };


    exports['permission 10'] = {
        role: _pow(10),
        name: '权限 10'
    };


    exports['permission 11'] = {
        role: _pow(11),
        name: '权限 11'
    };


    exports['permission 12'] = {
        role: _pow(12),
        name: '权限 12'
    };


    exports['permission 13'] = {
        role: _pow(13),
        name: '权限 13'
    };


    exports['permission 14'] = {
        role: _pow(14),
        name: '权限 14'
    };


    exports['permission 15'] = {
        role: _pow(15),
        name: '权限 15'
    };


    exports['permission 16'] = {
        role: _pow(16),
        name: '权限 16'
    };


    exports['permission 17'] = {
        role: _pow(17),
        name: '权限 17'
    };


    exports['permission 18'] = {
        role: _pow(18),
        name: '权限 18'
    };


    exports['permission 19'] = {
        role: _pow(19),
        name: '权限 19'
    };


    exports['permission 20'] = {
        role: _pow(20),
        name: '权限 20'
    };


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
