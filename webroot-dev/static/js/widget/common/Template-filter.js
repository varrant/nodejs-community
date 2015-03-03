/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 18:52
 */


define(function (require, exports, module) {
    var date = require('../../alien/utils/date.js');
    var Template = require('../../alien/libs/Template.js');

    Template.addFilter('datefrom', function (val) {
        return date.from(val);
    });

    Template.addFilter('datetime', function (val) {
        return date.format('YYYY-MM-DD HH:mm:ss 星期e', val);
    });
});