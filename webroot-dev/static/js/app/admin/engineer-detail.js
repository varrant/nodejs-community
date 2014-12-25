/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');
    require('../../widget/common/vue-filter.js');

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
    var confirm = require('../../widget/common/confirm.js');
    var dato = require('../../alien/util/dato.js');
    var url = '/admin/api/engineer/?id=' + window['-id-'];
    var app = {};

    app.init = function () {
        ajax({
            url: url
        }).on('success', app._onsuccess).on('error', alert);
    };

    app._onsuccess = function (json) {
        if (json.code !== 200) {
            return alert(json);
        }

        var data1 = json.data;
        var data2 = app._calData(data1);
        var vue1 = new Vue({
            el: '#form',
            data: {
                engineer: data1.engineer
            }
        });
        var vue2 = new Vue({
            el: '#role',
            data: dato.extend({
                engineer: data1.engineer
            }, data2),
            methods: {
                onsave: app._onsave
            }
        });

        vue1.$el.classList.remove('f-none');
        vue2.$el.classList.remove('f-none');
    };


    /**
     * 计算权限
     * @param data
     * @returns {Object}
     * @private
     */
    app._calData = function (data) {
        var engineer = data.engineer;
        var section = data.section;
        var category = data.category;
        var group = data.group;
        var engineerRole = data.engineer.role;
        var sectionMap = {};
        var categoryMap = {};

        section.map(function (item) {
            sectionMap[item.id] = item;
        });

        category.map(function (item) {
            categoryMap[item.id] = item;
        });

        engineer.sectionStatistics2 = {};
        dato.each(engineer.sectionStatistics || {}, function (key, count) {
            engineer.sectionStatistics2[key === '0' ? '总和' : sectionMap[key].name] = count;
        });

        engineer.categoryStatistics2 = {};
        dato.each(engineer.categoryStatistics || {}, function (key, count) {
            engineer.categoryStatistics2[key === '0' ? '总和' : categoryMap[key].name] = count;
        });

        section.forEach(function (item) {
            item.roleVal = 1 << item.role;
            item.checked = ( engineerRole & item.roleVal ) > 0;
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
            category: category
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
                data: {
                    id: id,
                    roleArray: roleArray
                }
            }).on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }

                var engineer = json.data;
                the.$data.engineer = engineer;
                app._calData(the.$data);
            }).on('error', alert).on('finish', function () {
                $btn.disabled = false;
            });
        };

        confirm('确定要修改该用户的权限控制吗？', save);
    };

    app.init();
});