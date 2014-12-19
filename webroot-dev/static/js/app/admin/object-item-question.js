/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:41
 */

define(function (require) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var Editor = require('../../alien/ui/Editor/');
    var Item = require('../../ui/admin/Item/');
    var ajax = require('../../widget/common/ajax.js');
    var id = window['-id-'];
    var editor;
    var methods = {};

    // 添加 label
    methods.pushlabel = function () {
        var object = this.$data.object;
        var label = object.label.toLowerCase().trim();

        // 最多 5 个 labels
        if (object.labels.indexOf(label) === -1 && object.labels.length < 5) {
            object.labels.push(label);
            object.label = '';
        }
    };

    // 移除 label
    methods.removelabel = function (index) {
        this.$data.object.labels.splice(index, 1);
    };

    // 保存
    methods.save = function (eve, data) {
        var the = this;
        var $btn = selector.closest(eve.target, '.btn');

        $btn.disabled = true;
        item.save(data, function (err, json) {
            // 属于创建，清除之前的缓存记录，换成新的
            if (!id) {
                editor.clearStore();
                id = json.data._id;
                editor.setOptions('id', id);
            }

            the.$data.object = json.data;
            editor.resize();
            $btn.disabled = false;
        });
    };

    var item = new Item('#form', {
        url: '/admin/api/object/' + (id ? '?id=' + id : '')
    }, methods);

    // 渲染之前
    item.on('beforerender', function (data) {
        data.object = data.object || {
            content: '',
            uri: '',
            labels: [],
            type: window['-type-'],
            isDisplay: true
        };
        data.scopes.forEach(function (item) {
            item.text = item.name;
            item.value = item._id;

            if (item.uri === 'default' && !data.object.scope) {
                data.object.scope = item._id;
            }
        });
    });

    // 渲染之后
    item.on('afterrender', function (data) {
        var the = this;

        editor = new Editor('#content', {
            id: data._id,
            // 更新的时候自动聚焦
            autoFocus: !!data._id
        }).on('change', function (val) {
                the.vue.$data.object.content = val;
            });

        var xhr = null;

        // 实时翻译
        the.vue.$watch('object.title', function (word) {
            if (xhr) {
                xhr.abort();
            }

            xhr = ajax({
                url: '/api/translate/?word=' + encodeURIComponent(word)
            }).on('success', function (json) {
                if (json.code === 200) {
                    the.vue.$data.object.uri = json.data;
                }
            }).on('complete', function () {
                xhr = null;
            });
        });
    });
});