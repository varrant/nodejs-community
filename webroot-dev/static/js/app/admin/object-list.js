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
    var Pagination = require('../../alien/ui/Pagination/index.js');
    var url = '/admin/api/object/list/?type=' + window['-type-'] + '&';
    var page = {
        req: {
            page: hashbang.get('query', 'page') || 1,
            limit: 20
        }
    };

    require('../../widget/admin/welcome.js');

    hashbang.on('query', 'page', function (eve, neo) {
        page.req.page = neo.query.page || 1;
        page.req.limit = neo.query.limit || 20;
        page.list();
    });

    /**
     * 请求展示列表
     */
    page.list = function () {
        ajax({
            url: url + qs.stringify(page.req)
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

        if (page.vue) {
            page.vue.$data.objects = json.data;
            page.pagination.render({
                page: page.req.page,
                max: Math.ceil(json.count / page.req.limit)
            });
        } else {
            page.vue = new Vue({
                el: '#list',
                data: {
                    objects: json.data,
                    req: page.req
                },
                methods: {}
            });

            page.vue.$el.classList.remove('f-none');
            page.pagination = new Pagination('#Pagination', {
                page: page.req.page,
                max: Math.ceil(json.count / page.req.limit)
            }).on('change', function (_page) {
                    hashbang.set('query', {
                        page: _page,
                        limit: page.req.limit
                    });
                });
        }
    };

    page.list();
});