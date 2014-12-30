/*!
 * 导航
 * @author ydr.me
 * @create 2014-12-20 16:08
 */

'use strict';

var permission = require('../../services/').permission;
var role20 = 1 << 20;

module.exports = function (app) {
    var exports = {};

    exports.list = function (req, res, next) {
        var $engineer = res.locals.$engineer;
        var canSetting = permission.can($engineer, 'setting');
        var canSection = permission.can($engineer, 'section');
        var canCategory = permission.can($engineer, 'category');
        var canColumn = permission.can($engineer, 'column');
        var list = [];
        var engineerRole = $engineer.role;
        var $section = app.locals.$section;
        var sectionMap = {};

        $section.forEach(function (section) {
            sectionMap[section.uri] = section;
        });
        var helpRole = sectionMap['help'] ? sectionMap['help'].role : 20;
        var questionRole = sectionMap['question'] ? sectionMap['question'].role : 20;


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

        if (canSetting) {
            list.push({
                href: '/admin/setting/',
                text: 'web 配置',
                icon: 'i i-cogs',
                reg: '^setting\\/$'
            });
        }

        if (canSection) {
            list.push({
                href: '/admin/section/',
                text: '版块设置',
                icon: 'i i-archive',
                reg: '^section\\/$'
            });
        }

        if (canCategory) {
            list.push({
                href: '/admin/category/',
                text: '分类设置',
                icon: 'i i-folder',
                reg: '^category\\/$'
            });
        }

        if (canColumn) {
            list.push({
                href: '/admin/column/',
                text: '专栏设置',
                icon: 'i i-book',
                reg: '^column\\/$'
            });
        }

        if ((engineerRole & 1 << helpRole) !== 0) {
            list.push({
                href: '/admin/object/help/list/',
                text: '帮助管理',
                icon: 'i i-question-circle',
                reg: '^object\\/help\\/'
            });
        }


        if ((engineerRole & 1 << questionRole) !== 0) {
            list.push({
                href: '/admin/object/question/list/',
                text: '智问管理',
                icon: 'i i-cube',
                reg: '^object\\/question\\/'
            });
        }

        if ((engineerRole & role20) !== 0) {
            list.push({
                href: '/admin/developer/list/',
                text: '用户管理',
                icon: 'i i-users',
                reg: '^developer\\/'
            });
        }

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
