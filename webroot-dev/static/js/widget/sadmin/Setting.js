/*!
 * 设置版块、分类、栏目
 * @author ydr.me
 * @create 2014-12-20 20:55
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../alien/ui/');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var selector = require('../../alien/core/dom/selector.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var event = require('../../alien/core/event/base.js');
    var id = hashbang.get('query', 'id');
    var dato = require('../../alien/utils/dato.js');
    var Upload = require('../common/Upload/');
    var defaults = {
        emptyData: {
            name: '',
            uri: '',
            cover: '',
            introduction: ''
        },
        url: '',
        itemKey: '',
        listKey: '',
        type: ''
    };
    var Setting = ui.create(function (selector, options) {
        var the = this;

        the._selector = selector;
        the._options = dato.extend(true, {}, defaults, options);
        the._init();
    });

    Setting.fn._init = function () {
        var the = this;

        the._initData();
        the._upload = new Upload();
    };


    Setting.fn._initData = function () {
        var the = this;
        var options = the._options;
        var itemKey = options.itemKey;
        var listKey = options.listKey;

        ajax({
            url: options.url
        })
            .on('success', function (data) {

                var emptyData = dato.extend({}, options.emptyData);

                if (id) {
                    dato.each(data, function (i, item) {
                        if (item.id === id) {
                            emptyData = item;
                            return false;
                        }
                    });
                }

                var vueData = {};

                vueData[listKey] = data;
                vueData[itemKey] = emptyData;

                the.vue = new Vue({
                    el: the._selector,
                    data: vueData,
                    methods: {
                        onupload: the._onupload.bind(the),
                        onreset: the._onreset.bind(the),
                        onsave: the._onsave.bind(the),
                        onchoose: the._onchoose.bind(the),
                        onremove: the._onremove.bind(the)
                    }
                });

                the.vue.$el.classList.remove('none');
                the._translate();
            })
            .on('error', alert);
    };


    /**
     * 上传并裁剪图片
     * @private
     */
    Setting.fn._onupload = function () {
        var the = this;
        var itemKey = the._options.itemKey;

        the._upload.open().on('success', function (data) {
            the.vue.$data[itemKey].cover = data.surl;
            this.close();
        });
    };


    /**
     * 表单重置
     * @private
     */
    Setting.fn._onreset = function () {
        var the = this;
        var options = the._options;
        var itemKey = options.itemKey;

        the.vue.$data[itemKey] = dato.extend({}, options.emptyData);
    };


    /**
     * 新增/保存
     * @private
     */
    Setting.fn._onsave = function () {
        var the = this;
        var options = the._options;
        var vue = this.vue;
        var itemKey = options.itemKey;
        var listKey = options.listKey;
        var data = vue.$data[itemKey];
        var hasId = !!data.id;

        ajax({
            method: 'put',
            url: options.url,
            body: vue.$data[itemKey]
        })
            .on('success', function (data) {
                if (!hasId) {
                    vue.$data[listKey].push(data);
                }

                vue.$data[itemKey] = data;
            })
            .on('error', alert);
    };


    /**
     * 选择
     * @param index
     * @private
     */
    Setting.fn._onchoose = function (index) {
        var vue = this.vue;
        var itemKey = this._options.itemKey;
        var listKey = this._options.listKey;

        vue.$data[itemKey] = vue.$data[listKey][index];
    };


    /**
     * 删除
     * @param index
     * @returns {*}
     * @private
     */
    Setting.fn._onremove = function (index) {
        var the = this;
        var options = the._options;
        var listKey = options.listKey;
        var type = options.type;
        var vue = the.vue;
        var col = vue.$data[listKey][index];
        var id = col.id;

        if (col.objectCount > 0) {
            return alert('该' + type + '下还有' + col.objectCount + '个项目，无法删除');
        }

        var remove = function () {
            ajax({
                url: options.url,
                method: 'delete',
                body: {
                    id: id
                }
            })
                .on('success', function () {
                    vue.$data[listKey].splice(index, 1);
                })
                .on('error', alert);
        };

        confirm('确认要删除该' + type + '吗？').on('sure', remove);
    };


    /**
     * 实时翻译
     * @private
     */
    Setting.fn._translate = function () {
        var xhr = null;
        var itemKey = this._options.itemKey;
        var vue = this.vue;
        var $translate = selector.query('#translate')[0];

        event.on($translate, 'keyup', function () {
            if (xhr) {
                xhr.abort();
            }

            xhr = ajax({
                url: '/api/translate/?word=' + encodeURIComponent(this.value)
            })
                .on('success', function (data) {
                    vue.$data[itemKey].uri = data;
                })
                .on('complete', function () {
                    xhr = null;
                });
        });

        // 实时翻译
        //vue.$watch(itemKey + '.name', function (word) {
        //    if (xhr) {
        //        xhr.abort();
        //    }
        //
        //    xhr = ajax({
        //        url: '/api/translate/?word=' + encodeURIComponent(word)
        //    })
        //        .on('success', function (data) {
        //            vue.$data[itemKey].uri = data;
        //        })
        //        .on('complete', function () {
        //            xhr = null;
        //        });
        //});
    };

    module.exports = Setting;
});