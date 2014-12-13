/*!
 * 角色值配置
 * @author ydr.me
 * @create 2014-12-10 13:50
 */

'use strict';


module.exports = function (app) {
    var exports = {};

    exports['owner'] = {
        role: _pow(20),
        name: '社区创建者'
    };

    exports['set user title'] = {
        role: _pow(19),
        name: '设置/取消用户的头衔'
    };

    exports['set object property'] = {
        role: _pow(18),
        name: '设置/取消 object 属性，如加色/加分/设置精华/设置推荐/设置认证等'
    };

    exports['update object content'] = {
        role: _pow(17),
        name: '更新他人的 object 内容'
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
