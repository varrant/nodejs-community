/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 20:13
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');

    var alert = require('../../widget/common/alert.js');
    var ajax = require('../../widget/common/ajax.js');
    var app = {};

    app.init = function () {
        ajax({
            url: '/admin/api/setting/'
        });
    };

    app.init();
});