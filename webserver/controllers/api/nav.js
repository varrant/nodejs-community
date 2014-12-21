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
            icon: 'i i-home',
            reg: '^\\/$'
        });

        list.push({
            href: '/admin/',
            text: '管理首页',
            icon: 'i i-dashboard',
            reg: '^$'
        });

        list.push({
            href: '/admin/setting/oauth/',
            text: '授权设置',
            icon: 'i i-github',
            reg: '^setting\\/oauth\\/$'
        });

        list.push({
            href: '/admin/setting/smtp/',
            text: '邮件配置',
            icon: 'i i-envelope',
            reg: '^setting\\/smtp\\/$'
        });

        list.push({
            href: '/admin/setting/types/',
            text: '板块类型',
            icon: 'i i-suitcase',
            reg: '^setting\\/types\\/$'
        });

        list.push({
            href: '/admin/setting/website/',
            text: '社区设置',
            icon: 'i i-globe',
            reg: '^setting\\/website\\/$'
        });

        list.push({
            href: '/admin/setting/alioss/',
            text: '存储设置',
            icon: 'i i-cloud',
            reg: '^setting\\/alioss\\/'
        });

        list.push({
            href: '/admin/setting/roles/',
            text: '操作权限',
            icon: 'i i-key',
            reg: '^setting\\/roles\\/$'
        });

        list.push({
            href: '/admin/scope/',
            text: '领域配置',
            icon: 'i i-book',
            reg: '^scope\\/$'
        });

        list.push({
            href: '/admin/object/help/list/',
            text: '帮助管理',
            icon: 'i i-question-circle',
            reg: '^object\\/help\\/'
        });

        list.push({
            href: '/admin/object/question/list/',
            text: '智问管理',
            icon: 'i i-cube',
            reg: '^object\\/question\\/'
        });

        list.push({
            href: '/admin/engineer/list/',
            text: '用户管理',
            icon: 'i i-users',
            reg: '^engineer\\/'
        });

        list.push({
            href: '/admin/me/',
            text: '个人资料',
            icon: 'i i-user',
            reg: '^me\\/$'
        });

        res.json({
            code: 200,
            data: list
        });
    };

    return exports;
}
