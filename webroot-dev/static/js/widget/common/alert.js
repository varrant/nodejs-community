/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 16:34
 */


define(function (require, exports, module) {
    'use strict';

    var Msg = require('../../alien/ui/Msg/index.js');
    var login = require('./login.js');

    module.exports = function (content) {
        return new Msg({
            content: typeof content === 'string' ? content : content.message,
            buttons: ['确定']
        }).on('close', function () {
                if(content && content.code === 401){
                    login();
                }
            });
    };
});