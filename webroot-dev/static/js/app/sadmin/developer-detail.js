/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/sadmin/header.js');
    require('../../widget/sadmin/sidebar.js');
    require('../../widget/common/vue-filter.js');

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../alien/widgets/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var dato = require('../../alien/utils/dato.js');
    var url = '/admin/api/developer/?id=' + window['-id-'];
    var app = {};

    app.init = function () {
        ajax({
            url: url
        }).on('success', app._onsuccess).on('error', alert);
    };

    app._onsuccess = function (data1) {
        var data2 = app._calData(data1);
        var vue1 = new Vue({
            el: '#form',
            data: {
                developer: data1.developer
            }
        });
        var vue2 = new Vue({
            el: '#statistics',
            data: data2,
            methods: {
                onsave: app._onsave
            }
        });
        var vue3 = new Vue({
            el: '#role',
            data: dato.extend({
                developer: data1.developer
            }, data2),
            methods: {
                onsave: app._onsave
            }
        });

        app.vue1 = vue1;
        app.vue2 = vue2;
        app.vue3 = vue3;
        vue1.$el.classList.remove('none');
        vue2.$el.classList.remove('none');
        vue3.$el.classList.remove('none');
    };


    /**
     * 计算权限
     * @param data
     * @returns {Object}
     * @private
     */
    app._calData = function (data) {
        var developer = data.developer;
        var sectionStatistics = developer.sectionStatistics || {};
        var categoryStatistics = developer.categoryStatistics || {};
        var section = data.section;
        var category = data.category;
        var group = data.group;
        var engineerRole = data.developer.role;

        section.forEach(function (item) {
            item.roleVal = 1 << item.role;
            item.checked = ( engineerRole & item.roleVal ) > 0;
            item.objectCount = sectionStatistics[item.id] || 0;
        });

        category.forEach(function (item) {
            item.objectCount = categoryStatistics[item.id] || 0;
        });

        group.forEach(function (item) {
            item.roleVal = 1 << item.role;
            item.checked = ( engineerRole & item.roleVal ) > 0;
        });

        var data2 = [];

        data2.push({
            name: '发布权限',
            list: section
        });
        data2.push({
            name: '用户权限',
            list: group
        });

        return {
            kinds: data2,
            group: group,
            section: section,
            category: category,
            sectionObjectCount: sectionStatistics['0'] || 0,
            categoryObjectCount: categoryStatistics['0'] || 0
        };
    };


    /**
     * 保存
     * @param eve
     * @param id
     * @private
     */
    app._onsave = function (eve, id) {
        var the = this;
        var $btn = eve.target;
        var roleArray = [0];
        var kinds = the.$data.kinds;
        var save = function () {
            kinds.forEach(function (kind) {
                kind.list.forEach(function (item) {
                    if (item.checked) {
                        roleArray.push(item.role);
                    }
                });
            });
            $btn.disabled = true;
            ajax({
                url: url,
                method: 'post',
                body: {
                    id: id,
                    roleArray: roleArray
                }
            }).on('success', function (developer) {
                app.vue1.$data.developer = developer;
                the.$data.developer = developer;
                app._calData(the.$data);
            }).on('error', alert).on('finish', function () {
                $btn.disabled = false;
            });
        };

        confirm('确定要修改该用户的权限控制吗？').on('sure', save);
    };

    app.init();
});