/*!
 * section 验证规则
 * @author ydr.me
 * @create 2014-12-22 11:03:05
 */

'use strict';


var Validator = require('ydr-validator');
var validator = new Validator();
var REG_LINES = /[\n\t\v]/g;
var REG_NAME = /^[\u4e00-\u9fa5a-z\d _\-，,]{1,50}$/i;
var REG_URI = /^[a-z\d_-]{1,50}$/i;
var REG_INTRODUCTION = /^[\u4e00-\u9fa5a-z\d _\-~`!@#$%^&*()+={[}]|\:;"'<,>.?\/·！￥（）-—【】：；“”‘’《，》。？、\n]{10,1000}$/;
var dato = require('ydr-util').dato;


validator.pushRule({
    name: 'name',
    alias: '专栏名称',
    type: 'string',
    required: true,
    maxLength: 50,
    regexp: REG_NAME
});

validator.pushRule({
    name: 'uri',
    alias: '专栏 uri',
    type: 'string',
    required: true,
    maxLength: 50,
    regexp: REG_URI
});

validator.pushRule({
    name: 'cover',
    alias: '专栏封面',
    type: 'url',
    required: true,
    minLength: 10,
    maxLength: 255
});

validator.pushRule({
    name: 'role',
    alias: '权限值',
    onbefore: function (val) {
        return dato.parseInt(val, 0);
    },
    type: 'number',
    min: 0,
    max: 10
});

validator.pushRule({
    name: 'introduction',
    alias: '专栏简介',
    type: 'string',
    required: true,
    minLength: 10,
    maxLength: 1000,
    regexp: REG_INTRODUCTION,
    onafter: function (val) {
        return val.replace(REG_LINES, '');
    }
});


module.exports = validator;
