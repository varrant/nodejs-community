/*!
 * 角色值配置
 * @author ydr.me
 * @create 2014-12-10 13:50
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    // 操作权限表的权限
    // 社区创建者才有权限
    exports['review permission'] = {
        role: _pow(20),
        name: '权限 0'
    };

    exports['review permission'] = {
        role: _pow(20),
        name: '权限 0'
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
