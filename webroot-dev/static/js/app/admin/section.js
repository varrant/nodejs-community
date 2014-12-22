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

    app.init = function () {
        ajax({
            url: '/admin/api/section/'
        })
            .on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                var section = {};

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
                        onsave: app._onsave
                    }
                });

                app.vue.$el.classList.remove('f-none');
            })
            .on('error', alert);
    };


    app._onsave = function () {

    };

    app.init();
});