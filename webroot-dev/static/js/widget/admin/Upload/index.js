/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-23 13:56
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../../alien/ui/base.js');
    var compatible = require('../../../alien/core/navigator/compatible.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/util/dato.js');
    var canvas = require('../../../alien/util/canvas.js');
    var ajax = require('../../common/ajax.js');
    var alert = require('../../common/alert.js');
    var confirm = require('../../common/confirm.js');
    var Dialog = require('../../../alien/ui/Dialog/');
    var Imgclip = require('../../../alien/ui/Imgclip/');
    var Template = require('../../../alien/libs/Template.js');
    var template = require('html!./template.html');
    var style = require('css!./style.css');
    var tpl = new Template(template);
    var URL = window[compatible.html5('URL', window)];
    var defaults = {
        minWidth: 200,
        minHeight: 200,
        ratio: 1
    };
    var Upload = ui.create({
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


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;

            /**
             * 选择图片
             */
            event.on(the._$file, 'change', function (eve) {
                var file;

                if (this.files && this.files.length) {
                    file = this.files[0];

                    if (this.accept.indexOf(file.type) > -1) {
                        the._renderImg(file);
                    } else {
                        alert('只能选择图片文件！');
                    }
                }
            });

            /**
             * 上传
             */
            event.on(the._$sure, 'click', function () {
                the._$sure.disabled = true;
                the._toBlob(function (blob) {
                    the._toUpload(blob);
                });
            });
        },


        /**
         * 渲染裁剪
         * @param file
         * @private
         */
        _renderImg: function (file) {
            var the = this;
            var src = URL.createObjectURL(file);
            var $img = modification.create('img', {
                src: src
            });

            the._$container.innerHTML = '';
            modification.insert($img, the._$container, 'beforeend');

            if (the._imgclip) {
                the._imgclip.destroy();
                the._$sure.disabled = true;
            }

            the._$img = $img;
            the._imgclip = new Imgclip($img, the._options)
                .on('clipend', function (seletion) {
                    the._selection = seletion;
                    the._$sure.disabled = false;
                })
                .on('error', alert);
        },


        /**
         * 转换为二进制
         * @param callback
         * @private
         */
        _toBlob: function (callback) {
            var the = this;
            var selection = the._selection;

            canvas.imgToBlob(the._$img, {
                srcX: selection.srcLeft,
                srcY: selection.srcTop,
                srcWidth: selection.srcWidth,
                srcHeight: selection.srcHeight,
                drawWidth: 200,
                drawHeight: 200
            }, callback);
        },


        /**
         * 上传
         * @param blob
         * @private
         */
        _toUpload: function (blob) {
            var the = this;
            var fd = new FormData();
            var text = the._$sure.innerHTML;

            // key, val, name
            fd.append('img', blob, 'img.png');

            ajax({
                url: '/admin/api/oss/',
                method: 'put',
                data: fd
            })
                .on('progress', function (eve) {
                    var percent = eve.alienDetail.percent;

                    the._$sure.innerHTML = '上传中 ' + percent;
                })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    the.emit('success', json.data);
                })
                .on('error', alert)
                .on('finish', function () {
                    the._$sure.disabled = false;
                    the._$sure.innerHTML = text;
                });
        },


        /**
         * 打开上传对话框
         */
        open: function () {
            this._dialog.open();
            return this;
        },


        /**
         * 关闭上传的对话框
         */
        close: function () {
            this._dialog.close();
            return this;
        }
    });

    modification.importStyle(style);
    module.exports = Upload;
});