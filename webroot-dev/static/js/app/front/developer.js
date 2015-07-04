/*!
 * 开发者主页
 * @author ydr.me
 * @create 2014-12-13 23:25
 */


define(function (require, exports, module) {
    "use strict";

    require('../../modules/front/login.js');
    require('../../modules/front/nav.js');
    require('../../modules/front/footer.js');
    require('../../modules/common/share.js');
    require('../../modules/common/follow.js');

    var app = {};
    var Pager = require('../../alien/ui/Pager/');
    var selector = require('../../alien/core/dom/selector.js');
    var animation = require('../../alien/core/dom/animation.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var event = require('../../alien/core/event/base.js');
    var Template = require('../../alien/libs/Template.js');
    var dato = require('../../alien/utils/dato.js');
    var win = window;
    var winPager = win['-pager-'];
    var winTa = win['-ta-'];
    var repos = require('../../modules/front/repos.js');
    var ajax = require('../../modules/common/ajax.js');


    // github repos
    app.repos = function () {
        repos(winTa, '#githubRepos');
    };


    // 分页
    app.page = function () {
        var $pager = selector.query('#pager')[0];

        if (!$pager) {
            return;
        }

        var $body = selector.query('#body')[0];
        var template = selector.query('#template')[0].innerHTML;
        var tpl = new Template(template);
        var path = location.pathname.replace(/page\/.*$/, '');
        var pager = new Pager($pager, {
            page: winPager.page,
            max: Math.ceil(winPager.count / winPager.limit)
        });
        var getList = function (url) {
            ajax({
                url: url
            }).on('success', function (data) {
                $body.innerHTML = tpl.render(data);
                dato.extend(winPager, data.pager);
                winPager.max = Math.ceil(winPager.count / winPager.limit);
                pager.render({
                    page: winPager.page,
                    max: Math.ceil(winPager.count / winPager.limit)
                });
                animation.scrollTo(window, {
                    y: attribute.top($body) - 60
                });
            });
        };

        pager.on('change', function (page) {
            var url = path + 'page/' + page + '/';
            history.replaceState({
                url: url
            }, '', url);
            getList(url);
        });

        event.on(window, 'popstate', function () {
            var state = history.state;

            if (state && state.url) {
                getList(state.url);
            }
        });
    };

    app.repos();
    app.page();
});