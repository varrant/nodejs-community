/*!
 * template filter
 * @author ydr.me
 * @create 2014-12-26 18:52
 */


define(function (require, exports, module) {
    'use strict';

    var date = require('../../alien/utils/date.js');
    var Template = require('../../alien/libs/template.js');

    Template.addFilter('datefrom', function (val) {
        return date.from(val);
    });

    Template.addFilter('datetime', function (val) {
        return date.format('YYYY-MM-DD HH:mm:ss 星期e', val);
    });
});