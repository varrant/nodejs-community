/*!
 * app
 * @author ydr.me
 * @create 2014-11-22 12:31
 */

'use strict';

var isAliYun = process.env && process.env.HOSTNAME === 'AY140601002820618982Z';

module.exports = {
    // 可选环境: dev/pro
    env: isAliYun ? 'pro' : 'dev',
    // 端口
    port: 18082,
    // 主机
    host: isAliYun ? 'http://FrontEndDev.org' : 'http://192.168.1.106:18082',
    // mongodb
    mongodb: 'mongodb://cloudcome1:123123@localhost:27017/community'
};
