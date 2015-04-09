/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-16 10:15
 */

'use strict';

var Validator = require('ydr-utils').Validator;
var validator = new Validator();

validator.pushRule({
    name: 'word',
    type: 'string',
    alias: '搜索词',
    trim: true,
    required: true,
    maxLength: 50,
    msg: {
        required: '搜索关键词不能为空',
        maxLength: '试试短小精悍的关键词来搜索'
    }
});

module.exports = validator;
