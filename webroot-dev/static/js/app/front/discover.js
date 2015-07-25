/*!
 * dicover
 * @author ydr.me
 * @create 2014-12-13 23:25
 */


define(function (require, exports, module) {
    'use strict';

    require('../../modules/front/login.js');
    require('../../modules/front/nav.js');
    require('../../modules/front/footer.js');

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var event = require('../../alien/core/event/touch.js');
    var number = require('../../alien/utils/number.js');
    var ajax = require('../../modules/common/ajax.js');
    var app = {};

    app.init = function () {
        var $list = selector.query('#list')[0];

        event.on($list, 'click', 'a', function () {
            var $views = selector.query('.links-views', this)[0];
            var now = number.parseInt($views.innerHTML, 1);

            $views.innerHTML = ++now;
        });
    };

    app.init();
});