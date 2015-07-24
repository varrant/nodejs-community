/*!
 * link 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:29
 */

'use strict';


var Validator = require('ydr-utils').Validator;
var validator = new Validator();
var regexp = require('../utils/').regexp;
var REG_NAME = regexp.title(1, 50);

validator.pushRule({
    name: 'name',
    alias: '链接名称',
    type: 'string',
    required: true,
    maxLength: 30,
    regexp: REG_NAME
});


validator.pushRule({
    name: 'url',
    alias: '链接名称',
    type: 'url',
    required: true,
    maxLength: 200
});

module.exports = validator;
