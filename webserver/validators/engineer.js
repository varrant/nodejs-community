/*!
 * engineer validator
 * @author ydr.me
 * @create 2014-12-17 20:03
 */


'use strict';

var configs = require('../../configs/');
var Validator = require('ydr-validator');
var validator = new Validator();
var groups = Object.keys(configs.group);

validator.pushRule({
    name: 'group',
    type: 'string',
    alias: '用户组',
    required: true,
    inArray: groups
});

module.exports = validator;