/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-07-24 20:00
 */


'use strict';

var cache = require('ydr-utils').cache;
var log = require('ydr-utils').log;
var link = require('../../services/').link;


module.exports = function (app) {
    var exports = {};

    // 发现首页
    exports.getHome = function (req, res, next) {
        var data = {
            title: '发现',
            keywords: '前端，你的世界，等你去发现',
            description: '前端，你的世界，等你去发现',
            list: cache.get('app.link1List')
        };

        res.render('front/discover.html', data);
    };


    // 链接跳转
    exports.getRedirect = function (req, res, next) {
        var id = req.query.id;
        var linkMap = cache.get('app.link1Map');

        if(!linkMap[id]){
            return res.redirect('/');
        }

        link.findOne({
            _id: id
        }, function (err, doc) {
            if (err || !doc) {
                return res.redirect('/');
            }

            res.redirect(doc.url);
        });
    };

    return exports;
};

