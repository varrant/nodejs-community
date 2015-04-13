/*!
 * 编辑器
 * @author ydr.me
 * @create 2014-11-06 11:07
 */


define(function (require, exports, module) {
    /**
     * @module ui/Editor/
     * @requires ui/
     * @requires core/dom/selector
     * @requires core/dom/modification
     * @requires core/dom/attribute
     * @requires core/event/base
     * @requires ui/Editor/editor
     * @requires utils/dato
     * @requires utils/typeis
     * @requires utils/date
     * @requires utils/random
     * @requires utils/controller
     * @requires ui/Scrollbar/index
     * @requires ui/Dialog/index
     * @requires ui/Msg/index
     * @requires libs/Template
     */
    'use strict';

    var ui = require('../');
    var selector = require('../../core/dom/selector.js');
    var modification = require('../../core/dom/modification.js');
    var attribute = require('../../core/dom/attribute.js');
    var event = require('../../core/event/base.js');
    var compatible = require('../../core/navigator/compatible.js');
    var editor = require('./editor.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var date = require('../../utils/date.js');
    var random = require('../../utils/random.js');
    var controller = require('../../utils/controller.js');
    var Autoheight = require('../Autoheight/');
    var Dialog = require('../Dialog/');
    var Msg = require('../Msg/index.js');
    var Template = require('../../libs/Template.js');
    var template = require('html!./template.html');
    var tpl = new Template(template);
    var style = require('css!./style.css');
    var alienClass = 'alien-ui-editor';
    var RE_IMG_TYPE = /^image\//;
    var alienIndex = 0;
    var localStorage = window.localStorage;
    var pathname = location.pathname;
    var defaults = {
        // 手动设置 ID
        id: '',
        addClass: '',
        // tab 长度
        tabSize: 4,
        // 历史长度
        historyLength: 20,
        // 最小检查同步本地的内容的相差长度
        checkLength: 3,
        // 上传操作
        // uploadCallback 约定：
        // arg0: err 对象
        // arg1: 进度回调
        // arg2: list 上传成功JSON数组对象
        // [{url:'1.jpg',width:100,height:100}]
        uploadCallback: null
    };
    var requestAnimationFrame = compatible.html5('requestAnimationFrame', window);
    var Editor = ui.create(function (ele, options) {
        var the = this;

        the._$ele = selector.query(ele);


        if (!the._$ele.length) {
            throw new Error('instance element is empty');
        }

        the._id = alienIndex++;
        the._$ele = the._$ele[0];
        the._options = dato.extend(true, {}, defaults, options);
        the._init();
    });
    var pro = Editor.prototype;


    /**
     * 初始化
     * @private
     */
    pro._init = function () {
        var the = this;
        var options = the._options;

        the._calStoreId();
        attribute.css(the._$ele, {
            display: 'block',
            width: '100%',
            margin: 0
        });
        attribute.addClass(the._$ele, alienClass + '-textarea');
        modification.wrap(the._$ele, '<div class="' + alienClass +
        '"><div class="' + alienClass + '-inner"></div></div>');
        the._$wrap = selector.closest(the._$ele, '.' + alienClass)[0];
        the._autoheight = new Autoheight(the._$ele);
        the._uploadList = [];
        the._history = [the._$ele.value];
        the._historyIndex = -1;
        the._initEvent();
        the._isFullscreen = false;
        attribute.addClass(the._$wrap, options.addClass);
        the.on('setoptions', function (options) {
            if (the._storeId !== options.id) {
                the._storeId = options.id;
            }
        });
        controller.nextTick(the._initVal, the);

        return the;
    };


    /**
     * 初始化编辑框内容
     * @private
     */
    pro._initVal = function () {
        var the = this;
        var local = the._getLocal();
        var minTime = 24 * 60 * 60 * 1000;
        var deltaTime = Date.now() - local.ver;
        var humanTime = date.from(local.ver);
        var done = function () {
            the._savePos();
        };
        var nowVal = the._$ele.value;
        var nowLen = nowVal.length;
        var storeVal = local.val;
        var storeLen = storeVal.length;

        // 1天之内的本地记录 && 内容部分不一致
        if (deltaTime < minTime && Math.abs(nowLen - storeLen) >= the._options.checkLength) {
            new Msg({
                content: '本地缓存内容与当前不一致。' +
                '<br>缓存时间为：<b>' + humanTime + '</b>。' +
                '<br>本地缓存内容长度为：<b>' + storeLen + '</b>。' +
                '<br>当前内容长度为：<b>' + nowLen + '</b>。' +
                '<br>是否恢复？',
                buttons: ['确定', '取消']
            })
                .on('close', function (index) {
                    if (index === 0) {
                        the._$ele.value = storeVal;
                        /**
                         * 编辑器内容变化之后
                         * @event change
                         * @param value {String} 变化之后的内容
                         */
                        the.emit('change', storeVal);
                        the._autoheight.resize();
                    }

                    the._saveLocal();
                    done();
                });
        } else {
            done();
        }
    };


    /**
     * 上传对话框
     * @private
     */
    pro._uploadDialog = function () {
        var the = this;
        var dt = {
            id: the._id,
            uploads: the._uploadList
        };
        var $dialog;
        var options = the._options;

        if (typeis(options.uploadCallback) !== 'function') {
            return new Msg({
                content: '尚未配置上传回调'
            });
        }

        if (the._dialog) {
            the._dialog.destroy();
            modification.remove(the._$dialog);
            the._dialog = null;
        }

        the._savePos();
        $dialog = modification.parse(tpl.render(dt))[0];
        modification.insert($dialog, document.body, 'beforeend');
        the._$dialog = $dialog;
        the._dialog = new Dialog($dialog, {
            title: '上传' + the._uploadList.length + '张图片（0%）',
            hideClose: true
        }).open();
        the._doUpload();
    };


    /**
     * 销毁上传实例
     * @private
     */
    pro.uploadDestroy = function () {
        var the = this;

        the._dialog.destroy(function () {
            modification.remove(the._$dialog);
            the._restorePos();
        });
    };


    /**
     * 上传
     * @private
     */
    pro._doUpload = function () {
        var the = this;
        var dialog = the._dialog;
        var list = the._uploadList;
        var onprogress = function (percent) {
            dialog.setTitle('上传' + list.length + '张图片（' + percent + '）');
        };
        var ondone = function (err, list) {
            var html = [];
            var msg;

            if (err) {
                msg = new Msg({
                    content: err.message
                });
                msg.on('close', function () {
                    the.uploadDestroy();
                });
                return;
            }

            dato.each(list, function (index, img) {
                // 预加载
                var _img = new Image();

                _img.src = img.url;
                html.push('![' + img.name + '](' + img.url + ')');
            });

            the.insert(html = html.join(' '));
            the._selection[1] += html.length;
            the.uploadDestroy();
        };

        the._options.uploadCallback.call(the, list, onprogress, ondone);
    };


    /**
     * 计算备份ID
     * @private
     */
    pro._calStoreId = function () {
        var the = this;

        if (the._options.id) {
            the._storeId = the._options.id;
            return;
        }

        var $ele = the._$ele;
        var atts = $ele.attributes;
        var attrList = [];
        var id = $ele.id;

        the._storeId = 'alien-ui-editor';

        if (id) {
            the._storeId += pathname + '#' + id;
        } else {
            dato.each(atts, function (i, attr) {
                attrList.push(attr.name + '=' + attr.value);
            });

            the._storeId += pathname +
            '<' + the._$ele.tagName + '>.' +
            the._$ele.className +
            '[' + attrList.join(';') + ']';
        }
    };


    /**
     * 读取本地备份
     * @private
     */
    pro._getLocal = function () {
        var the = this;
        var local = localStorage.getItem(the._storeId);
        var ret;

        try {
            ret = JSON.parse(local);
        } catch (err) {
            // ignore
        }

        return ret || {ver: 0, val: ''};
    };


    /**
     * 写入本地备份
     * @private
     */
    pro._saveLocal = function () {
        var the = this;

        try {
            localStorage.setItem(the._storeId, JSON.stringify({
                val: the._$ele.value,
                ver: Date.now()
            }));
        } catch (err) {
            // ignore
        }
    };


    /**
     * 事件监听
     * @private
     */
    pro._initEvent = function () {
        var the = this;
        var $ele = the._$ele;

        event.on(window, 'resize', the._onresize.bind(the));
        event.on($ele, 'keydown', the._onkeydown.bind(the));
        event.on($ele, 'input', the._oninput.bind(the));
        event.on($ele, 'drop', the._ondrop.bind(the));
        event.on($ele, 'paste', the._onpaste.bind(the));
    };


    /**
     * window.onresize 时回调
     * @private
     */
    pro._onresize = function () {
        var the = this;

        if (the._timerId) {
            clearTimeout(the._timerId);
        }

        the._timerId = setTimeout(function () {
            the._autoheight.resize.call(the._autoheight);
        }, 60);
    };


    /**
     * 按键回调
     * @param eve
     * @private
     */
    pro._onkeydown = function (eve) {
        var the = this;
        var options = the._options;
        var $ele = the._$ele;
        var keyCode = eve.keyCode;
        var isShift = eve.shiftKey;
        var isCtrl = eve.ctrlKey;
        var isMetaKey = eve.metaKey;

        // shift + tab
        if (isShift && keyCode === 9) {
            editor.shiftTab($ele, options.tabSize);
            the._pushHistory();
            eve.preventDefault();
        }
        // tab
        else if (keyCode === 9) {
            the.insert(editor.repeatString(' ', options.tabSize));
            the._pushHistory();
            eve.preventDefault();
        }
        // ctrl/meta + z
        else if ((isCtrl || isMetaKey) && keyCode === 90) {
            the._savePos();
            the._historyIndex = the._historyIndex === -1 ?
                (the._history.length >= 2 ? the._history.length - 2 : 0) :
                (the._historyIndex >= 1 ? the._historyIndex - 1 : 0);
            $ele.value = the._history.length > 1 ? the._history[the._historyIndex] : '';
            the._restorePos();
            eve.preventDefault();
        }
        // ctrl + r / meta + shift + z
        else if (isCtrl && keyCode === 82 || isMetaKey && isShift && keyCode === 90) {
            if (the._history.length > the._historyIndex + 1) {
                the._savePos();
                the._historyIndex += 1;
                $ele.value = the._history[the._historyIndex];
                the._restorePos();
            }

            eve.preventDefault();
        }
    };


    /**
     * 输入回调
     * @private
     */
    pro._oninput = function () {
        var the = this;

        the._pushHistory();
        // 历史记录点复位
        the._historyIndex = -1;
    };


    /**
     * 解析拖拽、粘贴里的图片信息
     * @param items
     * @private
     */
    pro._parseImgList = function (eve, items) {
        var the = this;

        the._uploadList = [];
        dato.each(items, function (index, item) {
            var file;

            if (RE_IMG_TYPE.test(item.type) && item.kind === 'file') {
                file = item.getAsFile();

                if (file && file.size > 0) {
                    the._uploadList.push({
                        url: window.URL.createObjectURL(item.getAsFile()),
                        file: item.getAsFile()
                    });
                }
            }
        });

        if (the._uploadList.length) {
            eve.preventDefault();
            the._$ele.blur();
            the._uploadDialog();
        } else if (eve.dataTransfer && eve.dataTransfer.files && eve.dataTransfer.files.length ||
            eve.clipboardData && eve.clipboardData.files && eve.clipboardData.files.length) {
            eve.preventDefault();
            return new Msg({
                content: '请拖拽或粘贴图片文件',
                buttons: ['确定']
            });
        }
    };


    /**
     * 拖拽回调
     * @private
     */
    pro._ondrop = function (eve) {
        this._parseImgList(eve, eve.dataTransfer && eve.dataTransfer.items);
    };


    /**
     * 粘贴回调
     * @param eve
     * @private
     */
    pro._onpaste = function (eve) {
        this._parseImgList(eve, eve.clipboardData && eve.clipboardData.items);
    };


    /**
     * 手动设置编辑器内容
     * @param value {String} 待覆盖的字符串
     */
    pro.setContent = function (value) {
        var the = this;
        the._$ele.value = value;
        the._pushHistory();
        the._autoheight.resize();

        return the;
    };


    /**
     * 当前位置插入字符串
     * @param string {String} 待插入字符串
     *
     * @example
     * editor.insert('hehe');
     */
    pro.insert = function (string) {
        var the = this;

        editor.insert(this._$ele, string);
        the._pushHistory();

        return the;
    };


    /**
     * 聚焦
     */
    pro.focus = function () {
        this._$ele.focus();
    };


    /**
     * 失焦
     */
    pro.blur = function () {
        this._$ele.blur();
    };


    /**
     * 获得当前编辑器内容
     * @returns {*} {String} 当前编辑器内容
     */
    pro.getContent = function () {
        return this._$ele.value;
    };


    /**
     * 历史入栈
     * @private
     */
    pro._pushHistory = function () {
        var the = this;
        var options = the._options;
        var history = the._history;
        var now = the._$ele.value;

        // 如果与最后一次相同，则取消入栈历史记录
        if (history.length && history[history.length - 1] === now) {
            return;
        }

        if (history.length >= options.historyLength) {
            the._shiftHistory();
        }

        history.push(now);
        the._saveLocal();

        /**
         * 编辑器内容变化之后
         * @event change
         * @param value {String} 变化之后的内容
         */
        the.emit('change', now);
    };


    /**
     * 历史出栈
     * @private
     */
    pro._shiftHistory = function () {
        this._history.shift();
    };


    /**
     * 保存光标记录
     * @private
     */
    pro._savePos = function () {
        var the = this;
        var $ele = the._$ele;
        the._selection = editor.getPos($ele);
    };


    /**
     * 恢复光标记录
     * @private
     */
    pro._restorePos = function () {
        var the = this;
        var $ele = the._$ele;

        editor.setPos($ele, [the._selection]);
    };


    /**
     * 清除本地备份记录
     */
    pro.clearStore = function () {
        var the = this;

        window.localStorage.setItem(the._storeId, '');

        return the;
    };


    /**
     * 重置尺寸
     */
    pro.resize = function () {
        var the = this;

        controller.nextTick(the._autoheight.resize, the._autoheight);
    };

    /**
     * 销毁实例
     */
    pro.destroy = function () {
        var the = this;

        event.un(the._$ele, 'keydown', the._onkeydown);
        event.un(the._$ele, 'input', the._oninput);
        event.un(the._$ele, 'drop', the._ondrop);
        event.un(the._$ele, 'paste', the._onpaste);
        the._autoheight.destroy();
        modification.unwrap(the._$ele, 'div>div');
    };


    modification.importStyle(style);

    /**
     * 实例化一个 markdown 文本编辑器
     * @param $ele {HTMLTextAreaElement} 文本域输入框
     * @param [options] {Object} 配置
     * @param [options.tabSize=4] {Number} tab长度，默认为4个空格
     * @param [options.historyLength=20] {Number} 历史长度，默认为20
     *
     * @example
     * // 推荐使用ID来标识文本域输入框，因为会根据id来保存文本内容到本地的，当多个编辑器在同一个页面时尤为重要
     * var editor = new Editor('#id');
     */
    module.exports = Editor;
});