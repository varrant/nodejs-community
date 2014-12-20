/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 16:06
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var Scrollbar = require('../../alien/ui/Scrollbar/');
    var app = {};

    app.init = function () {
        ajax({
            url: '/admin/api/nav/'
        }).on('success', app._onsuccess.bind(app)).on('error', alert);
    };

    app._onsuccess = function (json) {
        if(json.code !== 200){
            return alert(json);
        }

        var vue = new Vue({
            el: '#nav',
            data: {
                list: json.data
            }
        });

        vue.$el.classList.remove('f-none');
        new Scrollbar('#nav');
    };

    app.init();
});