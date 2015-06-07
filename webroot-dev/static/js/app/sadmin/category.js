/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 22:05
 */


define(function (require, exports, module) {
    'use strict';


    require('.././sadmin/header.js');
    require('.././sadmin/sidebar.js');

    var Setting = require('.././sadmin/Setting.js');
    new Setting('#category', {
        url: '/admin/api/category/',
        itemKey: 'category',
        listKey: 'categories',
        type: '分类'
    });
});