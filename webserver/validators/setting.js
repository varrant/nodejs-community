/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 20:42
 */

'use strict';

var Validator = require('ydr-validator');
var validator = new Validator();

validator.pushRule({
    name: 'key',
    alias: '配置名称',
    type: 'string',
    required: true,
    trim: true
});

module.exports = validator;
