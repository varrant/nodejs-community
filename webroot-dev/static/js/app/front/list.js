/*!
 * 首页
 * @author ydr.me
 * @create 2014-12-13 23:25
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/front/login.js');
    require('../../widget/front/nav.js');
    require('../../widget/front/footer.js');

    var Template = require('../../alien/libs/Template.js');
    var Pager = require('../../alien/ui/Pager/');
    var selector = require('../../alien/core/dom/selector.js');
    var animation = require('../../alien/core/dom/animation.js');
    var dato = require('../../alien/utils/dato.js');
    var event = require('../../alien/core/event/touch.js');
    var share = require('../../widget/common/share.js');
    var ajax = require('../../widget/common/ajax.js');
    var pager = window['-pager-'];
    var app = {};
    var section = window['-section-'];
    var $body = selector.query('#body')[0];
    var template = selector.query('#template')[0].innerHTML;
    var tpl = new Template(template);
    var beginURL = location.href;


    /**
     * 获取当前 path 信息
     */
    app.getPath = function () {
        var path = location.pathname;
        var get = function (key) {
            var reg = new RegExp('\\/' + key + '\\/([^/]+)\\/', 'i');
            var ret = path.match(reg);

            return ret ? ret[1] : null;
        };

        app.options = {
            in: get('in'),
            at: get('at'),
            on: get('on'),
            as: get('as'),
            by: get('by'),
            page: get('page') || 1
        };
    };


    /**
     * 根据信息构建 path
     */
    app.buildPath = function () {
        var filterArr = ['in', 'at', 'on', 'as', 'by', 'page'];
        var pathArr = [];

        if (section && section.uri) {
            pathArr.push(section.uri);
        }

        filterArr.forEach(function (item) {
            if (app.options[item]) {
                pathArr.push(item + '/' + app.options[item]);
            }
        });

        return '/' + pathArr.join('/') + '/';
    };


    /**
     * 翻页器
     */
    app.buildPager = function () {
        if (pager.max) {
            app.page = new Pager('#pager', pager);

            app.page.on('change', function (page) {
                app.options.page = page;
                app.pjax(app.buildPath());
            });
        }
    };


    // pjax
    /**
     * pjax
     * @param url {String} 打开的 url
     * @param [isNotChangeURL=false] {Boolean} 是否改变 url
     */
    app.pjax = function (url, isNotChangeURL) {
        ajax({
            url: url
        }).on('success', function (data) {
            $body.innerHTML = tpl.render(data);
            dato.extend(pager, data.pager);
            pager.max = Math.ceil(pager.count / pager.limit);
            app.options.page = data.pager.page;
            app.page.render({
                page: pager.page
            });

            if (!isNotChangeURL) {
                history.pushState({
                    url: url
                }, data.title, url);
            }

            app.getPath();
            animation.scrollTo(window, {
                y: $body
            });
        });
    };


    // 构建 pjax
    app.buildPjax = function () {
        event.on($body, 'click', '.choose a', function () {
            app.pjax(this.href);

            return false;
        });

        event.on(window, 'popstate', function () {
            var state = history.state;

            app.pjax(state && state.url || beginURL, true);
        });
    };


    share('#share');
    app.getPath();
    app.buildPager();
    app.buildPjax();
});