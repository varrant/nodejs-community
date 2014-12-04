/*!
 * 路由出口
 * @author ydr.me
 * @create 2014-11-22 12:38
 */

'use strict';

var controllers = require('../controllers/');
var configs = require('../../configs/');
var log = require('ydr-util').log;
var express = require('express');
// 更为详尽配置的静态服务器
var staticOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html'],
    index: false,
    maxAge: '1d',
    redirect: true
};

log.setOptions('env', configs.app.env);
log.setOptions('path', configs.dir.log);

module.exports = function (app) {
    var exports = controllers(app);

    require('./middleware.js')(app, exports.middleware);
    app.use('/', express.static(configs.dir.webroot, staticOptions));
    app.use('/static/', express.static(configs.dir.static, staticOptions));
    require('./test.js')(app, exports.test);
    require('./admin.js')(app, exports.admin);
    require('./front.js')(app, exports.front);
    require('./api.js')(app, exports.api);
    app.use(log());
    require('./error.js')(app, exports.error);
};
