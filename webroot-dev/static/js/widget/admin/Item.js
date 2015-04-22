/*!
 * 列表项目
 * @author ydr.me
 * @create 2014-12-19 15:19
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var prompt = require('../common/prompt.js');
    var tip = require('../common/tip.js');
    var loading = require('../common/loading.js');
    var selector = require('../../alien/core/dom/selector.js');
    var ui = require('../../alien/ui/');
    var Editor = require('../../alien/ui/Editor/');
    var dato = require('../../alien/utils/dato.js');
    var controller = require('../../alien/utils/controller.js');
    var date = require('../../alien/utils/date.js');
    var defaults = {
        url: '/admin/api/object/',
        id: '',
        section: '',
        hiddenSelector: '#hidden'
    };
    var Item = ui.create(function (formSelector, contentSelector, options, methods) {
        var the = this;

        the._formSelector = formSelector;
        the._contentSelector = contentSelector;
        the._methods = methods;
        the._options = dato.extend({}, defaults, options);
        the._init();
    });


    Item.implement({
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
                data: data,
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
                var fd = new FormData();
                var the = this;

                // key, val, name
                fd.append('img', list[0].file, 'img.png');

                ajax({
                    url: '/admin/api/oss/',
                    method: 'put',
                    body: fd,
                    loading: false
                })
                    .on('progress', function (eve) {
                        onprogress(eve.alienDetail.percent);
                    })
                    .on('success', function (data) {
                        var image = data.image || {};
                        //cacheControl: "max-age=315360000"
                        //contentType: "image/png"
                        //encoding: "utf8"
                        //image: {type: "png", width: 200, height: 200}
                        //ourl: "http://s-ydr-me.oss-cn-hangzhou.aliyuncs.com/f/i/20141228233411750487888485"
                        //surl: "http://s.ydr.me/f/i/20141228233411750487888485"
                        ondone(null, [{
                            name: "img.png",
                            url: data.surl,
                            width: image.width,
                            height: image.height
                        }]);
                    })
                    .on('error', function (err) {
                        the.uploadDestroy();
                        alert(err);
                    });
            };

            the._editor1 = new Editor(the._contentSelector, {
                id: data.id,
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
                var ld = loading('正在翻译');

                the._translate(name, function (err, uri) {
                    ld.destroy();

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
                        the.vue.$data.columns.push({
                            text: data.name,
                            value: data.id
                        });
                        the.vue.$data.object.column = data.id;
                        setTimeout(function () {
                            the._$objectColumn.value = data.id
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
            var data = the.vue.$data;
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
                        id: data.id + '-hidden',
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
            the.vue.$watch('object.title', controller.debounce(function (word) {
                if (xhr) {
                    xhr.abort();
                }

                xhr = the._translate(word, function (err, word2) {
                    if (err) {
                        return;
                    }

                    the.vue.$data.object.uri = word2;
                });
            }));
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
                xhr = null
            }).xhr;

            return xhr;
        }
    });

    module.exports = Item;
});