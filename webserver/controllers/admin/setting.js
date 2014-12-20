/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 18:38
 */

'use strict';

var titles = {
    oauth: '授权配置',
    smtp: 'SMTP 配置',
    types: '版块配置',
    website: '前端开发者社区社区配置',
    alioss: '阿里云 OSS 配置',
    roles: '权限配置'
};

module.exports = function (app) {
    var exports = {};

    exports.get = function (key) {
        return function (req, res, next) {
            var data = {
                title: titles[key]
            };

            res.render('admin/setting-' + key + '.html', data);
        }
    };

    return exports;
}
