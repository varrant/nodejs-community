/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-23 13:56
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../alien/ui/base.js');
    var selector = require('../../alien/core/dom/selector.js');
    var modification = require('../../alien/core/dom/modification.js');
    var dato = require('../../alien/util/dato.js');
    var ajax = require('../common/ajax.js');
    var Dialog = require('../../alien/ui/Dialog/');
    var defaults = {
        minWidth: 100,
        minHeight: 100,
        maxWidth: 100,
        maxHeight: 100,
        ratio: 1
    };
    var Upload = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the._init();
        },

        _init: function () {
            var the = this;

            the._initNode();
        },

        _initNode: function () {
            var the = this;
            var $div = modification.create('div', {
                className: 'alien-ui-upload'
            });

            the._$dialog = modification.insert($div, document.body, 'beforeend');
            the._dialog = new Dialog(the._$dialog, {
                title: '裁剪并上传图片'
            });
        }
    });

    module.exports = Upload;
});