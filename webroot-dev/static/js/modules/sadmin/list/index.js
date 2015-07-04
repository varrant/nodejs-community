/*!
 * 列表UI
 * @author ydr.me
 * @create 2014-12-19 15:15
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../../alien/ui/index.js');
    var ajax = require('../../common/ajax.js');
    var alert = require('../../../alien/widgets/alert.js');
    var confirm = require('../../../alien/widgets/confirm.js');
    var hashbang = require('../../../alien/core/navigator/hashbang.js');
    var dato = require('../../../alien/utils/dato.js');
    var number = require('../../../alien/utils/number.js');
    var qs = require('../../../alien/utils/querystring.js');
    var Pagination = require('../../../alien/ui/pagination/index.js');
    var attribute = require('../../../alien/core/dom/attribute.js');
    var defaults = {
        url: '/admin/api/object/list/',
        section: '',
        query: {
            page: 1,
            limit: 10,
            section: null,
            type: null
        },
        data: null,
        methods: null
    };
    var List = ui.create({
        constructor: function (listSelector, paginationSelector, options) {
            var the = this;

            the._listSelector = listSelector;
            the._paginationSelector = paginationSelector;
            the._options = dato.extend(true, {}, defaults, options);
            the.query = {
                page: number.parseInt(hashbang.get('query', 'page'), the._options.query.page),
                limit: number.parseInt(hashbang.get('query', 'limit'), the._options.query.limit),
                type: hashbang.get('query', 'type') || the._options.query.type,
                section: the._options.query.section
            };

            the._init();
        },
        _init: function () {
            var the = this;

            the.getList();
            the._initEvent();

            return the;
        },


        _initEvent: function () {
            var the = this;

            hashbang.on('query', 'page', function (eve, neo) {
                var page = neo.query.page || 1;
                var limit = neo.query.limit || 20;

                if (the.query.page !== page || the.query.limit !== limit) {
                    the.query.page = page;
                    the.query.limit = limit;
                    the.getList();
                }
            });
        },


        getList: function () {
            var the = this;
            var options = the._options;

            ajax({
                url: options.url + '?' + qs.stringify(the.query)
            }).on('success', the._onsuccess.bind(the)).on('error', alert);
        },


        _onsuccess: function (data) {
            var the = this;
            var categoriesMap = {};
            var columnsMap = {};

            if (data.categories) {
                data.categories.forEach(function (item) {
                    categoriesMap[item.id] = item;
                });
            }

            if (data.columns) {
                data.columns.forEach(function (item) {
                    columnsMap[item.id] = item;
                });
            }

            if (the.vue) {
                the.vue.$data.list = data.list;
                the._pagination.render({
                    page: the.query.page,
                    max: Math.ceil(data.count / the.query.limit)
                });
            } else {
                the.vue = new Vue({
                    el: the._listSelector,
                    data: dato.extend({
                        list: data.list,
                        query: the.query,
                        categoriesMap: categoriesMap,
                        columnsMap: columnsMap
                    }, the._options.data),
                    methods: the._options.methods
                });

                the.vue.$el.classList.remove('none');
                the._pagination = new Pagination(the._paginationSelector, {
                    page: the.query.page,
                    max: Math.ceil(data.count / the.query.limit)
                }).on('change', function (_page) {
                        hashbang.set('query', {
                            page: _page,
                            limit: the.query.limit
                        });
                        attribute.scrollTop(window, 0);
                    });
            }
        }
    });

    List.defaults = defaults;
    module.exports = List;
});