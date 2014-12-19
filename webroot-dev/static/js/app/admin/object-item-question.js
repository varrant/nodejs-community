/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:41
 */

define(function (require) {
    'use strict';

    var Item = require('../../ui/admin/Item/');

    new Item('#form', '#content', {
        id: window['-id-']
    });
});