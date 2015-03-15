/*!
 * alert
 * @author ydr.me
 * @create 2014-12-14 16:34
 */


define(function (require, exports, module) {
    'use strict';

    var Msg = require('../../alien/ui/Msg/index.js');
    var login = require('./login.js');

    module.exports = function (content) {
        return new Msg({
            content: content && content.message ? content.message : String(content),
            buttons: ['好'],
            addClass: 'm-dialog-alert'
        }).on('close', function (index) {
                if(index === 0 && content && content.code === 401){
                    login();
                }
            });
    };
});