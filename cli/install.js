/*!
 * 首次安装
 * @author ydr.me
 * @create 2014-11-22 20:00
 */

'use strict';

var fs = require('fs-extra');
var dato = require('ydr-util').dato;
var file = process.argv[2];
var json = fs.readFileSync(file, 'utf8');
var mongoose = require('../webserver/mongoose.js');
var setting = require('../webserver/services/').setting;
var engineer = require('../webserver/models/').engineer;
var howdo = require('howdo');

json = dato.removeComments(json);
json = JSON.parse(json);

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    var settings = [];
    var userData = json.owner;

    dato.each(json, function (key, val) {
        if (key !== 'owner') {
            settings.push({
                key: key,
                val: val
            });
        }
    });

    howdo
        .task(function (next) {
            engineer.count({}, function (err, count) {
                if (err) {
                    console.log('count user error');
                    console.error(err);
                    return process.exit();
                }

                if (count) {
                    console.log('#########################################################');
                    console.log('已经配置初始化过了，略过……');
                    console.log('后续配置修改可以访问`/admin/setting/`继续操作。');
                    console.log('#########################################################');
                    return process.exit();
                }

                next();
            });
        })
        .task(function (next) {
            engineer.createOne(userData, next);
        })
        .task(function (next) {
            setting.set(settings, next);
        })
        .follow(function (err) {
            if (err) {
                console.log(err.message);
                console.log(err.stack);
                return process.exit();
            }

            console.log('');
            console.log('#########################################################');
            console.log('恭喜：配置初始化成功！');
            console.log('使用 `npm start` 启动服务器');
            console.log('#########################################################');
            console.log('');
            process.exit();
        });
});