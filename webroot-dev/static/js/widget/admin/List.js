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
        section: '',
        limit: 20,
        type: null,
        methods: null
    };
    var List = generator({
        constructor: function (listSelector, paginationSelector, options) {
            var the = this;

            the._listSelector = listSelector;
            the._paginationSelector = paginationSelector;
            the._options = dato.extend({}, defaults, options);
            the.query = {
                page: dato.parseInt(hashbang.get('query', 'page'), 1),
                limit: the._options.limit
            };

            if(the._options.section){
                the.query.section = the._options.section;
            }

            if(the._options.type){
                the.query.type = the._options.type;
            }

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
                the.query.page = neo.query.page || 1;
                the.query.limit = neo.query.limit || 20;
                the.getList();
            });
        },


        getList: function () {
            var the = this;
            var options = the._options;

            ajax({
                url: options.url + '?' + qs.stringify(the.query)
            }).on('success', the._onsuccess.bind(the)).on('error', alert);
        },


        _onsuccess: function (json) {
            var the = this;

            if (json.code !== 200) {
                return alert(json);
            }

            var data = json.data;

            if (the.vue) {
                the.vue.$data.list = data.list;
                the._pagination.render({
                    page: the.query.page,
                    max: Math.ceil(data.count / the.query.limit)
                });
            } else {
                the.vue = new Vue({
                    el: the._listSelector,
                    data: {
                        list: data.list,
                        req: the.query
                    },
                    methods: the._options.methods
                });

                the.vue.$el.classList.remove('f-none');
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

    module.exports = List;
});