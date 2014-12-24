/*!
 * category 验证规则
 * @author ydr.me
 * @create 2014-12-22 11:02:13
 */

'use strict';


var Validator = require('ydr-validator');
var validator = new Validator();
var REG_LINES = /[\n\t\v]/g;
var REG_NAME = /^[\u4e00-\u9fa5a-z\d _\-，,]{1,50}$/i;
var REG_URI = /^[a-z\d_-]{1,50}$/i;
var REG_INTRODUCTION = /^[\u4e00-\u9fa5a-z\d _\-~`!@#$%^&*()+={[}]|\:;"'<,>.?\/·！￥（）-—【】：；“”‘’《，》。？、\n]{10,1000}$/;

validator.pushRule({
    name: 'name',
    alias: '名称',
    type: 'string',
    required: true,
    maxLength: 50
});

validator.pushRule({
    name: 'uri',
    alias: 'URI',
    type: 'string',
    required: true,
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
    required: true,
    maxLength: 1000,
    onafter: function (val) {
        return val.replace(REG_LINES, '');
    }
});

module.exports = validator;
