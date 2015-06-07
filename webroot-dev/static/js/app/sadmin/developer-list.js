/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('.././sadmin/List.js');

    require('.././sadmin/header.js');
    require('.././sadmin/sidebar.js');

    new List('#list', '#pagination', {
        url:  '/api/developer/'
    });
});