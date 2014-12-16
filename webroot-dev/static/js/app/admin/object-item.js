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
    var objectId = window['-id-'];
    var url = '/admin/api/object/?id=' + objectId;
    var page = {};

    require('../../widget/admin/welcome.js');

    /**
     * 请求展示列表
     */
    page.item = function () {
        if (objectId) {
            ajax({
                url: url
            }).on('success', page.onsuccess).on('error', alert);
        } else {
            page.onsuccess({
                code: 200,
                data: {
                    content: ''
                }
            });
        }
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
            el: '#form',
            data: {
                form: json.data
            },
            methods: {}
        });

        vue.$el.classList.remove('f-none');
    };

    page.item();
});