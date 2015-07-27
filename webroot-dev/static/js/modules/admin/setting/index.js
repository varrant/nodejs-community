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
    var tip = require('../../common/tip.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var hashbang = require('../../../alien/core/navigator/hashbang.js');
    var event = require('../../../alien/core/event/base.js');
    var id = hashbang.get('query', 'id');
    var dato = require('../../../alien/utils/dato.js');
    var Upload = require('../../../alien/ui/img-upload/index.js');
    var defaults = {
        emptyData: {
            name: '',
            uri: '',
            background: '',
            cover: '',
            introduction: '',
            label: '',
            labels: []
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
                    the.close();
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
                            pushlabel: the._onpushlabel.bind(the),
                            removelabel: the._onremovelabel.bind(the),
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
                body: data,
                loading: '设置中'
            })
                .on('success', function (data) {
                    if (!hasId) {
                        vue.$data[listKey].push(data);
                    }

                    vue.$data[itemKey] = data;
                    tip.success('保存成功');
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
         * 添加标签
         * @private
         */
        _onpushlabel: function () {
            var vue = this.vue;
            var itemKey = this._options.itemKey;
            var label = vue.$data[itemKey].label.trim();

            // 最多 5 个 labels
            if (label && vue.$data[itemKey].labels.indexOf(label) === -1 && vue.$data[itemKey].labels.length < 5) {
                vue.$data[itemKey].labels.push(label);
                vue.$data[itemKey].label = '';
            }
        },


        /**
         * 移除标签
         * @param index
         * @private
         */
        _onremovelabel: function (index) {
            this.vue.$data[this._options.itemKey].labels.splice(index, 1);
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
                    },
                    loading: '删除中'
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
            var _ajax = null;
            var itemKey = this._options.itemKey;
            var vue = this.vue;
            var $translate = selector.query('#translate')[0];

            event.on($translate, 'keyup', function () {
                if (_ajax && _ajax.xhr) {
                    _ajax.xhr.abort();
                }

                _ajax = ajax({
                    loading: false,
                    url: '/api/translate/?word=' + encodeURIComponent(this.value)
                })
                    .on('success', function (data) {
                        vue.$data[itemKey].uri = data;
                    })
                    .on('complete', function () {
                        _ajax = null;
                    });
            });
        }
    });

    Setting.defaults = defaults;
    module.exports = Setting;
});