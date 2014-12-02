/*!
 * comment 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:28
 */

'use strict';


var Validator = require('ydr-validator');
var validator = new Validator();

validator.pushRule({
    name: 'content',
    type: 'string',
    alias: '评论内容',
    trim: true,
    minLength: 5,
    maxLength: 10000
});

module.exports = validator;
