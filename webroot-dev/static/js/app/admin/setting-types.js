/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 16:09
 */


define(function (require) {
    'use strict';

    var Setting = require('../../widget/admin/Setting.js');

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');
    new Setting('#list', {
        url: '/admin/api/setting/types/',
        key: 'list'
    });
});