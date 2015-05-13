/*!
 * 路由出口
 * @author ydr.me
 * @create 2014-11-22 12:38
 */

'use strict';

var controllers = require('../controllers/');
var configs = require('../../configs/');
var log = require('ydr-utils').log;
var express = require('express');
// 更为详尽配置的静态服务器
var staticOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html'],
    index: false,
    maxAge: '30d',
    redirect: true
};

module.exports = function (app) {
    var exports = controllers(app);

    // 中间件：路由验证、安全验证、访问验证、读取当前用户等
    require('./middleware.js')(app, exports.middleware);

    // 测试优先
    require('./test.js')(app, exports.test);

    // 管理路由
    require('./sadmin.js')(app, exports.sadmin);

    // 管理路由
    require('./admin.js')(app, exports.admin);

    // 前端路由
    require('./front.js')(app, exports.front);

    // API 路由
    require('./api.js')(app, exports.api);

    // 程序路由优先，最后静态路由
    app.use('/', express.static(configs.dir.webroot, staticOptions));

    // notFound/serverError 日志
    app.use(log({
        // 运行环境，默认为开发
        env: configs.app.env,
        // 存放路径
        //path: configs.dir.log,
        // YYYY年MM月DD日 HH:mm:ss.SSS 星期e a
        name: './YYYY/MM/YYYY-MM-DD'
    }));

    // 终点路由
    require('./error.js')(app, exports.error);
};
