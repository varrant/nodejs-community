/*!
 * 列表UI
 * @author ydr.me
 * @create 2014-12-19 15:15
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../alien/ui/base.js');
    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var dato = require('../../alien/utils/dato.js');
    var qs = require('../../alien/utils/querystring.js');
    var Pagination = require('../../alien/ui/Pagination/index.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var defaults = {
        url: '/admin/api/object/list/',
        section: '',
        query: {
            page: 1,
            limit: 20,
            section: null,
            type: null
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
            section: the._options.query.section
        };

        the._init();
    });


    List.fn._init = function () {
        var the = this;

        the.getList();
        the._initEvent();

        return the;
    };


    List.fn._initEvent = function () {
        var the = this;

        hashbang.on('query', 'page', function (eve, neo) {
            the.query.page = neo.query.page || 1;
            the.query.limit = neo.query.limit || 20;
            the.getList();
        });
    };


    List.fn.getList = function () {
        var the = this;
        var options = the._options;

        ajax({
            url: options.url + '?' + qs.stringify(the.query)
        }).on('success', the._onsuccess.bind(the)).on('error', alert);
    };


    List.fn._onsuccess = function (json) {
        var the = this;

        if (json.code !== 200) {
            return alert(json);
        }

        var data = json.data;

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
    };

    module.exports = List;
});