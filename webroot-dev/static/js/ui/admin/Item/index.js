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
    var dato = require('../../../alien/util/dato.js');
    var defaults = {
        url: ''
    };
    var Item = generator({
        constructor: function (formSelector, options, methods) {
            var the = this;

            the._formSelector = formSelector;
            the._methods = methods;
            the._options = dato.extend({}, defaults, options);
            the._init();
        },

        _init: function () {
            var the = this;

            the._initData();

            return the;
        },

        _initData: function () {
            var the = this;

            ajax({
                url: the._options.url
            }).on('success', the._onsuccess.bind(the)).on('error', alert);
        },

        _onsuccess: function (json) {
            var the = this;

            if (json.code !== 200) {
                return alert(json);
            }

            var data = json.data;

            the.emit('beforerender', data);
            the.vue = new Vue({
                el: the._formSelector,
                data: data,
                methods: the._methods
            });
            the.vue.$el.classList.remove('f-none');
            the.emit('afterrender', data);
        },

        /**
         * 保存
         * @public
         */
        save: function (data, callback) {
            var the = this;

            ajax({
                url: the._options.url,
                method: data._id ? 'put' : 'post',
                data: data
            }).on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }
            }).on('error', alert).on('finish', callback);
        }
    });

    module.exports = Item;
});