/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-24 14:51
 */

'use strict';

var map = {
    setting: ['owner'],
    section: ['owner'],
    category: ['owner', 'admin'],
    column: ['owner', 'admin', 'vip']
};
var permission = require('../../configs/').per;
var dato = require('ydr-util').dato;


/**
 * 判断用户组是否有该权限
 * @param operator
 * @param what
 * @returns {boolean}
 */
exports.can = function (operator, what) {
    var per = map[what];

    if (!per) {
        return true;
    }

    var group = operator.group;
    var can = false;

    dato.each(per, function (index, _group) {
        if (_group === group) {
            can = true;
            return false;
        }
    });

    return can;
};
