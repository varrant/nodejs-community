/*!
 * 列表UI
 * @author ydr.me
 * @create 2014-12-19 15:15
 */


define(function (require, exports, module) {
    'use strict';

    var generator = require('../../alien/ui/generator.js');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var dato = require('../../alien/util/dato.js');
    var qs = require('../../alien/util/querystring.js');
    var Pagination = require('../../alien/ui/Pagination/index.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var defaults = {
        url: '/admin/api/object/list/',
        type: '',
        limit: 20
    };
    var List = generator({
        constructor: function (listSelector, paginationSelector, options) {
            var the = this;

            the._listSelector = listSelector;
            the._paginationSelector = paginationSelector;
            the._options = dato.extend({}, defaults, options);
            the._query = {
                type: the._options.type,
                page: dato.parseInt(hashbang.get('query', 'page'), 1),
                limit: the._options.limit
            };
            the._init();
        },

        _init: function () {
            var the = this;

            the._getData();
            the._initEvent();

            return the;
        },


        _initEvent: function () {
            var the = this;

            hashbang.on('query', 'page', function (eve, neo) {
                the._query.page = neo.query.page || 1;
                the._query.limit = neo.query.limit || 20;
                the._getData();
            });
        },


        _getData: function () {
            var the = this;
            var options = the._options;

            ajax({
                url: options.url + '?' + qs.stringify(the._query)
            }).on('success', the._onsuccess.bind(the)).on('error', alert);
        },


        _onsuccess: function (json) {
            var the = this;

            if (json.code !== 200) {
                return alert(json);
            }

            if (the.vue) {
                the.vue.$data.objects = json.data;
                the._pagination.render({
                    page: the._query.page,
                    max: Math.ceil(json.count / the._query.limit)
                });
            } else {
                the.vue = new Vue({
                    el: the._listSelector,
                    data: {
                        objects: json.data,
                        req: the._query
                    },
                    methods: {}
                });

                the.vue.$el.classList.remove('f-none');
                the._pagination = new Pagination(the._paginationSelector, {
                    page: the._query.page,
                    max: Math.ceil(json.count / the._query.limit)
                }).on('change', function (_page) {
                        hashbang.set('query', {
                            page: _page,
                            limit: the._query.limit
                        });
                        attribute.scrollTop(window, 0);
                    });
            }
        }
    });

    module.exports = List;
});