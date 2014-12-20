/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:28
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../ui/admin/List/');

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');

    new List('#list', '#pagination', {
        type:  window['-type-']
    });
});