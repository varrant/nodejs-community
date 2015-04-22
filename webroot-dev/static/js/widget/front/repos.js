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
    var template = require('html!./repos.html');
    var tpl = new Template(template);

    module.exports = function (ta, $container) {
        var url = 'https://api.github.com/users/' + ta.githubLogin + '/repos?callback=?';

        $container = selector.query($container)[0];

        if (!$container) {
            return;
        }

        jsonp({
            url: url
        }).on('success', function (json) {
            var list = json && json.data || [];

            dato.each(list, function (index, item) {
                html+='<li></li>';
            });
        });
    };
});