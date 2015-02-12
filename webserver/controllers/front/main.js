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
var column = require('../../services/').column;
var section = require('../../services/').section;
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
        var statistics = {};
        var data = {
            title: '主页',
            statistics: statistics,
            section: section
        };

        howdo
            // 版块
            .task(function (done) {
                section.find({}, function (err, datas) {
                    if (err) {
                        return done(err);
                    }

                    app.locals.$section = data.section = datas;
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
            // objectCount 最活跃的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-objectCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestActive = dp;
                    done();
                });
            })
            // viewByCount 最大人气的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-viewByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestPopularity = dp;
                    done();
                });
            })
            // commentCount 最积极的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-commentCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestInitiative = dp;
                    done();
                });
            })
            // commentByCount 最热门的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-commentByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestHot = dp;
                    done();
                });
            })
            // agreeByCount 最受欢迎的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-agreeByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestWelcome = dp;
                    done();
                });
            })
            // acceptByCount 最受崇敬的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-acceptByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestRespect = dp;
                    done();
                });
            })
            // 异步顺序并行
            .together(function (err) {
                if (err) {
                    return next(err);
                }

                app.locals.$section.forEach(function (sec) {
                    data.section[sec.uri] = sec;
                });

                res.render('front/home.html', data);
            });
    };

    return exports;
};
