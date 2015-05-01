/*!
 * 启动文件
 * @author ydr.me
 * @create 2015-01-26 19:39
 */

'use strict';

var webserver = require('./webserver/');
var configs = require('./configs/');
var random = require('ydr-utils').random;
var cache = require('ydr-utils').cache;

cache.config({
    debug: configs.app.env === 'dev'
});

webserver(function (err, app) {
    if (err) {
        console.error(err);
        return process.exit(-1);
    }

    cache.set('app.system', {
        // 服务器开始时间
        startTime: Date.now(),
        // 服务器随机 hash
        hash: random.string(20, 'Aa'),
        // 自动索引
        autoIndex: 1
    });

    // 服务器保存被修改过的 开发者 信息，
    // 开发者访问的时候更新上去，然后销毁
    // 保证，管理员修改过的开发者能够获取到最新的
    // {
    //     "id": developerObject
    // }
    cache.set('modify.developers', {});

    app.locals.$system = {
        // 服务器开始时间
        startTime: Date.now(),
        // 服务器随机 hash
        hash: random.string(20, 'Aa'),
        // 服务器保存被修改过的 开发者 信息，
        // 开发者访问的时候更新上去，然后销毁
        // {
        //     "id": developerObject
        // }
        developer: {},
        // 自动索引
        autoIndex: 1
    };

    console.log('');
    console.log('#########################################################');
    console.log(configs.app.host + ' is running');
    console.log('#########################################################');
    console.log('');
});