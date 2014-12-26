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
    var qs = require('../../../alien/util/querystring.js');
    var ajax = require('../../../widget/common/ajax.js');
    var alert = require('../../../widget/common/alert.js');
    var loading = require('../../../widget/common/loading.js');
    var Pagination = require('../../../alien/ui/Pagination/');
    var Respond = require('../Respond/');
    var Template = require('../../../alien/libs/Template.js');
    var templateWrap = require('html!./wrap.html');
    var templateContainer = require('html!./container.html');
    var templateList = require('html!./list.html');
    var style = require('css!./style.css');
    var tplWrap = new Template(templateWrap);
    var tplContainer = new Template(templateContainer);
    var tplList = new Template(templateList);
    var defaults = {
        url: {
            // get/post
            get: '/api/response/',
            post: '/api/response/',
            count: '/api/response/count/'
        },
        language: {
            comment: '评论',
            reply: '回复'
        },
        query: {
            object: '',
            limit: 10,
            page: 1
        },
        respond: {
            placeholder: '期待你的回答',
            link: '#',
            text: 'markdown 编辑器使用帮助',
            avatar: '/static/img/avatar.png'
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
            var the = this;
            var $parent = the._$parent;
            var html = tplWrap.render({
                language: the._options.language
            });

            $parent.innerHTML = html;
            the._$wrap = selector.children($parent)[0];
            the._ajaxContainer();
        },


        /**
         * 初始化容器
         * @private
         */
        _ajaxContainer: function () {
            var the = this;
            var options = the._options;
            var url = options.url.count + '?' + qs.stringify(options.query);
            var ld = loading('正在加载中……');

            ajax({
                url: url
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    var data = {
                        count: json.data,
                        language: options.language
                    };
                    the._renderContainer(data);
                    the._paginationOptions = {
                        page: options.query.page,
                        max: Math.ceil(json.data.comment / options.query.limit)
                    };
                    the._count = json.data;

                    var nodes = selector.query('.j-flag', the._$wrap);

                    the._$commentCount = nodes[0];
                    the._$replyCount = nodes[1];
                    the._$respondParent = nodes[2];
                    the._$listParent = nodes[3];
                    the._$paginationParent = nodes[4];
                    the._getComment();
                })
                .on('error', alert)
                .on('finish', ld.destroy.bind(ld));
        },


        /**
         * 渲染容器
         * @param data
         * @private
         */
        _renderContainer: function (data) {
            var the = this;
            var html = tplContainer.render(data);

            the._$wrap.innerHTML = html;
        },


        /**
         * 初始化响应框
         * @private
         */
        _initRespond: function () {
            var the = this;
            var options = the._options;
            var data = dato.extend({}, options.respond, options.language);

            the._respondComment = new Respond(the._$respondParent, data);
            the._respondComment.on('submit', function (content) {
                the._respondComment.disable();
                the._post(content, function (err) {
                    the._respondComment.enable();

                    if (!err) {
                        the._respondComment.reset();
                    }
                });
            });
        },


        /**
         * 获取评论
         * @private
         */
        _getComment: function () {
            var the = this;

            if (!the._readyComment) {
                the._readyComment = true;
                the._initRespond();
                the._pagination = new Pagination(the._$paginationParent, the._paginationOptions);
                the._pagination.on('change', function (page) {
                    the._options.query.page = page;
                    the._getComment();
                });
            }

            the._ajaxComment();
        },


        /**
         * 初始化主评论
         * @private
         */
        _ajaxComment: function () {
            var the = this;
            var options = the._options;
            var url = options.url.get + '?' + qs.stringify(options.query);

            ajax({
                url: url
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    the._renderList({
                        list: json.data
                    });

                    // 渲染分页
                    if (the._pagination) {
                        the._pagination.render({
                            page: options.query.page,
                            max: Math.ceil(the._count.comment / options.query.limit)
                        });
                    }
                })
                .on('error', alert);
        },

        /**
         * 渲染评论、回复列表
         * @param data
         * @private
         */
        _renderList: function (data) {
            var the = this;
            var html = tplList.render(data);

            the._$listParent.innerHTML = html;
        },


        /**
         * 提交评论/回复
         * @param content
         * @param callback
         * @private
         */
        _post: function (content, callback) {
            var the = this;
            var options = the._options;
            var data = {
                content: content,
                object: options.query.object
            };

            if (the._replyParent) {
                data.parent = the._replyParent;
            }

            ajax({
                url: options.url.post,
                method: 'post',
                data: data
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        callback(new Error(json.message));
                        return alert(json);
                    }

                    the._appendComment(json.data);

                    if (json.data.parent) {
                        the._count.reply++;
                    } else {
                        the._count.comment++;
                    }

                    the._increaseCount();
                    callback();
                })
                .on('error', function (err) {
                    callback(err);
                    alert(err);
                });
        },


        /**
         * 改变评论数量显示
         * @private
         */
        _increaseCount: function () {
            var the = this;
            var count = the._count;

            the._$commentCount.innerHTML = count.comment;
            the._$replyCount.innerHTML = count.reply;
        },


        /**
         * 动态追加评论
         * @api
         */
        _appendComment: function (data) {
            var the = this;
            var html = tplList.render({
                list: [data]
            });
            var node = modification.parse(html)[0];

            modification.insert(node, the._$listParent, 'beforeend');
        },


        /**
         * 追加回复
         * @param $parent
         * @param data
         * @private
         */
        _appendReply: function ($parent, data) {
            var the = this;
            var html = tplList.render(data);
            var node = modification.parse(html)[0];

            modification.insert(node, $parent, 'beforeend');
        }
    });

    modification.importStyle(style);
    module.exports = Response;
});