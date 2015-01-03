/*!
 * 首页
 * @author ydr.me
 * @create 2014-12-13 23:25
 */


define(function (require, exports, module) {
    require('../../widget/front/login.js');
    require('../../widget/front/nav.js');

    var Pager = require('../../alien/ui/Pager/');
    var pager = window['-pager-'];
    var app = {};
    var section = window['-section-'];
    var paths = [{
        uri: 'in',
        value: null
    }, {}];

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
            page: get('page') || 1
        };
    };


    /**
     * 根据信息构建 path
     */
    app.buildPath = function () {
        var array1 = ['in', 'at', 'on', 'as', 'page'];
        var array2 = [section];

        array1.forEach(function (item) {
            if (app.options[item]) {
                array2.push(item + '/' + app.options[item]);
            }
        });

        return '/' + array2.join('/') + '/';
    };


    /**
     * 翻页器
     */
    app.buildPager = function () {
        if (pager.max) {
            var pg = new Pager('#pager', pager);

            pg.on('change', function (page) {
                app.options.page = page;
                history.pushState({}, '', app.buildPath());
            });
        }
    };


    app.getPath();
    app.buildPager();
});