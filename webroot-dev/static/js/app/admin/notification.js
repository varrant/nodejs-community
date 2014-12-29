/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');
    var methods = {};

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    var list = new List('#list', '#pagination', {
        url: '/admin/api/notification/',
        type: 'unactive',
        methods: methods,
        limit: 2
    });

    methods.onchange = function () {
        list.query.type = this.$data.type;
        list.getList();
    };
});