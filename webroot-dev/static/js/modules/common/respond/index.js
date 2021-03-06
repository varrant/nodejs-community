/*!
 * 文本发送器
 * @author ydr.me
 * @create 2014-12-26 17:26
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../../alien/ui/index.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/utils/dato.js');
    var Editor = require('../../../alien/ui/editor/index.js');
    var Template = require('../../../alien/libs/template.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var tpl = new Template(template);
    var defaults = {
        id: '',
        previewClass: 'typo',
        minHeight: 50,
        avatar: '',
        githubLogin: '#',
        markdownHelp: {
            link: '#',
            text: '#'
        },
        placeholder: '说点什么吧',
        submit: '提交',
        icon: 'comment',
        uploadCallback: null
    };
    var Respond = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = selector.query($parent)[0];
            the._options = dato.extend(true, {}, defaults, options);
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
            var options = the._options;

            the._$parent.innerHTML = tpl.render(options);

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
            var onsubmit  = function () {
                var value = the._editor.getValue().trim();

                if (value) {
                    the.emit('submit', value);
                } else {
                    the.emit('empty');
                }
            };

            the._editor.on('submit', onsubmit);
            event.on(the._$submit, 'click', onsubmit);
        },


        /**
         * 设置不可用
         * @returns {Respond}
         */
        disable: function () {
            var the = this;

            the._$submit.disabled = true;
            return the;
        },


        /**
         * 设置可用
         * @returns {Respond}
         */
        enable: function () {
            var the = this;

            the._$submit.disabled = false;
            return the;
        },


        /**
         * 重置
         * @returns {Respond}
         */
        reset: function () {
            var the = this;

            the._editor.setValue('');
            the._editor.clearStore();
            return the;
        },


        /**
         * 设置 at 列表
         * @param list
         * @returns {Respond}
         */
        setAtList: function (list) {
            var the = this;

            the._editor.setAtList(list);

            return the;
        },


        /**
         * 实例销毁
         */
        destroy: function () {
            var the = this;

            event.un(the._$submit, 'click');
            the._editor.destroy();
        }
    });

    ui.importStyle(style);
    Respond.defaults = defaults;
    module.exports = Respond;
});