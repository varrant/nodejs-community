/*!
 * 开发者主页
 * @author ydr.me
 * @create 2014-12-13 23:25
 */


define(function (require, exports, module) {
    "use strict";

    require('../../widget/front/login.js');
    require('../../widget/front/nav.js');
    require('../../widget/front/footer.js');
    require('../../widget/common/share.js');
    require('../../widget/common/follow.js');

    var app = {};
    var Pager = require('../../alien/ui/Pager/');
    var selector = require('../../alien/core/dom/selector.js');
    var Template = require('../../alien/libs/Template.js');
    var dato = require('../../alien/utils/dato.js');
    var win = window;
    var winPage = win['-page-'];
    var winTa = win['-ta-'];
    var repos = require('../../widget/front/repos.js');
    var ajax = require('../../widget/common/ajax.js');


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
            page: winPage.page,
            max: Math.ceil(winPage.count / winPage.limit)
        });
        var getList = function (url) {
            ajax({
                url: url
            }).on('success', function (data) {
                $body.innerHTML = tpl.render(data);
                //dato.extend(pager, data.pager);
                //pager.max = Math.ceil(pager.count / pager.limit);
                //app.options.page = data.pager.page;
                //app.page.render({
                //    page: pager.page,
                //    max: Math.ceil(pager.count / pager.limit)
                //});
                //
                //history.pushState({
                //    url: url
                //}, data.title, url);
                //animation.scrollTo(window, {
                //    y: attribute.top($body) - 60
                //});
            });
        };

        pager.on('change', function (page) {
            location.href = path + 'page/' + page + '/';
        });
    };

    app.repos();
    app.page();
});