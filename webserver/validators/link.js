/*!
 * link 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:29
 */

'use strict';


var Validator = require('ydr-utils').Validator;
var validator = new Validator();
var regexp = require('../utils/').regexp;
var REG_NAME = regexp.title(1, 30);

validator.pushRule({
    name: 'text',
    alias: '链接文本',
    type: 'string',
    required: true,
    maxLength: 30,
    regexp: REG_NAME
});


validator.pushRule({
    name: 'url',
    alias: '链接地址',
    type: 'url',
    required: true,
    maxLength: 255
});

module.exports = validator;
