/*!
 * 图片查看器
 * @author ydr.me
 * @create 2015-01-04 21:43
 */


define(function (require, exports, module) {
    /**
     * @module ui/Viewer/
     * @requires ui//
     * @requires ui/Dialog/
     * @requires core/dom/selector
     * @requires core/dom/attribute
     * @requires core/dom/modification
     * @requires core/event/base
     * @requires libs/Template
     * @requires utils/dato
     * @requires utils/number
     * @requires utils/howdo
     */
    'use strict';


    var ui = require('../');
    var Scrollbar = require('../Scrollbar/');
    var Mask = require('../Mask/');
    var Window = require('../Window/index.js');
    var selector = require('../../core/dom/selector.js');
    var attribute = require('../../core/dom/attribute.js');
    var modification = require('../../core/dom/modification.js');
    var animation = require('../../core/dom/animation.js');
    var event = require('../../core/event/touch.js');
    var Template = require('../../libs/Template.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var dato = require('../../utils/dato.js');
    var number = require('../../utils/number.js');
    var typeis = require('../../utils/typeis.js');
    var controller = require('../../utils/controller.js');
    var howdo = require('../../utils/howdo.js');
    var arrowLeft = require('./arrow-left.png', 'image');
    var arrowRight = require('./arrow-right.png', 'image');
    var tpl = new Template(template);
    var alienClass = 'alien-ui-imgview';
    var noop = function () {
        // ignore
    };
    var defaults = {
        duration: 400,
        easing: 'in-out',
        loading: {
            url: 'http://s.ydr.me/p/i/loading-128.gif',
            width: 64,
            height: 64
        },
        thumbnailSize: {
            width: 60,
            height: 60
        }
    };
    var Imgview = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend(true, {}, defaults, options);
            the._init();
        },

        /**
         * 初始化
         * @private
         */
        _init: function () {
            var the = this;

            the._initData();
            the._initNode();
            the._initEvent();

            return the;
        },


        /**
         * 初始化数据
         * @private
         */
        _initData: function () {
            var the = this;

            the._list = [];
            the._index = 0;
            the._$itemlist = [];
            the._opened = false;
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;

            the._mask = new Mask(window, {
                style: {
                    background: '#000'
                }
            });
            the._window = new Window(null, {
                width: '100%',
                height: '100%',
                top: 0
            });
            the._$window = the._window.getNode();
            the._$window.innerHTML = tpl.render({
                list: the._list
            });

            var nodes = selector.query('.j-flag', the._$window);

            the._$content = nodes[0];
            the._$loading = nodes[1];
            the._$body = nodes[2];
            the._$prev = nodes[3];
            the._$next = nodes[4];
            the._$navList = nodes[5];
            the._$close = nodes[6];
            attribute.css(the._$prev, 'backgroundImage', 'url(' + arrowLeft + ')');
            attribute.css(the._$next, 'backgroundImage', 'url(' + arrowRight + ')');
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;

            // 打开
            the._window.on('open', function () {
                the._renderContent();
                the._renderNav();
                the._show();
                the.emit('open');
            }).on('close', function () {
                the._opened = false;
                the.emit('close');
            });

            event.on(window, 'resize', the._onresize = controller.debounce(function () {
                the.emit('resize');
                the._window.resize();
            }));


            // 上一张
            event.on(the._$prev, 'click', function () {
                var length = the._list.length;

                if (length > 1 && the._index > 0) {
                    the._index--;
                    the._ctrl();
                    the._show();
                }
            });

            // 下一张
            event.on(the._$next, 'click', function () {
                var length = the._list.length;

                if (length > 1 && the._index < length - 1) {
                    the._index++;
                    the._ctrl();
                    the._show();
                }
            });

            // 单击序列
            event.on(the._$navList, 'click', '*', function () {
                var index = attribute.data(this, 'index');

                if (index === the._index) {
                    return;
                }

                the._index = index;
                the._ctrl();
                the._show();
            });

            // 点击关闭
            event.on(the._$close, 'click', function () {
                the._window.close(function () {
                    the._mask.close();
                    attribute.addClass(the._$content, alienClass + '-content-loading');
                    the._$navList.innerHTML = '';
                    the._renderContent();
                });
            });
        },


        /**
         * 切换前后按钮状态
         * @private
         */
        _ctrl: function () {
            var the = this;
            var disabledClass = alienClass + '-disabled';
            var length = the._list.length;

            attribute[(the._index === 0 ? 'add' : 'remove') + 'Class'](the._$prev, disabledClass);
            attribute[(the._index === length - 1 ? 'add' : 'remove') + 'Class'](the._$next, disabledClass);
        },


        /**
         * 加载图片
         * @param src {String} 图片地址
         * @param [callback] {Function} 加载之后
         * @private
         */
        _load: function (src, callback) {
            var img = new Image();
            var index = this._index;

            img.src = src;
            callback = callback || noop;

            if (img.complete) {
                callback(null, {
                    index: index,
                    src: src,
                    width: img.width,
                    height: img.height
                });
            } else {
                img.onload = function () {
                    callback(null, {
                        index: index,
                        src: src,
                        width: img.width,
                        height: img.height
                    });
                };
                img.onerror = callback;
            }
        },


        /**
         * 渲染内容
         * @private
         */
        _renderContent: function () {
            var the = this;
            var options = the._options;

            attribute.css(the._$content, 'bottom', number.parseFloat(options.thumbnailSize.height));
            attribute.css(the._$loading, {
                width: options.loading.width,
                height: options.loading.height,
                backgroundImage: 'url(' + options.loading.url + ')'
            });
        },


        /**
         * 渲染导航
         * @private
         */
        _renderNav: function () {
            var the = this;
            var html = '';
            var className = alienClass + '-nav-item';

            the._list.forEach(function (item, index) {
                html += '<div class="' + className + '" data-index="' + index + '" style="background-image:url(' + item.thumbnail + ')"></div>';
            });

            the._$navList.innerHTML = html;
            the._$itemlist = selector.query('.' + className, the._$navList);
            the._$itemlist.forEach(function ($item) {
                attribute.style($item, the._options.thumbnailSize);
            });
            attribute.width(the._$navList, number.parseFloat(the._options.thumbnailSize.width) * the._list.length);
        },


        /**
         * 展示
         * @private
         */
        _show: function () {
            var the = this;
            var options = the._options;
            var loadingClass = alienClass + '-content-loading';
            var activeClass = alienClass + '-nav-item-active';
            var transitionOptions = {
                duration: options.duration,
                easing: options.easing
            };
            var onnext = function () {
                attribute.addClass(the._$content, loadingClass);
                attribute.removeClass(the._$itemlist, activeClass);
                attribute.addClass(the._$itemlist[the._index], activeClass);
                the._load(the._list[the._index].original, function (err, meta) {
                    if (err) {
                        /**
                         * 图片加载出现错误
                         * @event error
                         * @param error {Error} 错误对象
                         */
                        return the.emit('error', err);
                    }

                    if (the._index === meta.index) {
                        attribute.removeClass(the._$content, loadingClass);
                        the._opened = true;

                        var maxWidth = Math.min(attribute.width(the._$content) - 20, meta.width);
                        var maxHeight = Math.min(attribute.height(the._$content) - 20, meta.height);
                        var maxRatio = maxWidth / maxHeight;
                        var ratio = meta.width / meta.height;
                        var realWidth = maxRatio < ratio ? maxWidth : maxHeight * ratio;
                        var realHeight = maxRatio < ratio ? maxWidth / ratio : maxHeight;

                        attribute.css(the._$body, 'backgroundImage', 'url(' + meta.src + ')');
                        animation.transition(the._$body, {
                            width: realWidth,
                            height: realHeight
                        }, transitionOptions, function () {
                            //attribute.css(the._$body, 'backgroundImage', 'url(' + meta.src + ')');
                        });
                    }
                });
            };

            // 已经有 body 打开
            if (the._opened) {
                //attribute.css(the._$body, 'backgroundImage', 'none');
                animation.transition(the._$body, {
                    width: options.loading.width,
                    height: options.loading.height
                }, transitionOptions, onnext);
            } else {
                attribute.css(the._$body, {
                    width: options.loading.width,
                    height: options.loading.height,
                    backgroundImage: 'none'
                });
                onnext();
            }
        },


        /**
         * 打开图片查看器
         * @param list {Array} 图片列表
         * @param [index=0] {Number} 打开时显示的图片索引
         *
         * @example
         * 数组： ['原始图']
         *
         * 也可以使用 [{
         *    thumbnail: '缩略图',
         *    original: '原始图'
         * }]
         */
        open: function (list, index) {
            var the = this;
            //var options = the._options;

            list = list.map(function (item) {
                if (typeis.string(item)) {
                    return {
                        thumbnail: item,
                        original: item
                    };
                }

                return item;
            });

            the._list = list;
            the._index = index || 0;
            the._ctrl();
            the._mask.open();
            the._window.open();

            return the;
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            event.un(the._$prev, 'click');
            event.un(the._$next, 'click');
            event.un(the._$navList, 'click');
            the._window.destroy();
            the._mask.destroy();
        }
    });
    Imgview.defaults = defaults;
    modification.importStyle(style);
    module.exports = Imgview;
});