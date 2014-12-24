/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 16:26
 */


define(function (require, exports, module) {
    'use strict';

    var Item = require('../../widget/admin/Item.js');

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    new Item('#form', '#content', {
        section: window['-section-'],
        id: window['-id-']
    });
});