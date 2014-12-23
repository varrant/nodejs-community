/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-23 13:56
 */


define(function (require, exports, module) {
    'use strict';

    var generator = require('../../../alien/ui/generator.js');
    var compatible = require('../../../alien/core/navigator/compatible.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/util/dato.js');
    var ajax = require('../../common/ajax.js');
    var alert = require('../../common/alert.js');
    var confirm = require('../../common/confirm.js');
    var Dialog = require('../../../alien/ui/Dialog/');
    var Template = require('../../../alien/libs/Template.js');
    var template = require('html!./template.html');
    var style = require('css!./style.css');
    var tpl = new Template(template);
    var URL = window[compatible.html5('URL', window)];
    var defaults = {
        minWidth: 100,
        minHeight: 100,
        maxWidth: 100,
        maxHeight: 100,
        ratio: 1
    };
    var Upload = generator({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the._init();
        },


        /**
         * 初始化
         * @private
         */
        _init: function () {
            var the = this;

            the._initNode();
            the._initEvent();
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var $dialog = tpl.render();

            $dialog = modification.parse($dialog)[0];
            modification.insert($dialog, document.body, 'beforeend');
            the._$dialog = $dialog;
            the._dialog = new Dialog(the._$dialog, {
                title: '裁剪并上传图片',
                width: 'auto'
            });

            var nodes = selector.query('.j-flag', $dialog);

            the._$file = nodes[0];
            the._$sure = nodes[1];
            the._$container = nodes[2];
        },


        _initEvent: function () {
            var the = this;

            event.on(the._$file, 'change', function (eve) {
                var file;

                if(this.files){
                    file = this.files[0];
                    if(this.accept.indexOf(file.type) > -1){
                        the._renderImg(file);
                    }else{
                        alert('只能选择图片文件！');
                    }
                }
            });
        },


        _renderImg: function (file) {
            var the = this;
            var src = URL.createObjectURL(file);
            var $img = modification.create('img', {
                src: src
            });

            the._$container.innerHTML = '';
            modification.insert($img, the._$container, 'beforeend');
        },


        open: function () {
            this._dialog.open();
        }
    });

    modification.importStyle(style);
    module.exports = Upload;
});