/*!
 * scope 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:30
 */

'use strict';


var Validator = require('ydr-validator');
var validator = new Validator();
var REG_LINES = /[\n\s]{2,}/g;

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
    maxLength: 1000,
    onafter: function (val) {
        return val.replace(REG_LINES, '\n\n');
    }
});

module.exports = validator;
