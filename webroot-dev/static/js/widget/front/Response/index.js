/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:04
 */


define(function (require, exports, module) {
    'use strict';

    var generator = require('../../../alien/ui/generator.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/util/dato.js');
    var Template = require('../../../alien/libs/Template.js');
    var templateWrap = require('html!./wrap.html');
    var templateList = require('html!./list.html');
    var templateRespond = require('html!./respond.html');
    var style = require('css!./style.css');
    var tplWrap = new Template(templateWrap);
    var tplList = new Template(templateList);
    var tplRespond = new Template(templateRespond);
    var defaults = {
        // get/post
        url: '/api/respond/',
        language: {
            comment: '评论',
            reply: '回复'
        },
        query: {
            limit: 10,
            page: 1
        }
    };
    var Response = generator({
        constructor: function ($parent, options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the._$parent = selector.query($parent)[0];
            the._init();
        },

        /**
         * 初始化
         * @private
         */
        _init: function () {

        }
    });

    modification.importStyle(style);
    module.exports = Response;
});