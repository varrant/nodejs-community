/*!
 * response 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:28
 */

'use strict';


var Validator = require('ydr-validator');
var validator = new Validator();
var REG_LINES = /[\n\s]{2,}/g;
var regexp = require('../utils/').regexp;
var REG_CONTENT = regexp.content(5, 1000);

validator.pushRule({
    name: 'type',
    type: 'string',
    alias: '评论类型',
    required: true,
    inArray: ['comment', 'reply']
});

validator.pushRule({
    name: 'content',
    type: 'string',
    alias: '评论内容',
    trim: true,
    minLength: 5,
    maxLength: 1000,
    regexp: REG_CONTENT,
    onafter: function (val) {
        return val.replace(REG_LINES, '\n\n');
    },
    msg: {
        regexp: '内容仅支持中英文、数字，以及常用符号'
    }
});

module.exports = validator;
