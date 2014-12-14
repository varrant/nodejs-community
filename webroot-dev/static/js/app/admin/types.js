/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 16:09
 */


define(function (require) {
    'use strict';

    var ajax = require('../../libs/ajax.js');
    var alert = require('../../libs/alert.js');
    var confirm = require('../../libs/confirm.js');
    var url = '/api/type/';
    var page = {};

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
            el: '#types',
            data: {
                types: json.data
            },
            methods: {
                onsave: page.onsave
            }
        });

        vue.$el.classList.remove('f-none');
    };


    /**
     * 保存
     * @param eve
     */
    page.onsave = function (eve) {
        var $btn = eve.target;
        var the = this;

        confirm('确定更新吗？', function () {
            $btn.disabled = true;
            ajax({
                url: url,
                method: 'put',
                data: the.$data
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