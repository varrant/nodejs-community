/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:28
 */


define(function (require, exports, module) {
    'use strict';


    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var reqPage = hashbang.get('query', 'page') || 1;
    var url = '/admin/api/object/list/?type=' + window['-type-'];
    var page = {};

    require('../../widget/admin/welcome.js');

    /**
     * 请求展示列表
     */
    page.list = function () {
        ajax({
            url: url + '&page=' + reqPage
        }).on('success', page.onsuccess).on('error', alert);
    };

    /**
     * 请求成功
     * @param json
     * @returns {*}
     */
    page.onsuccess = function (json) {
        if (json.code !== 200) {
            return alert(json);
        }

        var vue = new Vue({
            el: '#list',
            data: {
                objects: json.data,
                page: reqPage
            },
            methods: {}
        });

        vue.$el.classList.remove('f-none');
    };

    page.list();
});