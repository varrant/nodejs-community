/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 12:31
 */

'use strict';

var isAliYun = process.env && process.env.HOSTNAME === 'AY140601002820618982Z';

module.exports = {
    // 可选环境: dev/pro
    env: isAliYun ? 'pro' : 'dev',
    // 端口
    port: 18084,
    // 主机
    host: isAliYun ? 'http://112.124.114.165:18084' : 'http://sb.com:18084',
    // mongodb
    mongodb: 'mongodb://localhost:27017/community'
};
