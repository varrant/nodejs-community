/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:28
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');

    require('../../widget/admin/welcome.js');
    new List('#list', '#pagination', {
        url: '/admin/api/object/list/?type=question&'
    });
});