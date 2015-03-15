/*!
 * 开发者主页
 * @author ydr.me
 * @create 2014-12-13 23:25
 */


define(function (require, exports, module) {
    "use strict";

    require('../../widget/front/login.js');
    require('../../widget/front/nav.js');

    var app = {};
    var Pager = require('../../alien/ui/Pager/');
    var selector = require('../../alien/core/dom/selector.js');

    app.page = function () {
        var $pager = selector.query('#pager')[0];

        if (!$pager) {
            return;
        }

        var path = location.pathname.replace(/page\/.*$/, '');
        var pageI = window['-page-'];
        var pager = new Pager($pager, {
            page: pageI.page,
            max: Math.ceil(pageI.count / pageI.limit)
        });

        pager.on('change', function (page) {
            location.href = path + 'page/' + page + '/';
        });
    };

    app.page();
});