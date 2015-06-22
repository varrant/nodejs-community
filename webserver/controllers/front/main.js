/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

var random = require('ydr-utils').random;
var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;
var cache = require('ydr-utils').cache;
var howdo = require('howdo');
var object = require('../../services/').object;
var developer = require('../../services/').developer;
var column = require('../../services/').column;
var filter = require('../../utils/').filter;
var log = require('ydr-utils').log;

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
            title: '',
            hotMap: {},
            newMap: {},
            statistics: statistics
        };
        var sectionList = cache.get('app.sectionList');

        howdo
            .each(sectionList, function (index, sec, done) {
                if (sec.uri === 'help') {
                    return done();
                }

                object.findHot(sec.id, 10, function (err, docs) {
                    if (err) {
                        return done(err);
                    }

                    data.hotMap[sec.uri] = docs;
                    done();
                });
            })
            .each(sectionList, function (index, sec, done) {
                if (sec.uri === 'help') {
                    return done();
                }

                object.find({}, {
                    sort: {publishAt: -1},
                    limit: 5
                }, function (err, docs) {
                    if (err) {
                        return done(err);
                    }

                    data.newMap[sec.uri] = docs;
                    done();
                });
            })
            .together(function (err) {
                if (err) {
                    return next(err);
                }

                //res.send({
                //    code: 200,
                //    data: data
                //});
                res.render('front/home.html', data);
            });


        //howdo
        //    // 注册用户数
        //    .task(function (done) {
        //        developer.count({}, function (err, count) {
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            statistics.engineers = count;
        //            done();
        //        });
        //    })
        //    // objectCount 最活跃的用户
        //    .task(function (done) {
        //        developer.findOne({}, {sort: '-objectCount'}, function (err, dp) {
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            statistics.bestActive = dp;
        //            done();
        //        });
        //    })
        //    // viewByCount 最大人气的用户
        //    .task(function (done) {
        //        developer.findOne({}, {sort: '-viewByCount'}, function (err, dp) {
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            statistics.bestPopularity = dp;
        //            done();
        //        });
        //    })
        //    // commentCount 最积极的用户
        //    .task(function (done) {
        //        developer.findOne({}, {sort: '-commentCount'}, function (err, dp) {
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            statistics.bestInitiative = dp;
        //            done();
        //        });
        //    })
        //    // commentByCount 最热门的用户
        //    .task(function (done) {
        //        developer.findOne({}, {sort: '-commentByCount'}, function (err, dp) {
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            statistics.bestHot = dp;
        //            done();
        //        });
        //    })
        //    // agreeByCount 最受欢迎的用户
        //    .task(function (done) {
        //        developer.findOne({}, {sort: '-agreeByCount'}, function (err, dp) {
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            statistics.bestWelcome = dp;
        //            done();
        //        });
        //    })
        //    // acceptByCount 最受崇敬的用户
        //    .task(function (done) {
        //        developer.findOne({}, {sort: '-acceptByCount'}, function (err, dp) {
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            statistics.bestRespect = dp;
        //            done();
        //        });
        //    })
        //    // 异步顺序并行
        //    .together(function (err) {
        //        if (err) {
        //            return next(err);
        //        }
        //
        //        res.render('front/home.html', data);
        //    });
    };

    return exports;
};
