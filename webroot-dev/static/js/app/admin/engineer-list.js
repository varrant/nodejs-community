/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    new List('#list', '#pagination', {
        url:  '/api/engineer/'
    });
});