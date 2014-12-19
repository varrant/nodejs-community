/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 15:19
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../../../widget/common/ajax.js');
    var alert = require('../../../widget/common/alert.js');
    var confirm = require('../../../widget/common/confirm.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var generator = require('../../../alien/ui/generator.js');
    var Editor = require('../../../alien/ui/Editor/');
    var dato = require('../../../alien/util/dato.js');
    var defaults = {
        url: '/admin/api/object/',
        id: ''
    };
    var Item = generator({
        constructor: function (formSelector, contentSelector, options, methods) {
            var the = this;

            the._formSelector = formSelector;
            the._contentSelector = contentSelector;
            the._methods = methods;
            the._options = dato.extend({}, defaults, options);
            the._init();
        },


        /**
         * 初始化
         * @returns {Item}
         * @private
         */
        _init: function () {
            var the = this;

            the._initData();

            return the;
        },


        /**
         * 初始化数据
         * @private
         */
        _initData: function () {
            var the = this;

            ajax({
                url: the._options.url + (the._options.id ? '?id=' + the._options.id : '')
            }).on('success', the._onsuccess.bind(the)).on('error', alert);
        },


        /**
         * 数据载入回调
         * @param json
         * @returns {*}
         * @private
         */
        _onsuccess: function (json) {
            var the = this;

            if (json.code !== 200) {
                return alert(json);
            }

            var data = json.data;

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
            the.vue = new Vue({
                el: the._formSelector,
                data: data,
                methods: dato.extend({
                    pushlabel: the._onpushlabel.bind(the),
                    removelabel: the._onremovelabel.bind(the),
                    save: the._onsave.bind(the)
                }, the._methods)
            });
            the.vue.$el.classList.remove('f-none');
            the.editor = new Editor(the._contentSelector, {
                id: data._id,
                // 更新的时候自动聚焦
                autoFocus: !!data._id
            }).on('change', function (val) {
                    the.vue.$data.object.content = val;
                });

            // 实时翻译
            the._translate();
        },


        /**
         * 添加标签
         * @private
         */
        _onpushlabel: function () {
            var vue = this.vue;
            var object = vue.$data.object;
            var label = object.label.toLowerCase().trim();

            // 最多 5 个 labels
            if (object.labels.indexOf(label) === -1 && object.labels.length < 5) {
                object.labels.push(label);
                object.label = '';
            }
        },


        /**
         * 移除标签
         * @param index
         * @private
         */
        _onremovelabel: function (index) {
            this.vue.$data.object.labels.splice(index, 1);
        },


        /**
         * 保存
         * @param eve
         * @param data
         * @private
         */
        _onsave: function (eve, data) {
            var the = this;
            var vue = the.vue;
            var $btn = selector.closest(eve.target, '.btn');

            $btn.disabled = true;
            var the = this;

            ajax({
                url: the._options.url,
                method: data._id ? 'put' : 'post',
                data: data
            }).on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                // 属于创建，清除之前的缓存记录，换成新的
                if (!the._options.id) {
                    the.editor.clearStore();
                    the._options.id = json.data._id;
                    the.editor.setOptions('id', the._options.id);
                }

                vue.$data.object = json.data;
                the.editor.resize();
            }).on('error', alert).on('finish', function () {
                $btn.disabled = false;
            });
        },


        /**
         * 实时翻译
         * @private
         */
        _translate: function () {
            var xhr = null;
            var the = this;

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
        }
    });

    module.exports = Item;
});