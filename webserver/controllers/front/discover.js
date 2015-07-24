/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-07-24 20:00
 */


'use strict';

module.exports = function (app) {
    var exports = {};

    // 发现首页
    exports.getHome = function (req, res, next) {
        var data = {
            title: '发现',
            keywords: '前端，你的世界，等你去发现',
            description: '前端，你的世界，等你去发现'
        };

        res.render('front/discover.html', data);
    };

    return exports;
};

