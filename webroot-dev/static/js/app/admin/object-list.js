/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:28
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    new List('#list', '#pagination', {
        section:  window['-section-']
    });
});