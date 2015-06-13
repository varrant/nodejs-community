/*!
 * 列表项目
 * @author ydr.me
 * @create 2014-12-19 15:19
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../../alien/widgets/alert.js');
    var confirm = require('../../alien/widgets/confirm.js');
    var prompt = require('../common/prompt.js');
    var tip = require('../common/tip.js');
    var Loading = require('../../alien/ui/Loading/');
    var selector = require('../../alien/core/dom/selector.js');
    var ui = require('../../alien/ui/');
    var Editor = require('../../alien/ui/Editor/');
    var dato = require('../../alien/utils/dato.js');
    var controller = require('../../alien/utils/controller.js');
    var date = require('../../alien/utils/date.js');
    var qs = require('../../alien/utils/querystring.js');
    var xhr = require('../../alien/core/communication/xhr.js');
    var defaults = {
        url: '/admin/api/object/?',
        id: '',
        section: '',
        hiddenSelector: '#hidden'
    };
    var Item = ui.create({
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
            var options = the._options;

            ajax({
                url: the._options.url + qs.stringify({
                    id: options.id,
                    section: options.section
                })
            }).on('success', the._onsuccess.bind(the)).on('error', alert);
        },


        /**
         * 数据载入回调
         * @param data
         * @returns {*}
         * @private
         */
        _onsuccess: function (data) {
            var the = this;

            the.emit('success', data);

            data.object = data.object || {
                    content: '',
                    uri: '',
                    labels: [],
                    section: the._options.section,
                    isDisplay: true
                };
            data.addHidden = data.object.hidden ? true : false;
            data.categories.forEach(function (item) {
                item.text = item.name;
                item.value = item.id;

                if (item.uri === 'default' && !data.object.category) {
                    data.object.category = item.id;
                }
            });
            data.columns.forEach(function (item) {
                item.text = item.name;
                item.value = item.id;
            });
            data.columns.push({
                text: '=不分配专辑=',
                value: ''
            });
            the.vue = new Vue({
                el: the._formSelector,
                data: the._data = data,
                methods: dato.extend({
                    pushlabel: the._onpushlabel.bind(the),
                    removelabel: the._onremovelabel.bind(the),
                    save: the._onsave.bind(the),
                    oncreatecolumn: the._oncreatecolumn.bind(the),
                    ontogglehidden: the._ontogglehidden.bind(the)
                }, the._methods)
            });
            the.vue.$el.classList.remove('none');
            the._$objectColumn = selector.query('#objectColumn')[0];

            the.editorUploadCallback = function (list, onprogress, ondone) {
                var the = this;
                var ret = {};

                ajax({
                    url: '/admin/api/qiniu/'
                }).on('success', function (data) {
                    ret.url = data.url;

                    var fd = new FormData();

                    fd.append('key', data.key);
                    fd.append('token', data.token);
                    fd.append('file', list[0].file);

                    xhr.ajax({
                        url: 'http://up.qiniu.com/',
                        method: 'post',
                        body: fd
                    }).on('progress', function (eve) {
                        onprogress(eve.alienDetail.percent);
                    }).on('success', function (json) {
                        if (!json.key) {
                            the.uploadDestroy();
                            return alert('上传失败');
                        }

                        var img = new Image();

                        img.src = ret.url;
                        img.onload = img.onerror = function () {
                            ondone(null, [{
                                name: "",
                                url: ret.url,
                                width: this.width,
                                height: this.height
                            }]);
                        };
                    }).on('error', function () {
                        var json = {
                            message: '未知错误'
                        };

                        try {
                            json = JSON.parse(this.xhr.responseText);
                            json.message = json.error;
                        } catch (err) {
                            // ignore
                        }

                        the.uploadDestroy();
                        alert(json);
                    });
                }).on('error', function () {
                    the.uploadDestroy();
                    alert('上传凭证获取失败');
                });
            };

            the._editor1 = new Editor(the._contentSelector, {
                id: data.object.id + '-object',
                previewClass: 'typo',
                uploadCallback: the.editorUploadCallback,
                minHeight: 200
            }).on('change', function (val) {
                    data.object.content = val;
                });

            // 实时翻译
            the._watchAddHidden();
            the._watchTranslate();
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
            if (label && object.labels.indexOf(label) === -1 && object.labels.length < 5) {
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
            var $btn = selector.closest(eve.target, '.btn')[0];

            $btn.disabled = true;
            $btn.innerHTML = '保存中……';

            ajax({
                url: the._options.url,
                method: data.id ? 'put' : 'post',
                body: data,
                loading: '保存中'
            }).on('success', function (data) {
                // 属于创建，清除之前的缓存记录，换成新的
                if (!the._options.id) {
                    the._editor1.clearStore();
                    the._options.id = data.id;
                    the._editor1.setOptions('id', the._options.id);
                    history.pushState('', null, location.pathname + '?id=' + data.id);
                }

                vue.$data.object = data;
                tip.success('保存成功');
                the._editor1.setValue(data.content);

                if (the._editor2) {
                    the._editor2.setValue(data.hidden);
                }
            }).on('error', alert).on('finish', function () {
                $btn.disabled = false;
                $btn.innerHTML = '保存';
            });
        },


        /**
         * 快速创建专辑
         * @private
         */
        _oncreatecolumn: function () {
            var the = this;

            prompt('请输入专辑名称').on('sure', function (name) {
                var pm = this;

                name = name.trim();

                if (!name) {
                    return alert('专辑名称不能为空');
                }

                var ld = new Loading(window, '正在翻译');

                the._translate(name, function (err, uri) {
                    ld.done();

                    if (err) {
                        return alert(err);
                    }

                    ajax({
                        url: '/admin/api/column/',
                        method: 'put',
                        loading: '保存中',
                        body: {
                            name: name,
                            uri: uri,
                            cover: window['-default.column-'],
                            introduction: '专辑《' + name + '》创建于 ' + date.format('YYYY年M月D日 HH:mm:ss') + '。'
                        }
                    }).on('success', function (data) {
                        the._data.columns.push({
                            text: data.name,
                            value: data.id
                        });
                        the._data.object.column = data.id;
                        setTimeout(function () {
                            the._$objectColumn.value = data.id;
                            pm.close();
                        }, 100);
                    }).on('error', alert);
                });
            });
        },


        /**
         * 切换隐藏内容
         * @private
         */
        _ontogglehidden: function () {
            var data = this.vue.$data;

            data.addHidden = !data.addHidden;
        },


        /**
         * 监听是否显示隐藏内容
         * @private
         */
        _watchAddHidden: function () {
            var the = this;
            var data = the._data;
            var toggle = function (boolean) {
                //if(boolean && the._editor2){
                //    the.editor2.focus();
                //}

                if (!boolean || the._editor2) {
                    return;
                }

                var $hidden = selector.query(the._options.hiddenSelector)[0];

                if ($hidden) {
                    the._editor2 = new Editor($hidden, {
                        id: data.object.id + '-hidden',
                        uploadCallback: the.editorUploadCallback
                    }).on('change', function (val) {
                            data.object.hidden = val;
                        });
                }
            };

            if (data.addHidden) {
                toggle(true);
            }

            the.vue.$watch('addHidden', toggle);
        },


        /**
         * 实时翻译
         * @private
         */
        _watchTranslate: function () {
            var xhr = null;
            var the = this;

            // 实时翻译
            if(!the._data.object.id){
                the.vue.$watch('object.title', controller.debounce(function (word) {
                    if (xhr) {
                        xhr.abort();
                    }

                    xhr = the._translate(word, function (err, word2) {
                        if (err) {
                            return;
                        }

                        the._data.object.uri = word2;
                    });
                }));
            }
        },


        /**
         * 翻译
         * @param word
         * @param callback
         * @returns {*}
         * @private
         */
        _translate: function (word, callback) {
            var xhr = ajax({
                loading: false,
                url: '/api/translate/?word=' + encodeURIComponent(word)
            }).on('complete', function (err, data) {
                callback(err, data);
                xhr = null;
            }).xhr;

            return xhr;
        }
    });

    Item.defaults = defaults;
    module.exports = Item;
});