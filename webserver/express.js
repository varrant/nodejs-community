/*!
 * 启动 express
 * @author ydr.me
 * @create 2014-11-22 12:35
 */

'use strict';

var express = require('express');
var configs = require('../configs/');
var path = require('path');
var dato = require('ydr-util').dato;

// cookie 支持
var cookieParser = require('cookie-parser');

// session 支持
var sessionParser = require('express-session');

// POST 支持
var bodyParser = require('body-parser');

// gzip 支持
var compression = require('compression');

// 模板引擎
var ydrTemplate = require('ydr-template');

ydrTemplate.setOptions({
    cache: 'pro' === configs.app.env,
    compress: 'pro' === configs.app.env
});

ydrTemplate.addFilter('gravatar', function (val, size) {
    return dato.gravatar(val, {
        size: size || 100
    });
});


module.exports = function (next) {
    var app = express();


    //////////////////////////////////////////////////////////////////////
    ////////////////////////////[ setting ]///////////////////////////////
    //////////////////////////////////////////////////////////////////////
    app.set('env', configs.app.env);
    app.set('port', configs.app.port);
    app.set('views', path.join(configs.dir.webroot, './views/'));
    app.engine('html', ydrTemplate.__express);
    app.set('view engine', 'html');

    // 路由区分大小写，默认 disabled
    app.set('case sensitive routing', false);

    // 严格路由，即 /a/b !== /a/b/
    app.set('strict routing', true);
    app.set('jsonp callback name', 'callback');
    app.set('json spaces', 'pro' === configs.app.env ? 0 : 4);
    app.set('view cache', 'pro' === configs.app.env);


    ////////////////////////////////////////////////////////////////////
    /////////////////////////[ middleware ]/////////////////////////////
    ////////////////////////////////////////////////////////////////////
    if ('pro' === configs.app.env) {
        app.use(compression());
    }

    // strict - only parse objects and arrays. (default: true)
    // limit - maximum request body size. (default: <100kb>)
    // reviver - passed to JSON.parse()
    // type - request content-type to parse (default: json)
    // verify - function to verify body content
    app.use(bodyParser.json({
        strict: true,
        limit: '100kb',
        type: 'json'
    }));


    // extended - parse extended syntax with the qs module. (default: true)
    // limit - maximum request body size. (default: <100kb>)
    // type - request content-type to parse (default: urlencoded)
    // verify - function to verify body content
    app.use(bodyParser.urlencoded({
        extended: true
    }));


    // 解析cookie请求
    // http://www.cnblogs.com/qiuyeyaozhuai/archive/2013/04/28/3043157.html
    app.use(cookieParser(configs.secret.cookie.secret));


    // 要放在cookieParser后面
    app.use(sessionParser({
        // forces session to be saved even when unmodified. (default: true)
        // 未修改时，是否要保存
        resave: false,
        // forces a session that is "uninitialized" to be saved to the store.
        // A session is uninitialized when it is new but not modified.
        // This is useful for implementing login sessions,
        // reducing server storage usage, or complying with laws that require permission
        // before setting a cookie. (default: true)
        saveUninitialized: false,
        secret: configs.secret.session.secret
    }));


    ////////////////////////////////////////////////////////////////////
    ///////////////////////////[ router ]///////////////////////////////
    ////////////////////////////////////////////////////////////////////
    next(null, app);
};
