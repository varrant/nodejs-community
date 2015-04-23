'use strict';

var http = require('http');


http.createServer(function (req, res) {
    res.setHeader('access-control-allow-origin', req.headers.origin);
    res.setHeader('access-control-allow-methods', 'GET');
    res.setHeader('access-control-allow-headers', 'x-request-with1,X-Request-With2');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'x-test');
    res.setHeader('x-test', '1');
    res.end('OK');
}).listen(18083);
