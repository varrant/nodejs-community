/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-24 22:11
 */

'use strict';

module.exports = function (app) {
    var rolesMap = {};
    var number = 0;

    rolesMap[_pow2(number++)] = {
        name: 'create post',
        desc: '发布观点'
    };

    return rolesMap;
};

/**
 * 2的开方计算
 * @param mathStr
 * @returns {number}
 * @private
 */
function _pow2(pow) {
    return Math.pow(2, pow);
}
