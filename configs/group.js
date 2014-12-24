/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-24 22:14
 */

'use strict';

module.exports = function (app) {
    // 11 - 20
    return [
        {
            name: 'founder',
            // 2^10 + 2^11 + ... + 2^20
            role: 2096128,
            introduction: '创始人'
        },
        {
            name: 'admin',
            // 2^10 + 2^11 + ... + 2^17
            role: 1047552,
            introduction: '管理员'
        },
        {
            name: 'vip',
            // 2^10 + 2^11 + ... + 2^18
            role: 523264,
            introduction: '会员'
        },
    ];
}
