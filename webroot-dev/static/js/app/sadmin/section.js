/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 22:05
 */


define(function (require, exports, module) {
    'use strict';


    require('../../modules/sadmin/header.js');
    require('../../modules/sadmin/sidebar.js');

    var Setting = require('../../modules/sadmin/Setting.js');
    new Setting('#section', {
        url: '/admin/api/section/',
        itemKey: 'section',
        listKey: 'sections',
        type: '版块'
    });
});