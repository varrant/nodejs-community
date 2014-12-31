/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 12:31
 */

'use strict';


module.exports = {
    // 可选环境: dev/pro
    env: process.env === 'AY140601002820618982Z' ? 'pro' : 'dev',
    // 端口
    port: 18084,
    // 主机
    host: 'http://sb.com:18084',
    // mongodb
    mongodb: 'mongodb://localhost:27017/community'
};
