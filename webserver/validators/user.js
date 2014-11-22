/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 14:44
 */

'use strict';

var Validator = require('ydr-validator');
var validator = new Validator();

validator.pushRule({
    name: 'email',
    alias: '邮箱帐号',
    type: 'email',
    required: true,
    trim: true
});

validator.pushRule({
    name: 'github',
    alias: 'github 帐号',
    type: 'string',
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100
});


validator.pushRule({
    name: 'location',
    alias: '位置信息',
    type: 'string',
    // 存在才验证
    exist: true,
    required: false,
    trim: true,
    maxLength: 100
});


validator.pushRule({
    name: 'organization',
    alias: '组织信息',
    type: 'string',
    // 存在才验证
    exist: true,
    required: false,
    trim: true,
    maxLength: 100
});

module.exports = validator;