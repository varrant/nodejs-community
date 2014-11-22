/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 20:00
 */

'use strict';


var fs = require('fs-extra');
var ydrUtil = require('ydr-util');
var file = process.argv[2];
var json = fs.readJSONFileSync(file);
var mongoose = require('./mongoose.js');
var service = require('./services/').setting;

mongoose(function (err) {
    if(err){
        console.error(err);
        return process.exit(-1);
    }

    var settings = [];

    ydrUtil.dato.each(json, function (key, val) {
        settings.push({
            key: key,
            val: val
        });
    });

    service.set(settings, function (err) {
        if(err){
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