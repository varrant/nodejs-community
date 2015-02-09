/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:28
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');

    require('../../widget/front/nav.js');

    new List('#list', '#pagination', {
        query: {
            section: window['-section-']
        }
    });
});