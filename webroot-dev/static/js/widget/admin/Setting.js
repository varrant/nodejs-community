/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 20:55
 */


define(function (require, exports, module) {
    'use strict';

    var generator = require('../../alien/ui/generator.js');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var dato = require('../../alien/util/dato.js');
    var defaults = {
        url: '',
        key: 'list',
        remove: '确认删除吗？',
        save: '确认保存吗？'
    };
    var Setting = generator({
        constructor: function (selector, options) {
            var the = this;

            the._selector = selector;
            the._options = dato.extend({}, defaults, options);
            the._init();
        },


        /**
         * 初始化
         * @private
         */
        _init: function () {
            var the = this;

            ajax({
                url: the._options.url
            }).on('success', the._onsuccess.bind(the)).on('error', alert);
        },

        /**
         * 请求成功
         * @param json
         * @returns {*}
         * @private
         */
        _onsuccess: function (json) {
            if (json.code !== 200) {
                return alert(json);
            }

            var the = this;
            var data = {};

            data[the._options.key] = json.data;
            the.vue = new Vue({
                el: the._selector,
                data: data,
                methods: {
                    onremove: the._onremove.bind(the),
                    oncreate: the._oncreate.bind(the),
                    onsave: the._onsave.bind(the)
                }
            });

            the.vue.$el.classList.remove('f-none');
        },


        /**
         * 删除
         * @param index
         * @private
         */
        _onremove: function (index) {
            var the = this;
            var remove = function () {
                the.vue.$data.list.splice(index, 1);
            };

            if (the._options.remove) {
                confirm(the._options.remove, function () {
                    the.vue.$data.list.splice(index, 1);
                });
            } else {
                remove();
            }
        },


        /**
         * 创建
         * @private
         */
        _oncreate: function () {
            this.vue.$data.list.push({
                name: '未定义',
                role: 20,
                desc: '未定义'
            });
        },


        /**
         * 保存
         * @param eve
         * @private
         */
        _onsave: function (eve) {
            var $btn = eve.target;
            var the = this;
            var options = the._options;
            var _save = function () {
                $btn.disabled = true;
                ajax({
                    url: options.url,
                    method: 'put',
                    data: the.vue.$data[options.key]
                }).on('success', function (json) {
                    $btn.disabled = false;

                    the.vue.$data[options.key] = json.data;
                    if (json.code !== 200) {
                        return alert(json);
                    }
                }).on('error', function (err) {
                    $btn.disabled = false;
                    alert(err);
                });
            };

            if (options.save) {
                confirm(options.save, _save);
            } else {
                _save();
            }
        }
    });

    module.exports = Setting;
});