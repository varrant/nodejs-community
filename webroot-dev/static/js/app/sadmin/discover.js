/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-07-24 21:46
 */


define(function (require, exports, module) {
    'use strict';

    var Vue = window.Vue;
    var data = {
        list: [],
        link: {
            category: '',
            text: '',
            url: '',
            index: 1
        },
        categories: [],
        type: 1
    };
    var ajax = require('../../modules/common/ajax.js');
    var app = {};

    app.init = function () {
        ajax({
            url: '/admin/api/category/',
            query: {
                type: 2
            }
        }).on('success', function (list) {
            data.categories = list.map(function (item) {
                return {
                    text: item.name,
                    value: item.id
                };
            });

            if (data.categories.length) {
                data.link.category = data.categories[0].value;
            }

            app.buildVue();
        });
    };

    app.onadd = function () {
        ajax({
            url: '/admin/api/link/',
            method: 'put',
            body: data.link
        }).on('success', function () {

        });
    };

    app.buildVue = function () {
        app.vue = new Vue({
            el: '#vue',
            data: data,
            methods: {
                onadd: app.onadd
            }
        });
    };

    app.init();
});