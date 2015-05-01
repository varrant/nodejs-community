/*!
 * 启动时需要运行的
 * @author ydr.me
 * @create 2014-11-22 21:28
 */

'use strict';

var setting = require('./services/').setting;
var section = require('./services/').section;
var category = require('./services/').category;
var developer = require('./services/').developer;
var sync = require('./utils/').sync;
var howdo = require('howdo');
var configs = require('../configs/');
var pkg = require('../package.json');
var cache = require('ydr-utils').cache;


module.exports = function (next, app) {
    howdo
        // 初始化启动配置
        .task(function (done) {
            configs.package = pkg;
            cache.set('app.configs', configs);
            done();
        })
        // 初始化 web 设置
        .task(function (done) {
            setting.get(function (err, docs) {
                if (err) {
                    return done(err);
                }

                cache.set('app.settings', docs);
                done();
            });
        })
        // 初始化社区版块
        .task(function (done) {
            section.find({}, function (err, docs) {
                if (err) {
                    return done(err);
                }

                sync.section(app, docs);
                done();
            });
        })
        // 初始化社区分类
        .task(function (done) {
            category.find({}, function (err, docs) {
                if (err) {
                    return done(err);
                }

                sync.category(app, docs);
                done();
            });
        })
        // 初始化网站管理员
        .task(function (done) {
            developer.findOne({
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

                cache.set('app.founder', doc);
                done();
            });
        })
        // 注册人数索引值
        .task(function (done) {
            developer.count({}, function (err, count) {
                if(err){
                    return done(err);
                }

                cache.set('app.autoIndex', count);
                done();
            });
        })
        // 异步并行
        .together(function (err) {
            next(err, app);
        });
};
