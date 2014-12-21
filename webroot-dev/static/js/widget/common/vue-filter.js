/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-21 20:07
 */


define(function (require, exports, module) {
    'use strict';

    var date = require('../../alien/util/date.js');

    Vue.filter('datefrom', function (val) {
        return date.from(val);
    });

    Vue.filter('datetime', function (val) {
        return date.format('YYYY-MM-DD HH:mm:ss 星期e', val);
    });

    module.exports = {};
});