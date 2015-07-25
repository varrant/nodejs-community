/*!
 * 分类管理
 * @author ydr.me
 * @create 2014-12-22 22:05
 */


define(function (require, exports, module) {
    'use strict';


    require('../../modules/sadmin/header.js');
    require('../../modules/sadmin/sidebar.js');

    var APP = window.APP;

    var Setting = require('../../modules/sadmin/setting/index.js');
    new Setting('#category', {
        url: '/admin/api/category/',
        query: {
            type: APP.type
        },
        emptyData: {
            type: APP.type
        },
        itemKey: 'category',
        listKey: 'categories',
        type: '分类',
        data: {
            typeMap: {
                1: '文章分类',
                2: '导航分类'
            }
        }
    });
});