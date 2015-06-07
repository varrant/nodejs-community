/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../modules/sadmin/List.js');

    require('../../modules/sadmin/header.js');
    require('../../modules/sadmin/sidebar.js');

    new List('#list', '#pagination', {
        url:  '/api/developer/'
    });
});