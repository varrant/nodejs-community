/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 16:26
 */


define(function (require, exports, module) {
    'use strict';

    var Item = require('../../ui/admin/Item/');

    new Item('#form', '#content', {
        type: window['-type-'],
        id: window['-id-']
    });
});