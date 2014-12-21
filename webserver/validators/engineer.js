/*!
 * engineer validator
 * @author ydr.me
 * @create 2014-12-17 20:03
 */


'use strict';

var Validator = require('ydr-validator');
var validator = new Validator();
var REG_INTRODUCTION = /^[\u4e00-\u9fa5a-z\d _\-~`!@#$%^&*()+={[}]|\:;"'<,>.?\/·！￥（）-—【】：；“”‘’《，》。？、\n]{0,1000}$/;

validator.pushRule({
    name: 'bio',
    alias: '个人简介',
    type: 'string',
    required: false,
    maxLength: 1000,
    trim: true,
    exist: true,
    regexp: REG_INTRODUCTION,
    msg: {
        regexp: '简介仅支持中英文、数字，以及常用符号'
    }
});


module.exports = validator;