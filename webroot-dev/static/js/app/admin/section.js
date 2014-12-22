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
    var ajax = require('../../widget/common/ajax.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
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
                    uri: ''
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
                        onsave: app._onsave,
                        onchoose: app._onchoose
                    }
                });

                app.vue.$el.classList.remove('f-none');
                app._translate();
            })
            .on('error', alert);
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