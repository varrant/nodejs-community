/*!
 * 启动 express
 * @author ydr.me
 * @create 2014-11-22 12:35
 */

'use strict';

var express = require('express');
var config = require('../webconfig/');
var path = require('path');

// cookie 支持
var cookieParser = require('cookie-parser');

// session 支持
// https://github.com/aliyun-UED/aliyun-sdk-js
var sessionParser = require('express-session');

// POST 支持
var bodyParser = require('body-parser');

// upload FILE 支持
var multer = require('multer');

// gzip 支持
var compression = require('compression');

// 模板引擎
var ydrTemplate = require('ydr-template');

// 工具库
var ydrUtil = require('ydr-util');

// 路由表
var routers = require('./routers/');

module.exports = function (callback) {
    var app = express();


    //////////////////////////////////////////////////////////////////////
    ////////////////////////////[ setting ]///////////////////////////////
    //////////////////////////////////////////////////////////////////////
    app.set('env', config.app.env);
    app.set('port', config.app.port);
    app.set('views', path.join(config.dir.static, './views/'));
    app.engine('html', ydrTemplate.__express);
    app.set('view engine', 'html');

    // 路由区分大小写，默认 disabled
    app.set('case sensitive routing', true);

    // 严格路由，即 /a/b !== /a/b/
    app.set('strict routing', true);
    app.set('jsonp callback name', 'callback');
    app.set('json spaces', 0);
    app.set('view cache', 'pro' === config.app.env);


    ////////////////////////////////////////////////////////////////////
    /////////////////////////[ middleware ]/////////////////////////////
    ////////////////////////////////////////////////////////////////////
    if ('pro' === config.app.env) {
        app.use(compression());
    }

    app.use('/', express.static(config.dir.webroot));
    app.use('/static/', express.static(config.dir.static));


    // strict - only parse objects and arrays. (default: true)
    // limit - maximum request body size. (default: <100kb>)
    // reviver - passed to JSON.parse()
    // type - request content-type to parse (default: json)
    // verify - function to verify body content
    app.use(bodyParser.json());


    // extended - parse extended syntax with the qs module. (default: true)
    // limit - maximum request body size. (default: <100kb>)
    // type - request content-type to parse (default: urlencoded)
    // verify - function to verify body content
    app.use(bodyParser.urlencoded({
        extended: true
    }));


    app.use(multer({
        // 上传目录
        dest: config.dir.upload,
        // fieldNameSize - integer - Max field name size (Default: 100 bytes)
        // fieldSize - integer - Max field value size (Default: 1MB)
        // fields - integer - Max number of non-file fields (Default: Infinity)
        // fileSize - integer - For multipart forms, the max file size (Default: Infinity)
        // files - integer - For multipart forms, the max number of file fields (Default: Infinity)
        // parts - integer - For multipart forms, the max number of parts (fields + files) (Default: Infinity)
        // headerPairs - integer - For multipart forms, the max number of header key=>value pairs to parse Default: 2000 (same as node's http).
        limits: {
            fileSize: 5 * 1024 * 1024 + 'B',
            files: 10
        },
        // 自定义重命名规则
        rename: function (fieldname, filename) {
            return ydrUtil.random.guid() + path.extname(filename);
        }
        // onError: function() {},
        // // 文件数量超过限制
        // onFilesLimit: function() {},
        // // 字段数量超过限制
        // onFieldsLimit: function() {},
        // // 头信息键值对数量超过限制
        // onPartsLimit: function() {},
    }));


    // 解析cookie请求
    // http://www.cnblogs.com/qiuyeyaozhuai/archive/2013/04/28/3043157.html
    app.use(cookieParser(config.secret.cookie.secret));


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
        secret: config.secret.session.secret
    }));

    app.locals.name = '嘻嘻';


    ////////////////////////////////////////////////////////////////////
    ///////////////////////////[ router ]///////////////////////////////
    ////////////////////////////////////////////////////////////////////
    routers(app);

    app.listen(config.app.port, callback);
};
