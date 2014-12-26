/*!
 * 文本发送器
 * @author ydr.me
 * @create 2014-12-26 17:26
 */


define(function (require, exports, module) {
    'use strict';

    var generator = require('../../../alien/ui/generator.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/util/dato.js');
    var Editor = require('../../../alien/ui/Editor/');
    var Template = require('../../../alien/libs/Template.js');
    var template = require('html!./template.html');
    var style = require('css!./style.css');
    var tpl = new Template(template);
    var defaults = {
        id: '',
        link: '#',
        text: 'markdown 编辑器使用帮助',
        placeholder: '说点什么吧',
        submit: '提交',
        autoFocus: false
    };
    var Respond = generator({
        /**
         * 构造函数
         * @param $parent
         * @param options
         */
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = selector.query($parent)[0];
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
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var options = the._options;
            var html = tpl.render(options);

            the._$parent.innerHTML = html;

            var nodes = selector.query('.j-flag', the._$parent);

            the._$content = nodes[0];
            the._$submit = nodes[1];
            the._editor = new Editor(the._$content, options);
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;

            event.on(the._$submit, 'click', function () {
                var value = the._$content.value.trim();

                if (value) {
                    the.emit('submit', the._$content.value.trim());
                }
            });
        },


        /**
         * 设置不可用
         */
        disable: function () {
            var the = this;

            the._$content.disabled = true;
            the._$submit.disabled = true;
        },


        /**
         * 设置可用
         */
        enable: function () {
            var the = this;

            the._$content.disabled = false;
            the._$submit.disabled = false;
        },


        /**
         * 重置
         */
        reset: function () {
            var the = this;

            the._editor.setContent('');
        }
    });

    modification.importStyle(style);
    module.exports = Respond;
});