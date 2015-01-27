/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:04
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../../../alien/ui/base.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var attribute = require('../../../alien/core/dom/attribute.js');
    var animation = require('../../../alien/core/dom/animation.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/util/dato.js');
    var qs = require('../../../alien/util/querystring.js');
    var ajax = require('../ajax.js');
    var alert = require('../alert.js');
    var confirm = require('../confirm.js');
    var Pager = require('../../../alien/ui/Pager/');
    var Respond = require('../Respond/index');
    var Template = require('../../../alien/libs/Template.js');
    var templateWrap = require('html!./wrap.html');
    var templateContainer = require('html!./container.html');
    var templateList = require('html!./list.html');
    var style = require('css!./style.css');
    var tplWrap = new Template(templateWrap);
    var tplContainer = new Template(templateContainer);
    var tplList = new Template(templateList);
    var alienClass = 'alien-ui-response';
    var defaults = {
        loading: '<div class="alien-ui-response-loading"><div class="f-loading">加载中……</div></div>',
        url: {
            list: '/api/response/list/',
            post: '/admin/api/response/',
            count: '/api/response/count/',
            agree: '/admin/api/response/agree/',
            accept: '/admin/api/object/accept/'
        },
        language: {
            comment: '评论',
            reply: '回复'
        },
        count: {
            comment: 0,
            reply: 0
        },
        query: {
            object: '',
            limit: 10,
            page: 1
        },
        respond: {
            githubLogin: '#',
            placeholder: '期待你的回答',
            markdownHelp: {
                link: '/help/markdown.html',
                text: 'markdown 编辑器使用帮助'
            },
            avatar: '/static/img/avatar.png',
            uploadCallback: function (list, onprogress, ondone) {
                var fd = new FormData();
                var the = this;

                // key, val, name
                fd.append('img', list[0].file, 'img.png');

                ajax({
                    url: '/admin/api/oss/',
                    method: 'put',
                    data: fd
                })
                    .on('progress', function (eve) {
                        onprogress(eve.alienDetail.percent);
                    })
                    .on('success', function (json) {
                        if (json.code !== 200) {
                            the.uploadDestroy();
                            return alert(json);
                        }

                        //cacheControl: "max-age=315360000"
                        //contentType: "image/png"
                        //encoding: "utf8"
                        //image: {type: "png", width: 200, height: 200}
                        //ourl: "http://s-ydr-me.oss-cn-hangzhou.aliyuncs.com/f/i/20141228233411750487888485"
                        //surl: "http://s.ydr.me/f/i/20141228233411750487888485"
                        var data = json.data;
                        ondone(null, [{
                            name: "img.png",
                            url: data.surl
                        }]);
                    })
                    .on('error', function (err) {
                        the.uploadDestroy();
                        alert(err);
                    });
            }
        },
        sync: {
            commentByCountClass: 'j-comment-by-count',
            replyByCountClass: 'j-reply-by-count'
        },
        acceptByResponse: '',
        list: {
            canAccept: false
        }
    };
    var Response = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._options = dato.extend(true, {}, defaults, options);
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

            the._replyMap = {};
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
            var commentByCountClass = options.sync.commentByCountClass;
            var replyByCountClass = options.sync.replyByCountClass;
            var data = {
                count: options.count,
                language: options.language,
                commentByCountClass: commentByCountClass,
                replyByCountClass: replyByCountClass
            };
            the._renderContainer(data);
            the._pagerOptions = {
                page: options.query.page,
                max: Math.ceil(options.count.comment / options.query.limit)
            };
            the._count = options.count;

            var nodes = selector.query('.j-flag', the._$wrap);

            the._$respondParent = nodes[0];
            the._$listParent = nodes[1];
            the._$paginationParent = nodes[2];
            the._$commentByCount = selector.query('.' + commentByCountClass);
            the._$replyByCount = selector.query('.' + replyByCountClass);
            the._ajaxComment();
            the._initEvent();
            the._increaseCount();

        },


        /**
         * 渲染容器
         * @param [data]
         * @private
         */
        _renderContainer: function (data) {
            var the = this;
            var html;

            if (data) {
                html = tplContainer.render(data);
            } else {
                html = the._options.loading;
            }

            the._$wrap.innerHTML = html;
        },


        /**
         * 初始化响应框
         * @params $respondParent {Object} 编辑框父级
         * @params $listParent {Object} 列表父级
         * @params [$replyNumberBtn] {Object} 回复数字按钮
         * @private
         */
        _initRespond: function ($respondParent, $listParent, $replyNumberBtn) {
            var the = this;
            var options = the._options;
            var respond;

            if (options.respond) {
                var respondOptions = dato.extend({}, options.respond, options.language);

                if ($replyNumberBtn) {
                    respondOptions.icon = 'reply';
                }

                respond = new Respond($respondParent, respondOptions);
                respond.on('submit', function (content) {
                    respond.disable();

                    the._post(content, this._replyParentId, function (err, data) {
                        respond.enable();

                        if (!err) {
                            respond.reset();
                            the._appendItem($listParent, data);

                            if ($replyNumberBtn) {
                                the._increaseHTML($replyNumberBtn, 1);
                            }
                        }
                    });
                });
            }

            return respond;
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var replyClass = '.' + alienClass + '-reply';
            var agreeClass = '.' + alienClass + '-agree';
            var acceptClass = '.' + alienClass + '-accept';
            var $parent = the._$listParent;

            event.on($parent, 'click', replyClass, the._reply.bind(the));
            event.on($parent, 'click', agreeClass, the._agree.bind(the));
            event.on($parent, 'click', acceptClass, function (eve) {
                confirm('确定要采纳该回答为最佳答案吗？采纳后无法取消和更改。', the._accept.bind(the, eve));
            });
        },


        /**
         * 定点滚动
         * @param $target
         * @private
         */
        _scrollTo: function ($target, callback) {
            var top = attribute.top($target);

            animation.scrollTo(window, {
                y: top - 70
            }, {
                duration: 123
            }, callback);
        },


        /**
         * 初始化主评论
         * @private
         */
        _ajaxComment: function () {
            var the = this;
            var options = the._options;
            var url = options.url.list + '?' + qs.stringify(options.query);

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            the._isAjaxing = true;

            the._renderComment();
            ajax({
                url: url
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    var data = json.data;

                    the._count.comment = data.count;

                    // 渲染分页
                    if (the._pager) {
                        the._pager.render({
                            page: options.query.page,
                            max: Math.ceil(the._count.comment / options.query.limit)
                        });
                        the._destroyReply();
                    }

                    the._renderComment(dato.extend({
                        list: data.list
                    }, options.list, {
                        type: 'comment'
                    }));

                    if (!the._readyComment) {
                        the._readyComment = true;
                        the._initRespond(the._$respondParent, the._$listParent);
                        the._pager = new Pager(the._$paginationParent, the._pagerOptions);
                        the._pager.on('change', function (page) {
                            the.changePage(page);
                            the.emit('page', page);
                        });
                    }
                })
                .on('error', alert)
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 改变当前分页
         * @param page
         */
        changePage: function (page) {
            var the = this;

            page = dato.parseInt(page, 1);

            if (the._options.query.page === page) {
                return;
            }

            the._scrollTo(the._$listParent);
            the._options.query.page = page;
            the._ajaxComment();
        },


        _ajaxFinish: function () {
            this._isAjaxing = false;
        },


        /**
         * 渲染评论、回复列表
         * @param [data]
         * @private
         */
        _renderComment: function (data) {
            var the = this;
            var html;

            if (data) {
                html = tplList.render(data);
            } else {
                html = '<li>' + the._options.loading + '</li>';
            }

            the._$listParent.innerHTML = html;
        },


        /**
         * 获取当前 response 的 ID
         * @param $node
         * @returns {*}
         * @private
         */
        _getResponseId: function ($node) {
            var itemClass = '.' + alienClass + '-item';
            var $item = selector.closest($node, itemClass)[0];

            return attribute.data($item, 'id');
        },


        /**
         * 提交评论/回复
         * @param content
         * @param callback
         * @private
         */
        _post: function (content, parentId, callback) {
            var the = this;
            var options = the._options;
            var data = {
                content: content,
                object: options.query.object
            };

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            the._isAjaxing = true;

            if (parentId) {
                data.parent = parentId;
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

                    var data = json.data;

                    data.author = options.list.developer;

                    if (json.data.parent) {
                        the._count.reply++;
                    } else {
                        the._count.comment++;
                    }

                    the._increaseCount();
                    callback(null, data);
                })
                .on('error', function (err) {
                    callback(err);
                    alert(err);
                })
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 改变评论数量显示
         * @private
         */
        _increaseCount: function () {
            var the = this;
            var count = the._count;

            the._$commentByCount.forEach(function ($node) {
                $node.innerHTML = count.comment;
            });

            the._$replyByCount.forEach(function ($node) {
                $node.innerHTML = count.reply;
            });
        },


        /**
         * 动态追加项目
         * @api
         */
        _appendItem: function ($parent, data) {
            var the = this;
            var html = tplList.render(dato.extend({
                list: [data]
            }, the._options.list));
            var node = modification.parse(html)[0];
            var $findLoadingItem = selector.query('.' + alienClass + '-loading', $parent)[0];

            if ($findLoadingItem) {
                $parent.innerHTML = '';
            }

            modification.insert(node, $parent, 'beforeend');
            the._scrollTo(node, function () {
                attribute.addClass(node, alienClass + '-item-new');
                //setTimeout(function () {
                //    if (node) {
                //        attribute.removeClass(node, alienClass + '-item-new');
                //    }
                //}, 1000);
            });
        },


        /**
         * 增加数字
         * @param $node
         * @param count
         * @param [isToCount]
         * @private
         */
        _increaseHTML: function ($node, count, isToCount) {
            var $number = selector.query('.' + alienClass + '-number', $node)[0];
            var neo = 0;

            if (isToCount) {
                neo = count;
            } else {
                neo = dato.parseInt($number.innerHTML, 0) + count;
            }

            $number.innerHTML = neo;
        },


        /**
         * 翻页之后销毁回复实例
         * @private
         */
        _destroyReply: function () {
            var the = this;

            dato.each(the._replyMap, function (id, item) {
                if (item.respond) {
                    item.respond.destroy();
                }

                if (item.pager) {
                    item.pager.destroy();
                }
            });

            the._replyMap = {};
        },


        /**
         * 回复
         * @private
         */
        _reply: function (eve) {
            var the = this;
            var id = the._getResponseId(eve.target);
            var $btn = selector.closest(eve.target, 'button')[0];

            the._replyMap[id] = the._replyMap[id] || {};

            if (the._replyMap[id].isOpen) {
                the._replyMap[id].isOpen = false;
                the._toggleReply($btn, id, false);
            } else {
                the._replyMap[id].isOpen = true;
                the._toggleReply($btn, id, true);
            }
        },


        /**
         * 切换评论的收起与展开
         * @param $btn
         * @param id
         * @param boolean {Boolean} 是否展开
         * @private
         */
        _toggleReply: function ($btn, id, boolean) {
            var the = this;
            var $li = selector.query('#response-' + id)[0];

            if (!$li) {
                return;
            }

            if (boolean) {
                attribute.addClass($li, alienClass + '-active');

                if (!the._replyMap || !the._replyMap[id] || !the._replyMap[id].respond) {
                    the._ajaxReply($btn, $li, id);
                }
            } else {
                attribute.removeClass($li, alienClass + '-active');
            }
        },


        /**
         * 加载回复
         * @param $li
         * @param id
         * @private
         */
        _ajaxReply: function ($btn, $li, id) {
            var the = this;
            var options = the._options;
            var $children = selector.query('.' + alienClass + '-children', $li)[0];

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            var $listParent;
            var $contentParent;
            var $pagerParent;

            // 第 2+ 次加载
            if (the._replyMap[id].$listParent) {
                $listParent = the._replyMap[id].$listParent;
                $pagerParent = the._replyMap[id].$pagerParent;
                $contentParent = the._replyMap[id].$contentParent;
            }
            // 首次加载
            else {
                var nodes = selector.query('.j-flag', $children);
                the._replyMap[id].query = {
                    page: 1
                };
                $listParent = the._replyMap[id].$listParent = nodes[0];
                $pagerParent = the._replyMap[id].$pagerParent = nodes[1];
                $contentParent = the._replyMap[id].$contentParent = nodes[2];
            }

            the._renderReply($listParent);

            var query = dato.extend({
                parent: id
            }, options.query, the._replyMap[id].query);

            ajax({
                url: options.url.list + '?' + qs.stringify(query)
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    var data = json.data;

                    the._renderReply($listParent, dato.extend({
                        list: data.list
                    }, options.list, {
                        type: 'reply'
                    }));

                    the._increaseHTML($btn, data.count, true);

                    if (!the._replyMap[id].pager) {
                        the._replyMap[id].pager = new Pager($pagerParent, {
                            page: 1,
                            max: Math.ceil(data.count / options.query.limit)
                        }).on('change', function (page) {
                                the._scrollTo($listParent);
                                the._replyMap[id].query.page = page;
                                the._ajaxReply($btn, $li, id);
                                this.render({
                                    page: page,
                                    max: Math.ceil(data.count / options.query.limit)
                                });
                            });
                        the._replyMap[id].respond = the._initRespond($contentParent, $listParent, $btn) || {};
                        the._replyMap[id].respond._replyParentId = id;
                    }
                })
                .on('error', alert)
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 渲染回复
         * @param $children
         * @param [data]
         * @private
         */
        _renderReply: function ($children, data) {
            var the = this;
            var html;

            if (data) {
                html = tplList.render(data);
            } else {
                html = the._options.loading;
            }

            $children.innerHTML = html;
        },


        /**
         * 赞同
         * @private
         */
        _agree: function (eve) {
            var the = this;
            var $ele = selector.closest(eve.target, 'button')[0];
            var id = the._getResponseId($ele);

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            the._isAjaxing = true;
            ajax({
                url: the._options.url.agree,
                method: 'post',
                data: {
                    id: id
                }
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    the._increaseHTML($ele, json.data);
                })
                .on('error', alert)
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 采纳
         * @private
         */
        _accept: function (eve) {
            var the = this;
            var options = the._options;
            var $ele = eve.target;
            var id = the._getResponseId($ele);

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            ajax({
                url: options.url.accept,
                method: 'post',
                data: {
                    response: id,
                    object: options.query.object
                }
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    options.acceptByResponse = id;
                    options.list.object.acceptByResponse = id;
                    the._acceptItem(id);
                    the.emit('accept');
                })
                .on('error', alert)
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 设置/取消 item 为最佳
         * @param itemId
         * @private
         */
        _acceptItem: function (itemId) {
            var $item = selector.query('#response-' + itemId)[0];

            if (!$item) {
                return;
            }

            attribute.addClass($item, alienClass + '-item-accepted');

            var liSelector = '.' + alienClass + '-accept-li';
            var $li = selector.query(liSelector, $item)[0];

            if (!$li) {
                return;
            }

            var $btn = selector.children($li)[0];

            attribute.removeClass($btn, 'btn-warning');
            attribute.addClass($btn, 'btn-success active');
            $btn.innerHTML = '<i class="i i-check"></i>已被采纳';

            var $siblings = selector.siblings($item);

            $siblings.forEach(function ($item) {
                var $li = selector.query(liSelector, $item)[0];

                modification.remove($li);
            });
        }
    });

    require('../Template-filter.js');
    modification.importStyle(style);
    module.exports = Response;
});