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
    var Editor = require('../../alien/ui/Editor/index.js');
    var objectId = window['-id-'];
    var objectURL = '/admin/api/object/?id=' + objectId;
    var translateURL = '/api/translate/?word=';
    var page = {};
    var editor = null;

    require('../../widget/admin/welcome.js');

    page.translate = function (vue) {
        var xhr = null;

        vue.$watch('object.title', function (word) {
            if (xhr) {
                xhr.abort();
            }

            xhr = ajax({
                url: translateURL + encodeURIComponent(word)
            }).on('success', function (json) {
                if (json.code === 200) {
                    vue.$data.object.uri = json.data;
                }
            }).on('complete', function () {
                xhr = null;
            });
        });
    };

    /**
     * 请求展示列表
     */
    page.item = function () {
        ajax({
            url: objectURL
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
            uri: '',
            labels: [],
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
                onpushlabel: page.onpushlabel,
                onremovelabel: page.onremovelabel,
                onsave: page.onsave
            }
        });

        vue.$el.classList.remove('f-none');
        editor = new Editor('#content', {
            id: objectId
        }).on('change', function (val) {
                vue.$data.object.content = val;
            });

        page.translate(vue);
    };

    /**
     * 添加 label
     */
    page.onpushlabel = function () {
        var object = this.$data.object;
        var label = object.label.toLowerCase().trim();

        // 最多 5 个 labels
        if (object.labels.indexOf(label) === -1 && object.labels.length < 5) {
            object.labels.push(label);
            object.label = '';
        }
    };


    /**
     * 移除 label
     * @param index
     */
    page.onremovelabel = function (index) {
        this.$data.object.labels.splice(index, 1);
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
            url: objectURL,
            method: objectId ? 'put' : 'post',
            data: data
        }).on('success', function (json) {
            if (json.code !== 200) {
                return alert(json);
            }

            // 属于创建，清除之前的缓存记录，换成新的
            if (!objectId) {
                editor.clearStore();
                objectId = json.data._id;
                editor.setOptions('id', objectId);
            }

            the.$data.object = json.data;
        }).on('error', alert).on('finish', function () {
            $btn.disabled = false;
        });
    };

    page.item();
});