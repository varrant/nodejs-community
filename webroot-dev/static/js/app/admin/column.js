/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 22:05
 */


define(function (require, exports, module) {
    'use strict';


    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var ajax = require('../../widget/common/ajax.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var dato = require('../../alien/util/dato.js');
    var Upload = require('../../widget/admin/Upload/');
    var upload = new Upload();
    var app = {};
    var id = hashbang.get('query', 'id');
    var url = '/admin/api/column/';

    app.init = function () {
        ajax({
            url: url
        })
            .on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                var column = {
                    name: '',
                    uri: '',
                    cover: '',
                    introduction: ''
                };

                if (id) {
                    dato.each(json.data, function (i, sec) {
                        if (sec.id === id) {
                            column = sec;
                            return false;
                        }
                    });
                }

                app.vue = new Vue({
                    el: '#column',
                    data: {
                        columns: json.data,
                        column: column
                    },
                    methods: {
                        onupload: app._onupload,
                        onsave: app._onsave,
                        onchoose: app._onchoose,
                        onremove: app._onremove
                    }
                });

                app.vue.$el.classList.remove('f-none');
                app._translate();
            })
            .on('error', alert);
    };


    /**
     * 上传并裁剪图片
     * @private
     */
    app._onupload = function () {
        upload.open().on('success', function (data) {
            app.vue.$data.column.cover = data.surl;
            this.close();
        });
    };


    /**
     * 新增/保存
     * @private
     */
    app._onsave = function () {
        var the = this;
        var data = the.$data.column;
        var hasId = !!data.id;

        ajax({
            method: 'put',
            url: url,
            data: the.$data.column
        })
            .on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                if (!hasId) {
                    the.$data.columns.push(json.data);
                }

                the.$data.column = json.data;
            })
            .on('error', alert);
    };


    /**
     * 选择
     * @param index
     * @private
     */
    app._onchoose = function (index) {
        this.$data.column = this.$data.columns[index];
    };


    /**
     * 删除某个专栏
     * @param index
     * @returns {*}
     * @private
     */
    app._onremove = function (index) {
        var col = this.$data.columns[index];
        var id = col.id;

        if (col.objectCount > 0) {
            return alert('该专栏下还有' + col.objectCount + '个项目，无法删除');
        }

        var remove = function () {
            ajax({
                url: url,
                method: 'delete',
                data: {
                    id: id
                }
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    app.vue.$data.columns.splice(index, 1);
                })
                .on('error', alert);
        };

        confirm('确认要删除该专栏吗？', remove);
    };


    /**
     * 实时翻译
     * @private
     */
    app._translate = function () {
        var xhr = null;

        // 实时翻译
        app.vue.$watch('column.name', function (word) {
            if (xhr) {
                xhr.abort();
            }

            xhr = ajax({
                url: '/api/translate/?word=' + encodeURIComponent(word)
            })
                .on('success', function (json) {
                    if (json.code === 200) {
                        app.vue.$data.column.uri = json.data;
                    }
                })
                .on('complete', function () {
                    xhr = null;
                });
        });
    };




    app.init();
});