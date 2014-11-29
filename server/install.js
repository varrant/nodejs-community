/*!
 * 首次安装
 * @author ydr.me
 * @create 2014-11-22 20:00
 */

'use strict';

var fs = require('fs-extra');
var ydrUtil = require('ydr-util');
var file = process.argv[2];
var json = fs.readJSONFileSync(file);
var mongoose = require('./mongoose.js');
var setting = require('./services/').setting;
var user = require('./services/').user;
var howdo = require('howdo');

mongoose(function (err) {
    if (err) {
        console.log('install error');
        console.error(err);
        return process.exit(-1);
    }

    var settings = [];
    var userData = json.owner;

    ydrUtil.dato.each(json, function (key, val) {
        if (key !== 'owner') {
            settings.push({
                key: key,
                val: val
            });
        }
    });

    howdo.task(function (next) {
        user.signUp(userData, next);
    }).task(function (next) {
        setting.set(settings, next);
    }).follow(function (err) {
        if (err) {
            console.error(err);
            return process.exit(-1);
        }

        console.log('');
        console.log('#########################################################');
        console.log('恭喜：配置初始化成功！');
        console.log('使用 `npm start` 启动服务器');
        console.log('#########################################################');
        console.log('');
        process.exit(0);
    });
});