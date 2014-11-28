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
    name: 'nickname',
    alias: '昵称',
    type: 'string',
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 12
});

module.exports = validator;