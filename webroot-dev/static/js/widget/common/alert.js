/*!
 * alert
 * @author ydr.me
 * @create 2014-12-14 16:34
 */


define(function (require, exports, module) {
    'use strict';

    var alert = require('../../alien/widgets/alert.js');
    var login = require('./login.js');

    module.exports = function (content) {
        return alert(content).on('sure', function () {
                if(content && content.code === 401){
                    login();
                }
            });
    };
});