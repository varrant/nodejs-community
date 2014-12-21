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
    var confirm = require('../../widget/common/confirm.js');
    var url = '/admin/api/notification/';
    var app = {};

    app.init = function (type) {
        ajax({
            url: url + '?type=' + type
        }).on('success', app._onsuccess).on('error', alert);
    };

    app._onsuccess = function (json) {
        if (json.code !== 200) {
            return alert(json);
        }

        if (app.vue) {
            app.vue.$data.list = json.data;
        } else {
            app.vue = new Vue({
                el: '#list',
                data: {
                    list: json.data,
                    status: 'unactive'
                },
                methods: {
                    onchange: app._onchange
                }
            });

            app.vue.$el.classList.remove('f-none');
        }
    };

    app._onchange = function () {
        app.init(this.$data.status);
    };

    app.init('unactive');
});