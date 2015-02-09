/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 22:05
 */


define(function (require, exports, module) {
    'use strict';


    require('../../widget/front/nav.js');

    var Setting = require('../../widget/admin/Setting.js');
    new Setting('#column', {
        url: '/admin/api/column/',
        itemKey: 'column',
        listKey: 'columns',
        type: '专栏'
    });
});