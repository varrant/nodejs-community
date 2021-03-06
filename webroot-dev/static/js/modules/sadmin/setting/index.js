/*!
 * 设置版块、分类、栏目
 * @author ydr.me
 * @create 2014-12-20 20:55
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../../alien/ui/index.js');
    var ajax = require('../../common/ajax.js');
    var alert = require('../../../alien/widgets/alert.js');
    var confirm = require('../../../alien/widgets/confirm.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var hashbang = require('../../../alien/core/navigator/hashbang.js');
    var event = require('../../../alien/core/event/base.js');
    var id = hashbang.get('query', 'id');
    var dato = require('../../../alien/utils/dato.js');
    var Upload = require('../../../alien/ui/img-Upload/index.js');
    var defaults = {
        emptyData: {
            name: '',
            uri: '',
            cover: '',
            background: '',
            introduction: ''
        },
        uploadOptions: {
            isClip: true,
            minWidth: 200,
            minHeight: 200,
            ratio: 1,
            ajax: {
                url: 'http://up.qiniu.com/',
                method: 'post',
                fileKey: 'file'
            }
        },
        url: '',
        query: null,
        itemKey: '',
        listKey: '',
        type: '',
        data: null
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
            var options = the._options;

            the._initData();
            the._upload = new Upload(options.uploadOptions);
            the._upload.on('success', function (json) {
                if (!json.key) {
                    alert('上传失败');
                    return false;
                }

                the.vue.$data[the._options.itemKey][the._imgKey] = the._url;
            }).on('upload', function () {
                ajax({
                    url: '/admin/api/qiniu/'
                }).on('success', function (data) {
                    the._url = data.url;
                    the._upload.setOptions({
                        ajax: {
                            body: {
                                key: data.key,
                                token: data.token
                            }
                        }
                    });
                    the._upload.upload();
                }).on('error', function () {
                    the.uploadDestroy();
                    alert('上传凭证获取失败');
                });

                return false;
            }).on('error', alert);
        },


        _initData: function () {
            var the = this;
            var options = the._options;
            var itemKey = options.itemKey;
            var listKey = options.listKey;

            ajax({
                url: options.url,
                query: options.query
            })
                .on('success', function (data) {
                    var vueData = {};
                    var itemData = dato.extend({}, options.emptyData);

                    if (id) {
                        dato.each(data, function (i, item) {
                            if (item.id === id) {
                                dato.extend(itemData, item);
                                return false;
                            }
                        });
                    }


                    vueData[listKey] = data;
                    vueData[itemKey] = itemData;
                    dato.extend(vueData, options.data);

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
        },


        /**
         * 上传并裁剪图片
         * @param isClip
         * @param key
         * @private
         */
        _onupload: function (isClip, key) {
            var the = this;

            the._upload.setOptions('isClip', isClip).open();
            the._imgKey = key || 'cover';
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
                body: vue.$data[itemKey]
            })
                .on('success', function (data) {
                    if (!hasId) {
                        vue.$data[listKey].push(data);
                    }

                    vue.$data[itemKey] = data;
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

            event.on($translate, 'input', function () {
                if (xhr) {
                    xhr.abort();
                }

                xhr = ajax({
                    url: '/api/translate/?word=' + encodeURIComponent(this.value),
                    loading: null
                })
                    .on('success', function (data) {
                        vue.$data[itemKey].uri = data;
                    })
                    .on('complete', function () {
                        xhr = null;
                    }).xhr;
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
        }
    });

    Setting.defaults = defaults;
    module.exports = Setting;
});