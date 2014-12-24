/*!
 * 用户组权限配置
 * @author ydr.me
 * @create 2014-12-24 15:54
*/

'use strict';

module.exports = function (app) {
    return {
        setting: ['owner'],
        section: ['owner'],
        category: ['owner', 'admin'],
        column: ['owner']
    };
};
