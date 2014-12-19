/*!
 * object 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:29
 */

'use strict';

var Validator = require('ydr-validator');
var validator = new Validator();
var REG_LINES = /[\n\s]{2,}/g;
// 标题: 中英文、数字、空格、下划线、短横线、中英文逗号
var REG_TITLE = /^[\u4e00-\u9fa5a-z\d _\-，,]{5,100}$/i;
var REG_URI = /^[a-z\d_-]{5,200}$/i;
var REG_LABEL = /^[\u4e00-\u9fa5a-z\d _\-]{2,20}$/i;
var REG_INTRODUCTION = /^[\u4e00-\u9fa5a-z\d _\-~`!@#$%^&*()+={[}]|\:;"'<,>.?\/·！￥（）-—【】：；“”‘’《，》。？、\n]{0,1000}$/;
var REG_CONTENT = /^[\u4e00-\u9fa5a-z\d _\-~`!@#$%^&*()+={[}]|\:;"'<,>.?\/·！￥（）-—【】：；“”‘’《，》。？、\n]{10,50000}$/;

validator.pushRule({
    name: 'title',
    type: 'string',
    alias: '标题',
    trim: true,
    minLength: 5,
    maxLength: 100,
    regexp: REG_TITLE,
    msg: {
        regexp: '标题仅支持中英文、数字、“-”(短横线)、“_”（下划线）和中英文逗号'
    }
});

validator.pushRule({
    name: 'uri',
    type: 'string',
    alias: 'URI',
    trim: true,
    minLength: 5,
    maxLength: 200,
    regexp: REG_URI,
    msg: {
        regexp: '标题 URI 仅支持英文、数字以及“-”(短横线)和“_”（下划线）'
    }
});

validator.pushRule({
    name: 'introduction',
    type: 'string',
    alias: '简介',
    trim: true,
    exist: true,
    maxLength: 1000,
    regexp: REG_INTRODUCTION,
    onafter: function (val) {
        return val && val.replace(REG_LINES, '\n\n');
    },
    msg: {
        regexp: '简介仅支持中英文、数字，以及常用符号'
    }
});

validator.pushRule({
    name: 'content',
    type: 'string',
    alias: '内容',
    trim: true,
    minLength: 10,
    maxLength: 50000,
    regexp: REG_CONTENT,
    onafter: function (val) {
        return val && val.replace(REG_LINES, '\n\n');
    },
    msg: {
        regexp: '内容仅支持中英文、数字，以及常用符号'
    }
});

validator.pushRule({
    name: 'labels',
    type: 'array',
    alias: '标注',
    exist: true,
    onafter: function (labels) {
        var ret = [];

        labels.forEach(function (item) {
            item = String(item).trim();

            if (REG_LABEL.test(item)) {
                ret.push(item);
            }
        });

        return ret;
    }
});

module.exports = validator;
