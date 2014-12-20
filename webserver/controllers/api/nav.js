/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 16:08
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    exports.list = function (req, res, next) {
        var list = [];

        list.push({
            href: '/',
            text: '社区首页',
            icon: 'i i-home'
        });

        list.push({
            href: '/admin/',
            text: '管理首页',
            icon: 'i i-dashboard'
        });

        list.push({
            href: '/admin/setting/oauth/',
            text: '授权设置',
            icon: 'i i-github'
        });

        list.push({
            href: '/admin/setting/smtp/',
            text: '邮件配置',
            icon: 'i i-envelope'
        });

        list.push({
            href: '/admin/setting/types/',
            text: '板块类型',
            icon: 'i i-suitcase'
        });

        list.push({
            href: '/admin/setting/website/',
            text: '社区设置',
            icon: 'i i-globe'
        });

        list.push({
            href: '/admin/setting/alioss/',
            text: '存储设置',
            icon: 'i i-cloud'
        });

        list.push({
            href: '/admin/setting/roles/',
            text: '权限管理',
            icon: 'i i-key'
        });

        list.push({
            href: '/admin/scope/',
            text: '领域配置',
            icon: 'i i-book'
        });

        list.push({
            href: '/admin/object/help/list/',
            text: '帮助管理',
            icon: 'i i-question-circle'
        });

        list.push({
            href: '/admin/object/question/list/',
            text: '智问管理',
            icon: 'i i-cube'
        });

        res.json({
            code: 200,
            data: list
        });
    };

    return exports;
}
