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
            href: '/admin/setting/',
            text: 'web 配置',
            icon: 'i i-cogs',
            reg: '^setting\\/$'
        });

        list.push({
            href: '/admin/section/',
            text: '版块设置',
            icon: 'i i-archive',
            reg: '^section\\/$'
        });

        list.push({
            href: '/admin/category/',
            text: '分类设置',
            icon: 'i i-folder',
            reg: '^category\\/$'
        });

        list.push({
            href: '/admin/column/',
            text: '专栏设置',
            icon: 'i i-book',
            reg: '^column\\/$'
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
