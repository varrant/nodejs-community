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
    var Upload = require('../../widget/admin/Upload/');
    var upload = new Upload();
    var dato = require('../../alien/util/dato.js');
    var app = {};
    var id = hashbang.get('query', 'id');
    var url = '/admin/api/section/';

    app.init = function () {
        ajax({
            url: url
        })
            .on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                var section = {
                    name: '',
                    uri: '',
                    cover: '',
                    introduction: ''
                };

                if (id) {
                    dato.each(json.data, function (i, sec) {
                        if (sec.id === id) {
                            section = sec;
                            return false;
                        }
                    });
                }

                app.vue = new Vue({
                    el: '#section',
                    data: {
                        sections: json.data,
                        section: section
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
            app.vue.$data.section.cover = data.surl;
            this.close();
        });
    };


    /**
     * 新增/保存
     * @private
     */
    app._onsave = function () {
        var the = this;
        var data = the.$data.section;
        var hasId = !!data.id;

        ajax({
            method: 'put',
            url: url,
            data: the.$data.section
        })
            .on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                if (!hasId) {
                    the.$data.sections.push(json.data);
                }

                the.$data.section = json.data;
            })
            .on('error', alert);
    };


    /**
     * 选择
     * @param index
     * @private
     */
    app._onchoose = function (index) {
        this.$data.section = this.$data.sections[index];
    };


    /**
     * 删除
     * @param index
     * @returns {*}
     * @private
     */
    app._onremove = function (index) {
        var col = this.$data.sections[index];
        var id = col.id;

        if (col.objectCount > 0) {
            return alert('该分类下还有' + col.objectCount + '个项目，无法删除');
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

                    app.vue.$data.sections.splice(index, 1);
                })
                .on('error', alert);
        };

        confirm('确认要删除该分类吗？', remove);
    };


    /**
     * 实时翻译
     * @private
     */
    app._translate = function () {
        var xhr = null;

        // 实时翻译
        app.vue.$watch('section.name', function (word) {
            if (xhr) {
                xhr.abort();
            }

            xhr = ajax({
                url: '/api/translate/?word=' + encodeURIComponent(word)
            })
                .on('success', function (json) {
                    if (json.code === 200) {
                        app.vue.$data.section.uri = json.data;
                    }
                })
                .on('complete', function () {
                    xhr = null;
                });
        });
    };

    app.init();
});