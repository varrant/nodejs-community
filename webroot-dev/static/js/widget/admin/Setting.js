/*!
 * 设置版块、分类、栏目
 * @author ydr.me
 * @create 2014-12-20 20:55
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../alien/ui/base.js');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var selector = require('../../alien/core/dom/selector.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var event = require('../../alien/core/event/base.js');
    var id = hashbang.get('query', 'id');
    var dato = require('../../alien/util/dato.js');
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
    var Setting = ui.create({
        constructor: function (selector, options) {
            var the = this;

            the._selector = selector;
            the._options = dato.extend(true, {}, defaults, options);
            the._init();
        },
        _init: function () {
            var the = this;

            the._initData();
            the._upload = new Upload();
        },
        _initData: function () {
            var the = this;
            var options = the._options;
            var itemKey = options.itemKey;
            var listKey = options.listKey;

            ajax({
                url: options.url
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    var data = dato.extend({}, options.emptyData);

                    if (id) {
                        dato.each(json.data, function (i, item) {
                            if (item.id === id) {
                                data = item;
                                return false;
                            }
                        });
                    }

                    var vueData = {};

                    vueData[listKey] = json.data;
                    vueData[itemKey] = data;

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

                    the.vue.$el.classList.remove('f-none');
                    the._translate();
                })
                .on('error', alert);
        },


        /**
         * 上传并裁剪图片
         * @private
         */
        _onupload: function () {
            var the = this;
            var itemKey = the._options.itemKey;

            the._upload.open().on('success', function (data) {
                the.vue.$data[itemKey].cover = data.surl;
                this.close();
            });
        },


        /**
         * 表单重置
         * @private
         */
        _onreset: function () {
            var the = this;
            var options = the._options;
            var itemKey = options.itemKey;

            the.vue.$data[itemKey] = dato.extend({}, options.emptyData);
        },


        /**
         * 新增/保存
         * @private
         */
        _onsave: function () {
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
                data: vue.$data[itemKey]
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    if (!hasId) {
                        vue.$data[listKey].push(json.data);
                    }

                    vue.$data[itemKey] = json.data;
                })
                .on('error', alert);
        },


        /**
         * 选择
         * @param index
         * @private
         */
        _onchoose: function (index) {
            var vue = this.vue;
            var itemKey = this._options.itemKey;
            var listKey = this._options.listKey;

            vue.$data[itemKey] = vue.$data[listKey][index];
        },


        /**
         * 删除
         * @param index
         * @returns {*}
         * @private
         */
        _onremove: function (index) {
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
                    data: {
                        id: id
                    }
                })
                    .on('success', function (json) {
                        if (json.code !== 200) {
                            return alert(json);
                        }

                        vue.$data[listKey].splice(index, 1);
                    })
                    .on('error', alert);
            };

            confirm('确认要删除该' + type + '吗？', remove);
        },


        /**
         * 实时翻译
         * @private
         */
        _translate: function () {
            var xhr = null;
            var itemKey = this._options.itemKey;
            var vue = this.vue;
            var $translate = selector.query('#translate')[0];

            event.on($translate, 'keyup', function(){
                if (xhr) {
                    xhr.abort();
                }

                xhr = ajax({
                    url: '/api/translate/?word=' + encodeURIComponent(this.value)
                })
                    .on('success', function (json) {
                        if (json.code === 200) {
                            vue.$data[itemKey].uri = json.data;
                        }
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
            //        .on('success', function (json) {
            //            if (json.code === 200) {
            //                vue.$data[itemKey].uri = json.data;
            //            }
            //        })
            //        .on('complete', function () {
            //            xhr = null;
            //        });
            //});
        }
    });

    module.exports = Setting;
});