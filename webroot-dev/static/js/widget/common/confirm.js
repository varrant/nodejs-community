/*!
 * confirm
 * @author ydr.me
 * @create 2014-12-14 18:12
 */


define(function (require, exports, module) {
    'use strict';

    var Msg = require('../../alien/ui/Msg/index.js');

    module.exports = function (content, onsure) {
        return new Msg({
            title: '<i class="i i-question-circle i-small"></i>确认操作',
            content: content,
            buttons: ['确定', '取消'],
            addClass: 'm-dialog-confirm'
        }).on('close', function (index) {
                if (onsure && 0 === index) {
                    onsure();
                }
            });
    };
});