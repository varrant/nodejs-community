/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

var random = require('ydr-util').random;
var dato = require('ydr-util').dato;
var typeis = require('ydr-util').typeis;
var howdo = require('howdo');
var object = require('../../services/').object;
var engineer = require('../../services/').engineer;
var filter = require('../../utils/').filter;
var os = require('os');

module.exports = function (app) {
    var exports = {};

    /**
     * home 页
     * @param req
     * @param res
     * @param next
     */
    exports.getHome = function (req, res, next) {
        var section = {};
        var statistics = {};
        var data = {
            title: '主页',
            statistics: statistics,
            section: section
        };

        app.locals.$section.forEach(function (sec) {
            section[sec.uri] = sec;
        });


        howdo
            // 统计个数
            .each(app.locals.$section, function (index, section, done) {
                object.count({section: section.id}, function (err, count) {
                    if (err) {
                        return done(err);
                    }

                    statistics[section.uri] = count;
                    done();
                });
            })
            // 注册用户数
            .task(function (done) {
                engineer.count({}, function (err, count) {
                    if (err) {
                        return done(err);
                    }

                    statistics.engineers = count;
                    done();
                });
            })
            .together(function (err) {
                if (err) {
                    return next(err);
                }

                res.render('front/home.html', data);
            });
    };


    /**
     * list 页
     * @param req
     * @param type
     * @returns {Function}(req, res, next)
     */
    exports.getList = function (section) {
        return function (req, res, next) {
            var data = {
                title: section.name,
                categories: app.locals.$category
            };
            var category = req.params.category;
            var label = req.params.label;
            var info = filter.skipLimit(req.params);
            var conditions = {
                section: section.id,
                isDisplay: true
            };

            var categoryId = 0;
            dato.each(app.locals.$category, function (index, _category) {
                if (_category.uri === category) {
                    categoryId = _category.id;
                    return false;
                }
            });

            if (categoryId) {
                conditions[category] = categoryId;
            }

            if (label) {
                conditions.labels = label;
            }

            object.find(conditions, info, function (err, docs) {
                if (err) {
                    return next(err);
                }

                data.objects = docs;
                res.render('front/list-' + section.uri + '.html', data);
            });
        };
    };


    /**
     * post 页
     * @param type
     * @returns {Function}(req, res, next)
     */
    exports.getPost = function (section) {
        return function (req, res, next) {
            var uri = req.params.uri;

            res.render('front/post-' + section.uri + '.html', {
                title: section.name,
                list: [{
                    content: '清除浏览器缓存的文件试试看！不知道有没有童鞋遇到过这样的？我用QQ,搜狗，猎豹，chrome，UC都没问题！！手机wifi调试页面，浏览器是小米3内置浏览器童鞋遇到过这样的？我用QQ,搜狗，猎豹，chrome，UC都没问题！！手机wifi调试'
                }, {
                    content: '我本地wamp环境，手机wifi调试页面，浏览器是小米3内置浏览器；'
                }, {
                    content: '那么问题是：css文件修改后，浏览器不管怎么刷新，（手机，浏览器）重启都不能呈现更新后的样式。'
                }, {
                    content: '不知道有没有童鞋遇到过这样的？我用QQ,搜狗，猎豹，chrome，UC都没问题！！小米浏览器是我见过的手机浏览器最垃圾的 号召大家都不要睬他'
                }]
            });
        }
    };

    return exports;
};
