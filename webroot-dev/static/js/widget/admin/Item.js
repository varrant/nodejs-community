/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 14:56
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var selector = require('../../alien/core/dom/selector.js');
    var klass = require('../../alien/util/class.js');
    var dato = require('../../alien/util/dato.js');
    var defaults = {
        url: ''
    };
    var Item = klass.create({
        construnctor: function (formSelector, options) {
            var the = this;

            the._formSelector = formSelector;
            the._options = dato.extend({}, defaults, options);
        }
    })

    module.exports = {};
});