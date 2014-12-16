/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:41
 */


define(function (require, exports, module) {
    'use strict';
    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var selector = require('../../alien/core/dom/selector.js');
    var objectId = window['-id-'];
    var url = '/admin/api/object/?id=' + objectId;
    var page = {};

    require('../../widget/admin/welcome.js');

    /**
     * 请求展示列表
     */
    page.item = function () {
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

        var data = json.data;
        data.object = data.object || {
            content: '',
            type: window['-type-']
        };
        data.scopes.forEach(function (item) {
            item.text = item.name;
            item.value = item._id;

            if (item.uri === 'default' && !data.object.scope) {
                data.object.scope = item._id;
            }
        });

        var vue = new Vue({
            el: '#form',
            data: data,
            methods: {
                onsave: page.onsave
            }
        });

        vue.$el.classList.remove('f-none');
    };


    /**
     * 保存
     * @param eve
     * @param data
     */
    page.onsave = function (eve, data) {
        var the = this;
        var $btn = selector.closest(eve.target, '.btn');

        $btn.disabled = true;
        ajax({
            url: url,
            method: objectId ? 'put' : 'post',
            data: data
        }).on('success', function (json) {
            if (json.code !== 200) {
                return alert(json);
            }

            objectId = json.data._id;
            the.$data.object = json.data;
        }).on('error', alert).on('finish', function () {
            $btn.disabled = false;
        });
    };

    page.item();
});