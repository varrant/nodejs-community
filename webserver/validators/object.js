/*!
 * object 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:29
 */

'use strict';

var Validator = require('ydr-validator');
var validator = new Validator();
var REG_LINES = /[\n\s]{2,}/g;

validator.pushRule({
    name: 'title',
    type: 'string',
    alias: '标题',
    trim: true,
    minLength: 5,
    maxLength: 100
});

validator.pushRule({
    name: 'uri',
    type: 'string',
    alias: 'URI',
    trim: true,
    minLength: 5,
    maxLength: 100,
    regexp: /^[a-z-_\d]{5,100}$/i
});

validator.pushRule({
    name: 'type',
    type: 'string',
    alias: '类别',
    trim: true,
    minLength: 1,
    maxLength: 20,
    regexp: /^[a-z\d]{1,20}$/i
});

validator.pushRule({
    name: 'introduction',
    type: 'string',
    alias: '简介',
    trim: true,
    exist: true,
    maxLength: 500,
    onafter: function (val) {
        return val && val.replace(REG_LINES, '\n\n');
    }
});

validator.pushRule({
    name: 'content',
    type: 'string',
    alias: '内容',
    trim: true,
    minLength: 10,
    maxLength: 50000,
    onafter: function (val) {
        return val && val.replace(REG_LINES, '\n\n');
    }
});

module.exports = validator;
