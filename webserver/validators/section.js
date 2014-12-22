/*!
 * section 验证规则
 * @author ydr.me
 * @create 2014-12-22 11:03:05
 */

'use strict';


var Validator = require('ydr-validator');
var validator = new Validator();
var REG_LINES = /[\n\t\v]/g;

validator.pushRule({
    name: 'name',
    alias: '名称',
    type: 'string',
    minLength: 1,
    maxLength: 50
});

validator.pushRule({
    name: 'uri',
    alias: 'URI',
    type: 'string',
    minLength: 1,
    maxLength: 20,
    regexp: /^[a-z-_\d]{1,20}$/i
});

validator.pushRule({
    name: 'cover',
    alias: '封面',
    type: 'string',
    minLength: 10,
    maxLength: 255
});

validator.pushRule({
    name: 'introduction',
    alias: '介绍',
    type: 'string',
    maxLength: 1000,
    onafter: function (val) {
        return val.replace(REG_LINES, '');
    }
});

module.exports = validator;
