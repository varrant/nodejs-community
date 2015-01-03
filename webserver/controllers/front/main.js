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
var developer = require('../../services/').developer;
var filter = require('../../utils/').filter;
var log = require('ydr-log');

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
                developer.count({}, function (err, count) {
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
            var categoryMap = {};
            var data = {
                section: section,
                title: section.name,
                categories: app.locals.$category,
                categoryMap: categoryMap
            };
            var category = req.params.category;
            var label = req.params.label;
            var options = filter.skipLimit(req.params);
            var conditions = {
                section: section.id,
                isDisplay: true
            };

            var categoryId = 0;
            dato.each(app.locals.$category, function (index, _category) {
                if (_category.uri === category) {
                    categoryId = _category.id;
                }

                categoryMap[_category.id] = _category;
            });

            if (categoryId) {
                conditions.category = categoryId;
            }

            if (label) {
                conditions.labels = label;
            }

            howdo
                // 统计数量
                .task(function (done) {
                    object.count({
                        section: section.id,
                        isDisplay: true
                    }, done);
                })
                // 列表
                .task(function (done) {
                    options.populate = ['author', 'contributors'];
                    object.find(conditions, options, done);
                })
                // 异步并行
                .together(function (err, count, docs) {
                    if (err) {
                        return next(err);
                    }

                    data.count = count;
                    data.objects = docs;
                    res.render('front/list-' + section.uri + '.html', data);
                });
        };
    };


    /**
     * ID 303 => uri
     * @param req
     * @param res
     * @param next
     */
    exports.redirect = function (req, res, next) {
        var id = req.query.id;

        object.findOne({
            _id: id,
            isDisplay: true
        }, function (err, doc) {
            if (err) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    return next();
                }
            }

            var sectionMap = {};
            app.locals.$section.forEach(function (sec) {
                sectionMap[sec.id] = sec;
            });

            res.redirect('/' + sectionMap[doc.section].uri + '/' + doc.uri + '.html');
        });
    };


    /**
     * post 页
     * @param type
     * @returns {Function}(req, res, next)
     */
    exports.getObject = function (section) {
        return function (req, res, next) {
            var uri = req.params.uri;
            var data = {};

            object.findOne({
                section: section.id,
                uri: uri,
                isDisplay: true
            }, {populate: ['author', 'category']}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    return next();
                }

                object.increaseViewByCount({_id: doc.id}, 1, log.holdError);
                data.title = doc.title;
                data.object = doc;
                res.render('front/object-' + section.uri + '.html', data);
            });
        }
    };

    return exports;
};
