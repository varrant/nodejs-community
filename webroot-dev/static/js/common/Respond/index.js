/*!
 * 文本发送器
 * @author ydr.me
 * @create 2014-12-26 17:26
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../../alien/ui/');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/utils/dato.js');
    var Editor = require('../../../alien/ui/Editor/');
    var Template = require('../../../alien/libs/Template.js');
    var template = require('html!./template.html');
    var style = require('css!./style.css');
    var tpl = new Template(template);
    var defaults = {
        id: '',
        avatar: '/static/img/avatar.png',
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
    var Respond = ui.create(function ($parent, options) {
        var the = this;

        the._$parent = selector.query($parent)[0];
        the._options = dato.extend(true, {}, defaults, options);
        the._init();
    });


    /**
     * 初始化
     * @private
     */
    Respond.fn._init = function () {
        var the = this;

        the._initNode();
        the._initEvent();
    };


    /**
     * 初始化节点
     * @private
     */
    Respond.fn._initNode = function () {
        var the = this;
        var options = the._options;

        the._$parent.innerHTML = tpl.render(options);

        var nodes = selector.query('.j-flag', the._$parent);

        the._$content = nodes[0];
        the._$submit = nodes[1];
        the._editor = new Editor(the._$content, options);
    };


    /**
     * 初始化事件
     * @private
     */
    Respond.fn._initEvent = function () {
        var the = this;

        event.on(the._$submit, 'click', function () {
            var value = the._$content.value.trim();

            if (value) {
                the.emit('submit', the._$content.value.trim());
            }
        });
    };


    /**
     * 设置不可用
     */
    Respond.fn.disable = function () {
        var the = this;

        the._$submit.disabled = true;
        return the;
    };


    /**
     * 设置可用
     */
    Respond.fn.enable = function () {
        var the = this;

        the._$submit.disabled = false;
        return the;
    };


    /**
     * 重置
     */
    Respond.fn.reset = function () {
        var the = this;

        the._editor.setContent('');
        the._editor.clearStore();
        return the;
    };


    /**
     * 实例销毁
     */
    Respond.fn.destroy = function () {
        var the = this;

        event.un(the._$submit, 'click');
        the._editor.destroy();
    };

    modification.importStyle(style);
    module.exports = Respond;
});