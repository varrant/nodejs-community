/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 22:05
 */


define(function (require, exports, module) {
    'use strict';


    require('../../modules/front/nav.js');
    require('../../modules/front/footer.js');

    var Setting = require('../../modules/admin/Setting.js');
    new Setting('#column', {
        url: '/admin/api/column/',
        itemKey: 'column',
        listKey: 'columns',
        type: '专辑'
    });
});