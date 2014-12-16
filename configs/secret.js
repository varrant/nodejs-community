/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 13:04
 */

'use strict';

var ydrUtil = require('ydr-util');

module.exports = function(app) {
    return {
        session: {
            // session 加密密钥
            secret: app.env === 'pro' ? ydrUtil.random.string(5) : '123456',
            // csrf 的过期时间（单位毫秒），默认1个小时
            csrfAge: 1 * 60 * 60 * 1000
        },

        cookie: {
            options: {
                domain: '',
                path: '/',
                secure: false,
                httpOnly: true
            },
            // cookie加密密钥
            secret: app.env === 'pro' ? ydrUtil.random.string(5) : '123456',

            // 会员 cookie 名称
            userKey: 'f2ec-user',
            // cookie有效期（单位毫秒），默认7天
            userAge: 7 * 24 * 60 * 60 * 1000,

            // 访客 cookie 名称
            visitorKey: 'f2ec-visitor',
            // cookie有效期（单位毫秒），默认7天
            visitorAge: 7 * 24 * 60 * 60 * 1000
        }
    };
};
