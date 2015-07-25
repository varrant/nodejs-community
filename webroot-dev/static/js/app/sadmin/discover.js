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
            id: '',
            category: '',
            text: '',
            url: '',
            index: 1
        },
        categories: [],
        verified: '1',
        edit: false
    };
    var ajax = require('../../modules/common/ajax.js');
    var confirm = require('../../alien/widgets/confirm.js');
    var app = {};
    var ajaxURL = '/admin/api/link/';

    // 初始化
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

            app.buildVue();

            if (data.categories.length) {
                data.link.category = data.categories[0].value;
                app.getList(data.link.category);
            }
        });
    };


    // 获取列表
    app.getList = function (category) {
        ajax({
            url: ajaxURL,
            query: {
                category: category,
                verified: data.verified
            }
        }).on('success', function (list) {
            data.list = list;
        });
    };


    // 添加
    app.onsubmit = function () {
        ajax({
            url: ajaxURL,
            method: 'put',
            body: data.link
        }).on('success', function (json) {
            data.list.push(json);
        });
    };


    // 取消编辑
    app.onreset = function () {
        data.edit = false;
        data.link.id = '';
        data.link.category = data.categories[0] ? data.categories[0].value : '';
        data.link.text = '';
        data.link.url = '';
        data.link.index = '1';
    };


    // 编辑
    app.onedit = function (item) {
        data.edit = true;
        data.link.id = item.id;
        data.link.category = item.category;
        data.link.text = item.text;
        data.link.url = item.url;
        data.link.index = item.index;
    };


    // 删除
    app.onremove = function (item, index) {
        confirm('确认需要删除该链接吗').on('sure', function () {
            ajax({
                url: ajaxURL,
                method: 'delete',
                body: {
                    id: item.id
                }
            }).on('success', function () {
                data.list.splice(index, 1);
            });
        });
    };


    // mvvm
    app.buildVue = function () {
        app.vue = new Vue({
            el: '#vue',
            data: data,
            methods: {
                onsubmit: app.onsubmit,
                onreset: app.onreset,
                onedit: app.onedit,
                onremove: app.onremove
            }
        });

        app.vue.$watch('verified', function (neo) {
            app.getList();
        });

        app.vue.$watch('link.category', function (neo) {
            app.getList(neo);
        });
    };

    app.init();
});