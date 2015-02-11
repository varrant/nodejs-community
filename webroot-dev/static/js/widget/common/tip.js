/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-02-11 22:02
 */


define(function (require, exports, module) {
    /**
     * @module parent/tip
     */
    'use strict';

    var Msg = require('../../alien/ui/Msg/index.js');

    /**
     * 消息提示
     * @param type {String} 消息类型
     * @param content {String} 消息内容
     * @returns {Msg}
     */
    var tip = function (type, content) {
        return new Msg({
            title: null,
            content: content,
            buttons: null,
            addClass: 'alien-msg-' + type,
            //timeout: 3456
        });
    };


    exports.success = function(content){
        tip('success', content);
    };

    exports.error = function(content){
        tip('error', content);
    };
});