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
    var qs = require('../../alien/util/querystring.js');
    var Pager = require('../../alien/ui/Pager/index.js');
    var url = '/admin/api/object/list/?type=' + window['-type-'] + '&';
    var page = {};
    var req = {
        page: hashbang.get('query', 'page') || 1,
        limit: 20
    };
    var vue;

    require('../../widget/admin/welcome.js');

    hashbang.on('query', 'page', function (eve, neo) {
        req.page = neo.query.page || 1;
        req.limit = neo.query.limit || 20;
        page.list();
    });

    /**
     * 请求展示列表
     */
    page.list = function () {
        ajax({
            url: url + qs.stringify(req)
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

        if (vue) {
            vue.$data.objects = json.data;
        } else {
            vue = new Vue({
                el: '#list',
                data: {
                    objects: json.data,
                    req: req
                },
                methods: {}
            });

            vue.$el.classList.remove('f-none');
            new Pager('#pager', {
                page: req.page
            });
        }
    };

    page.list();
});