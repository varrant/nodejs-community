/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 23:06
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var selector = require('../../alien/core/dom/selector.js');
    var url = '/admin/api/scope/';
    var app = {};

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');

    /**
     * 请求展示列表
     */
    app.init = function () {
        ajax({
            url: url
        }).on('success', app.onsuccess).on('error', alert);
    };


    /**
     * 请求成功
     * @param json
     * @returns {*}
     */
    app.onsuccess = function (json) {
        if (json.code !== 200) {
            return alert(json);
        }

        var vue = new Vue({
            el: '#list',
            data: {
                list: json.data
            },
            methods: {
                onremove: app.onremove,
                oncreate: app.oncreate,
                onsave: app.onsave
            }
        });

        vue.$el.classList.remove('f-none');
    };


    /**
     * 删除
     * @param index
     */
    app.onremove = function (eve, index) {
        var $btn = selector.closest(eve.target, '.btn')[0];
        var the = this;
        var id = the.$data.list[index]._id;

        if(!id){
            return the.$data.list.splice(index, 1);
        }

        confirm('确认要删除该scope吗？<br>错误操作可能会导致路由出现404错误。', function () {
            $btn.disabled = true;
            ajax({
                url: url,
                method: 'delete',
                data: {_id: id}
            })
                .on('success', function (json) {
                    if (json.code === 200) {
                        the.$data.list.splice(index, 1);
                    } else {
                        alert(json);
                    }
                })
                .on('error', alert)
                .on('finish', function () {
                    $btn.disabled = false;
                });
        });
    };


    /**
     * 新建一个
     */
    app.oncreate = function () {
        this.$data.list.push({
            name: 'scopename',
            uri: 'scope-name',
            cover: 'alioss-cover',
            introduction: 'scope introduction'
        });
    };


    /**
     * 保存
     * @param eve
     */
    app.onsave = function (eve, index) {
        var $btn = selector.closest(eve.target, '.btn')[0];
        var the = this;

        $btn.disabled = true;
        ajax({
            url: url,
            method: 'put',
            data: the.$data.list[index]
        })
            .on('success', function (json) {
                if (json.code === 200) {
                    the.$data.list.$set(index, json.data);
                } else {
                    alert(json);
                }
            })
            .on('error', alert)
            .on('finish', function () {
                $btn.disabled = false;
            });
    };

    app.init();
});