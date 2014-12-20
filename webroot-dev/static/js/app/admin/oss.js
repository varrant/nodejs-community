/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 20:13
 */


define(function (require, exports, module) {
    'use strict';

    var Setting = require('../../widget/admin/Setting.js');

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');
    new Setting('#list', {
        url: '/admin/api/setting/alioss/',
        key: 'alioss'
    });
});