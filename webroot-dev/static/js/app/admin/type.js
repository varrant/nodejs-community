/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 16:09
 */


define(function (require) {
    'use strict';

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var url = '/admin/api/type/';
    var page = {};

    require('../../widget/admin/welcome.js');

    /**
     * 请求展示列表
     */
    page.list = function () {
        ajax({
            url: url
        }).on('success', page.onsuccess).on('error', alert);
    };

    /**
     * 请求成功
     * @param json
     * @returns {*}
     */
    page.onsuccess = function (json) {
        if (json.code !== 200) {
            return alert(json);
        }

        var vue = new Vue({
            el: '#list',
            data: {
                list: json.data
            },
            methods: {
                onup: page.onup,
                ondown: page.ondown,
                onremove: page.onremove,
                oncreate: page.oncreate,
                onsave: page.onsave
            }
        });

        vue.$el.classList.remove('f-none');
    };

    /**
     * 向上移动
     * @param item
     * @param index
     */
    page.onup = function (item, index) {
        this.$data.list.splice(index, 1);
        this.$data.list.splice(index - 1, 0, item);
    };


    /**
     * 向下移动
     * @param item
     * @param index
     */
    page.ondown = function (item, index) {
        this.$data.list.splice(index, 1);
        this.$data.list.splice(index + 1, 0, item);
    };


    /**
     * 删除
     * @param index
     */
    page.onremove = function (index) {
        var the = this;

        confirm('确认要删除该板块吗？', function () {
            the.$data.list.splice(index, 1);
        });
    };


    /**
     * 新建一个
     */
    page.oncreate = function () {
        this.$data.list.push({
            title: '未定义',
            uri: 'undefined',
            isDisplay: false,
            role: 0,
            desc: '未定义'
        });
    };


    /**
     * 保存
     * @param eve
     */
    page.onsave = function (eve) {
        var $btn = eve.target;
        var the = this;

        confirm('确认更新所有板块信息吗？', function () {
            $btn.disabled = true;
            ajax({
                url: url,
                method: 'put',
                data: the.$data.list
            }).on('success', function (json) {
                $btn.disabled = false;
                if (json.code !== 200) {
                    return alert(json);
                }
            }).on('error', function (err) {
                $btn.disabled = false;
                alert(err);
            });
        });
    };

    page.list();
});