/*!
 * 首页
 * @author ydr.me
 * @create 2014-12-13 23:25
 */


define(function (require, exports, module) {
    'use strict';

    require('../../modules/front/login.js');
    require('../../modules/front/nav.js');
    require('../../modules/front/footer.js');
    require('../../modules/common/share.js');

    var Template = require('../../alien/libs/template.js');
    var Pagination = require('../../alien/ui/pagination/index.js');
    var selector = require('../../alien/core/dom/selector.js');
    var animation = require('../../alien/core/dom/animation.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var dato = require('../../alien/utils/dato.js');
    var random = require('../../alien/utils/random.js');
    var event = require('../../alien/core/event/touch.js');
    var ajax = require('../../modules/common/ajax.js');
    var pager = window['-pager-'];
    var app = {};
    var section = window['-section-'];
    var $body = selector.query('#body')[0];
    var template = selector.query('#template')[0].innerHTML;
    var tpl = new Template(template);
    //var beginURL = location.href;

    //Template.config({
    //    debug: true
    //});

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
            var $pager = selector.query('#pager')[0];

            if (!$pager) {
                return;
            }

            app.page = new Pagination('#pager', pager);

            app.page.on('change', function (page) {
                app.options.page = page;

                var url = app.buildPath();

                history.replaceState({
                    url: url
                }, '', url);
                app.pjax(url);
            });
        }
    };


    // pjax
    app.pjax = function (url) {
        ajax({
            url: url
        }).on('success', function (data) {
            $body.innerHTML = tpl.render(data);
            dato.extend(pager, data.pager);
            pager.max = Math.ceil(pager.count / pager.limit);
            app.options.page = data.pager.page;
            app.page.render({
                page: pager.page,
                max: Math.ceil(pager.count / pager.limit)
            });
            app.getPath();
            animation.scrollTo(window, {
                y: attribute.top($body) - 60
            });
        });
    };


    // 构建 pjax
    app.buildPjax = function () {
        event.on($body, 'click', '.choose a', function () {
            var url = this.href;

            history.pushState({
                url: url
            }, '', url);
            app.pjax(url);

            return false;
        });

        event.on(window, 'popstate', function () {
            var state = history.state;

            if (state && state.url) {
                app.pjax(state.url);
            }
        });
    };


    //app.cover = function () {
    //    var $cover = selector.query('#cover')[0];
    //
    //    if (!$cover) {
    //        return;
    //    }
    //
    //    var url = 'http://img.infinitynewtab.com/randomBlur/' + random.number(1, 4050) + '.jpg';
    //    var img = new Image();
    //
    //    img.src = url;
    //    img.onload = function () {
    //        attribute.css($cover, 'background', 'url("' + url + '") center/cover no-repeat');
    //        attribute.addClass($cover.parentNode, 'active');
    //    };
    //};

    app.getPath();
    app.buildPager();
    app.buildPjax();
    //app.cover();
});