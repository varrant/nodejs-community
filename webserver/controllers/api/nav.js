/*!
 * api nav controller
 * @author ydr.me
 * @create 2014-12-20 16:08
 */

'use strict';

var permission = require('../../services/').permission;
var role20 = 1 << 20;

module.exports = function (app) {
    var exports = {};

    exports.list = function (req, res, next) {
        var $developer = res.locals.$developer;
        var canSetting = permission.can($developer, 'setting');
        var canSection = permission.can($developer, 'section');
        var canCategory = permission.can($developer, 'category');
        var canColumn = permission.can($developer, 'column');
        var list = [];
        var developerRole = $developer.role;
        var $section = app.locals.$section;
        var sectionMap = {};

        $section.forEach(function (section) {
            sectionMap[section.uri] = section;
        });
        var articleRole = sectionMap.article ? sectionMap.article.role : 20;
        var questionRole = sectionMap.question ? sectionMap.question.role : 20;
        var linkRole = sectionMap.link ? sectionMap.link.role : 20;
        var helpRole = sectionMap.help ? sectionMap.help.role : 20;


        list.push({
            href: '/',
            text: '社区首页',
            icon: 'i i-home',
            reg: '^\\/$'
        });

        list.push({
            href: '/sadmin/',
            text: '管理首页',
            icon: 'i i-dashboard',
            reg: '^$'
        });

        if (canSetting) {
            list.push({
                href: '/sadmin/setting/',
                text: 'web 配置',
                icon: 'i i-cogs',
                reg: '^setting\\/$'
            });
        }

        if (canSection) {
            list.push({
                href: '/sadmin/section/',
                text: '版块设置',
                icon: 'i i-archive',
                reg: '^section\\/$'
            });
        }

        if (canCategory) {
            list.push({
                href: '/sadmin/category/',
                text: '分类设置',
                icon: 'i i-folder',
                reg: '^category\\/$'
            });
        }

        if (canColumn) {
            list.push({
                href: '/sadmin/column/',
                text: '专栏设置',
                icon: 'i i-book',
                reg: '^column\\/$'
            });
        }

        if ((developerRole & 1 << articleRole) !== 0) {
            list.push({
                href: '/sadmin/object/article/list/',
                text: '我的文章',
                icon: 'i i-file-text',
                reg: '^object\\/article\\/'
            });
        }

        if ((developerRole & 1 << questionRole) !== 0) {
            list.push({
                href: '/sadmin/object/question/list/',
                text: '我的提问',
                icon: 'i i-cube',
                reg: '^object\\/question\\/'
            });
        }

        if ((developerRole & 1 << linkRole) !== 0) {
            list.push({
                href: '/sadmin/object/link/list/',
                text: '我的链接',
                icon: 'i i-link',
                reg: '^object\\/link\\/'
            });
        }

        if ((developerRole & 1 << helpRole) !== 0) {
            list.push({
                href: '/sadmin/object/help/list/',
                text: '帮助管理',
                icon: 'i i-question-circle',
                reg: '^object\\/help\\/'
            });
        }

        if ((developerRole & role20) !== 0) {
            list.push({
                href: '/sadmin/developer/list/',
                text: '用户管理',
                icon: 'i i-users',
                reg: '^developer\\/'
            });
        }

        list.push({
            href: '/sadmin/me/',
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
};
