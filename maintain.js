/*!
 * 停机维护
 * @author ydr.me
 * @create 2015-02-04 21:57
 */

'use strict';
var http = require('http');
var configs = require('./configs/');
var tip = '停机维护中，请稍后回来……';
var html = '<!doctype html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' +
    '<meta name="renderer" content="webkit">' +
    '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">' +
    '<meta name="author" content="云淡然;http://ydr.me">' +
    '<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">' +
    '<title>' + tip + '</title>' +
    '</head>' +
    '<body style="background: #eee;">' +
    '<h1 style="text-align:center;padding: 20px;background: #fff;width: 500px;margin: 30px auto;border: 5px solid #E4E4E4;">' +
    tip +
    '</h1>' +
    '</body>' +
    '</html>';

http.createServer(function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.end(html);
}).listen(configs.app.port, function () {
    console.log('');
    console.log('############################################################');
    console.log('############################################################');
    console.log('当前运行在维护模式，维护完毕请及时退出，并启动正常模式！');
    console.log('############################################################');
    console.log('############################################################');
    console.log('');
});
