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
    var id = window['-id-'];
    var editor;
    var methods = {};

    // 添加 label
    methods.pushlabel = function () {

    };

    // 移除 label
    methods.removelabel = function (index) {

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
    });
});