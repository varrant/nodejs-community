/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-04-22 16:36
 */


define(function (require, exports, module) {
    /**
     * @module parent/repos
     */
    'use strict';

    var jsonp = require('../../alien/core/communication/jsonp.js');
    var selector = require('../../alien/core/dom/selector.js');
    var Template = require('../../alien/libs/Template.js');
    var dato = require('../../alien/utils/dato.js');
    var date = require('../../alien/utils/date.js');
    var template = require('./repos.html', 'html');
    var tpl = new Template(template);

    module.exports = function (ta, $container) {
        var url = 'https://api.github.com/users/' + ta.githubLogin + '/repos?callback=?';

        $container = selector.query($container)[0];

        if (!$container) {
            return;
        }

        jsonp({
            url: url,
            query: {
                per_page: 200
            }
        }).on('success', function (json) {
            var list = json && json.data || [];

            list.forEach(function (item) {
                item.createFrom = date.from(new Date(item.created_at));
                item.updatedFrom = date.from(new Date(item.pushed_at));
            });

            list.sort(function (a, b) {
                return b.stargazers_count - a.stargazers_count;
            });

            $container.innerHTML = tpl.render({
                list: list
            });
        }).on('error', function () {
            $container.innerHTML = tpl.render({
                list: []
            });
        });
    };
});