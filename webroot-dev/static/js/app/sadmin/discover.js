/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-07-24 21:46
 */


define(function (require, exports, module) {
    'use strict';

    var Vue = window.Vue;
    var data = {
        list: [],
        link: {
            type: 1,
            text: '',
            url: '',
            index: 1
        },
        categories: []
    };
    var ajax = require('../../modules/common/ajax.js');
    var app = {};

    app.init = function () {
        ajax({
            url: ''
        });
    };

    app.init();
});