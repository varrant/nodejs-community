/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 16:26
 */


define(function (require, exports, module) {
    'use strict';

    var Item = require('../../ui/admin/Item/');

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');

    new Item('#form', '#content', {
        type: window['-type-'],
        id: window['-id-']
    });
});