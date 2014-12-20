/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 16:09
 */


define(function (require) {
    'use strict';

    var Setting = require('../../widget/admin/Setting.js');
    var methods = {};

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');
    new Setting('#list', {
        url: '/admin/api/setting/types/',
        key: 'list',
        methods: methods
    });

    /**
     * 向上移动
     * @param item
     * @param index
     */
    methods.onup = function (item, index) {
        this.$data.list.splice(index, 1);
        this.$data.list.splice(index - 1, 0, item);
    };


    /**
     * 向下移动
     * @param item
     * @param index
     */
    methods.ondown = function (item, index) {
        this.$data.list.splice(index, 1);
        this.$data.list.splice(index + 1, 0, item);
    };
});