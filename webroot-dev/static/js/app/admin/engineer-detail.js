/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var url = '/api/engineer/?id=' + window['-id-'];
    var app = {};

    app.init = function () {
        ajax({
            url: url
        }).on('success', app._onsuccess).on('error', alert);
    };

    app._onsuccess = function (json) {
        if(json.code !== 200){
            return alert(json);
        }

        //new Vue({
        //    el: '#form',
        //    data: {
        //        engineer: json.data
        //    }
        //});
    };

    app.init();
});