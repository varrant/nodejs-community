/*!
 * 权限服务
 * @author ydr.me
 * @create 2014-12-24 14:51
 */

'use strict';

var permission = require('../../configs/').permission;
var dato = require('ydr-util').dato;


/**
 * 判断用户组是否有该权限
 * @param operator
 * @param what
 * @returns {boolean}
 */
exports.can = function (operator, what) {
    var per = permission[what];

    if (!per || !per.length) {
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
