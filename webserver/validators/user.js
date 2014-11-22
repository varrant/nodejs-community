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
    type: 'email',
    required: true,
    trim: true
});

validator.pushRule({
    name: 'github',
    type: 'string',
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100
});

validator.pushRule({
    name: 'password',
    type: 'string',
    required: true,
    trim: false,
    minLength: 6,
    maxLength: 20
});

validator.pushRule({
    name: 'location',
    type: 'string',
    // 存在才验证
    exist: true,
    required: false,
    trim: true,
    maxLength: 100
});


validator.pushRule({
    name: 'organization',
    type: 'string',
    // 存在才验证
    exist: true,
    required: false,
    trim: true,
    maxLength: 100
});

module.exports = validator;