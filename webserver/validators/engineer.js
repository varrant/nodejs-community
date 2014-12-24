/*!
 * engineer validator
 * @author ydr.me
 * @create 2014-12-17 20:03
 */


'use strict';

var Validator = require('ydr-validator');
var validator = new Validator();
var groups = [
    // 普通
    'normal',
    // VIP
    'vip',
    // 管理员
    'admin',
    // 所有者
    'owner'
];

validator.pushRule({
    name: 'group',
    type: 'string',
    alias: '用户组',
    required: true,
    inArray: groups
});

module.exports = validator;