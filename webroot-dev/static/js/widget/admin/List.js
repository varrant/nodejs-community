/*!
 * 列表UI
 * @author ydr.me
 * @create 2014-12-19 15:15
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../alien/ui/');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var loading = require('../common/loading.js');
    var confirm = require('../common/confirm.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var dato = require('../../alien/utils/dato.js');
    var qs = require('../../alien/utils/querystring.js');
    var Pagination = require('../../alien/ui/Pagination/index.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var defaults = {
        listURL: '/admin/api/object/list/',
        itemURL: '/admin/api/object/',
        section: '',
        query: {
            page: 1,
            limit: 20,
            type: null,
            section: null,
            author: null
        },
        data: null,
        methods: null
    };
    var List = ui.create(function (listSelector, paginationSelector, options) {
        var the = this;

        the._listSelector = listSelector;
        the._paginationSelector = paginationSelector;
        the._options = dato.extend(true, {}, defaults, options);
        the.query = {
            page: dato.parseInt(hashbang.get('query', 'page'), the._options.query.page),
            limit: dato.parseInt(hashbang.get('query', 'limit'), the._options.query.limit),
            type: hashbang.get('query', 'type') || the._options.query.type,
            author: hashbang.get('query', 'author') || '',
            section: the._options.query.section
        };

        the._init();
    });


    List.implement({
        _init: function () {
            var the = this;

            the.getList();
            the._initEvent();

            return the;
        },


        _initEvent: function () {
            var the = this;

            hashbang.on('query', 'page', function (eve, neo) {
                the.query.page = neo.query.page || 1;
                the.query.limit = neo.query.limit || 20;
                the.getList();
            });
        },


        getList: function () {
            var the = this;
            var options = the._options;

            ajax({
                url: options.listURL + '?' + qs.stringify(the.query)
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
                    methods: dato.extend({
                        onremove: the._onremove.bind(the)
                    }, the._options.methods)
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
        },


        _onremove: function (id, index) {
            var the = this;
            var options = the._options;
            var list = the.vue.$data.list;
            var onsure = function () {
                ajax({
                    loading: '删除中',
                    url: options.itemURL,
                    method: 'delete',
                    body: {
                        id: id
                    }
                })
                    .on('success', function () {
                        alert('《' + list[index].title + '》已被删除');
                        list.splice(index, 1);
                    })
                    .on('error', alert);
            };

            confirm('确认要删除《' + list[index].title + '》吗？<br>删除操作不可逆，请仔细确认！').on('sure', onsure);
        }
    });

    module.exports = List;
});