/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');
    require('../../widget/common/vue-filter.js');

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var url = '/admin/api/engineer/?id=' + window['-id-'];
    var app = {};

    app.init = function () {
        ajax({
            url: url
        }).on('success', app._onsuccess).on('error', alert);
    };

    app._onsuccess = function (json) {
        if (json.code !== 200) {
            return alert(json);
        }

        var data1 = json.data;
        var data2 = [];

        data2.push({
            name: '版块权限（0-10）',
            list: data1.types
        });

        data2.push({
            name: '操作权限（11-20）',
            list: data1.roles
        });

        var vue1 = new Vue({
            el: '#form',
            data: data1
        });
        var vue2 = new Vue({
            el: '#role',
            data: {
                kinds: data2
            }
        });

        vue1.$el.classList.remove('f-none');
        vue2.$el.classList.remove('f-none');
    };

    app.init();
});