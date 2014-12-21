/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 20:51
 */


define(function (require, exports, module) {
    'use strict';

    var Setting = require('../../widget/admin/Setting.js');
    var methods = {};

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');
    new Setting('#list', {
        url: '/admin/api/setting/roles/',
        key: 'list',
        methods: methods
    });

    methods.oncreate = function () {
        this.$data.list.push({
            name: 'do what',
            role: 20,
            desc: '做什么'
        });
    }
});