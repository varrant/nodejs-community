/*!
 * 启动时需要运行的
 * @author ydr.me
 * @create 2014-11-22 21:28
 */

'use strict';

var setting = require('./services/').setting;
var user = require('./services/').user;
var howdo = require('howdo');

module.exports = function (next, app) {
    howdo
        // 初始化网站设置
        .task(function (done) {
            setting.get(function (err, settings) {
                if (err) {
                    return done(err);
                }

                app.locals.$options = settings;

                done();
            });
        })
        // 初始化网站管理员
        .task(function (done) {
            user.findOne({
                role: 2097151
            }, function (err, doc) {
                if(err){
                    return done(err);
                }

                if(!doc){
                    console.log('');
                    console.log('#########################################################');
                    console.log('miss an owner, please read readme.md and use `npm install`');
                    console.log('#########################################################');
                    console.log('');
                    return process.exit();
                }

                app.locals.$owner = doc.toObject();
                done();
            });
        })
        // 异步并行
        .together(function (err) {
            next(err, app);
        });
};
