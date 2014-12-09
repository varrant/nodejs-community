/*!
 * 启动文件
 * @author ydr.me
 * @create 2014-12-02 22:59
 */


'use strict';

var configs = require('../configs/');
var supervisor = require('supervisor');
var args = [];

args.push(__filename);
args.push('-w');
args.push('./webserver/');
args.push('./webserver/index.js');


// 开发环境
if (configs.app.env === 'dev') {
    supervisor.run(args);
}
// 生产环境
else {
    require('../webserver/index.js');
}

