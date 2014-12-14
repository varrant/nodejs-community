/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 16:34
 */


define(function (require, exports, module) {
    'use strict';

    var Msg = require('../alien/ui/Msg/index.js');

    module.exports = function (content) {
        new Msg({
            content: typeof content === 'string' ? content : content.message,
            buttons: ['确定']
        });
    };
});