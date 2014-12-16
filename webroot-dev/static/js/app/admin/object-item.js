/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:41
 */


define(function (require, exports, module) {
    'use strict';
    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var url = '/admin/api/object/?type=' + window['-type-'];
    var page = {};
    var reqPage = 1;

    require('../../widget/admin/welcome.js');

    /**
     * 请求展示列表
     */
    page.item = function () {
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

    page.item();
});