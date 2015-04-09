/*!
 * column 验证规则
 * @author ydr.me
 * @create 2014年12月22日11:02:07
 */

'use strict';


var Validator = require('ydr-utils').validator;
var regexp = require('../utils/').regexp;
var validator = new Validator();
var REG_LINES = /[\n\t\v]/g;
var REG_NAME = regexp.title(1, 50);
var REG_URI = regexp.uri(1, 50);
var REG_INTRODUCTION = regexp.content(10, 1000);


validator.pushRule({
    name: 'name',
    alias: '专辑名称',
    type: 'string',
    required: true,
    maxLength: 50,
    regexp: REG_NAME
});

validator.pushRule({
    name: 'uri',
    alias: '专辑 uri',
    type: 'string',
    required: true,
    maxLength: 50,
    regexp: REG_URI
});

validator.pushRule({
    name: 'cover',
    alias: '专辑封面',
    type: 'url',
    required: true,
    minLength: 10,
    maxLength: 255
});

validator.pushRule({
    name: 'introduction',
    alias: '专辑简介',
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
