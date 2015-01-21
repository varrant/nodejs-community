/*!
 * 分组
 * @author ydr.me
 * @create 2014-12-24 22:14
 */

'use strict';

module.exports = function (app) {
    // 11 - 20
    return [
        {
            name: 'founder',
            role: 20,
            introduction: '创始人'
        },
        {
            name: 'admin',
            role: 19,
            introduction: '管理员'
        },
        {
            name: 'vip',
            role: 18,
            introduction: '会员'
        },
        {
            name: 'writer',
            role: 17,
            introduction: '作者'
        }
    ];
}
