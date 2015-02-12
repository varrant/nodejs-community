/*!
 * api middleware
 * @author ydr.me
 * @create 2014-12-27 23:56
 */

'use strict';

var permission = require('../../services/').permission;
var role20 = 1 << 20;

module.exports = function () {
    var exports = {};

    // 导航
    exports.nav = function (req, res, next) {
        var $developer = res.locals.$developer;

        res.locals.$nav = {
            canColumn: permission.can($developer, 'column')
        };
    };

    return exports;
};
