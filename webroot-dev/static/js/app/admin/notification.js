/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');
    var ajax = require('../../widget/common/ajax.js');
    var methods = {};

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    var list = new List('#list', '#pagination', {
        url: '/admin/api/notification/',
        type: 'unactive',
        methods: methods,
        limit: 2
    });

    // 选择读状态
    methods.onchange = function () {
        list.query.type = this.$data.type;
        list.getList();
    };


    // 标记已读
    methods.setActive = function (item) {
        item.hasActived = true;
        ajax({
            method: 'delete',
            url: '/admin/api/notification/',
            data: {
                id: item.id
            }
        });
    };


    // 标记未读
    methods.setUnactive = function (item) {
        item.hasActived = false;
        ajax({
            method: 'put',
            url: '/admin/api/notification/',
            data: {
                id: item.id
            }
        });
    };
});