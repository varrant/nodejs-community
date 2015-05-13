/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 20:13
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/sadmin/header.js');
    require('../../widget/sadmin/sidebar.js');

    var alert = require('../../alien/widgets/alert.js');
    var ajax = require('../../widget/common/ajax.js');
    var app = {};

    app.init = function () {
        ajax({
            url: '/admin/api/setting/'
        })
            .on('success', function (data) {
                app.vue = new Vue({
                    el: '#setting',
                    data: data,
                    methods: {
                        onsave: app._onsave
                    }
                });

                app.vue.$el.classList.remove('none');
            })
            .on('error', alert);
    };

    app._onsave = function (key) {
        var the = this;
        var data = the.$data[key];

        ajax({
            url: '/admin/api/setting/' + key + '/',
            method: 'put',
            body: data
        })
            .on('success', function (data) {
                the.$data[key] = data;
            })
            .on('error', alert);
    };

    app.init();
});