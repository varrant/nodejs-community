/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:41
 */

define(function (require) {
    'use strict';

    var Editor = require('../../alien/ui/Editor/');
    var Item = require('../../ui/admin/Item/');
    var item = new Item('#form', {
        url: '/admin/api/object/' + (window['-id-'] ? '?id=' + window['-id-'] : '')
    });
    var editor;

    // 渲染之前
    item.on('renderbefore', function (data) {
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
    item.on('renderafter', function (data) {
        var the = this;
        editor = new Editor('#content', {
            id: data._id,
            // 更新的时候自动聚焦
            autoFocus: !!data._id
        }).on('change', function (val) {
                the.vue.$data.object.content = val;
            });
    });

    // 保存之前

    // 保存之后
});