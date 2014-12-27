/*!
 * 启动时需要运行的
 * @author ydr.me
 * @create 2014-11-22 21:28
 */

'use strict';

var setting = require('./services/').setting;
var section = require('./services/').section;
var category = require('./services/').category;
var engineer = require('./services/').engineer;
var howdo = require('howdo');
var configs = require('../configs/');

module.exports = function (next, app) {
    howdo
        // 初始化启动配置
        .task(function (done) {
            app.locals.$config = configs;
            done();
        })
        // 初始化 web 设置
        .task(function (done) {
            setting.get(function (err, docs) {
                if (err) {
                    return done(err);
                }

                app.locals.$setting = docs;
                done();
            });
        })
        // 初始化社区版块
        .task(function (done) {
            section.find({}, function (err, docs) {
                if (err) {
                    return done(err);
                }

                app.locals.$section = docs || [];
                done();
            });
        })
        // 初始化社区版块
        .task(function (done) {
            category.find({}, function (err, docs) {
                if (err) {
                    return done(err);
                }

                app.locals.$category = docs || [];
                done();
            });
        })
        // 初始化社区分类
        // 初始化网站管理员
        .task(function (done) {
            engineer.findOne({
                role: 2097151
            }, function (err, doc) {
                if (err) {
                    return done(err);
                }

                if (!doc) {
                    console.log('');
                    console.log('#########################################################');
                    console.log('miss a founder, read readme.md and use `npm install` first');
                    console.log('#########################################################');
                    console.log('');
                    return process.exit();
                }

                app.locals.$founder = doc;
                done();
            });
        })
        // 异步并行
        .together(function (err) {
            next(err, app);
        });
};
