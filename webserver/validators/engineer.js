/*!
 * developer validator
 * @author ydr.me
 * @create 2014-12-17 20:03
 */


'use strict';

var configs = require('../../configs/');
var Validator = require('ydr-validator');
var validator = new Validator();
var groups = configs.group.map(function (gp) {
    return gp.name;
});

validator.pushRule({
    name: 'group',
    type: 'string',
    alias: '用户组',
    required: false,
    exist: true,
    inArray: groups
});

module.exports = validator;