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

        var engineer = data1.engineer;
        var section = data1.section;
        var category = data1.category;
        var group = data1.group;
        var engineerRole = data1.engineer.role;
        var sectionMap = {};
        var categoryMap = {};

        section.map(function (item) {
            sectionMap[item.id] = item;
        });

        category.map(function (item) {
            categoryMap[item.id] = item;
        });

        debugger;
        engineer.sectionStatistics2 = {};
        dato.each(engineer.sectionStatistics || {}, function (key, count) {
            engineer.sectionStatistics2[key === '0' ? '总和': sectionMap[key].name] = count;
        });

        engineer.categoryStatistics2 = {};
        dato.each(engineer.categoryStatistics || {}, function (key, count) {
            engineer.categoryStatistics2[key === '0' ? '总和': categoryMap[key].name] = count;
        });

        section.forEach(function (item) {
            item.roleVal = Math.pow(2, item.role);
            item.checked = ( engineerRole & item.roleVal ) > 0;
        });
        group.forEach(function (item) {
            item.roleVal = Math.pow(2, item.role);
            item.checked = ( engineerRole & item.roleVal ) > 0;
        });

        var data2 = [];


        data2.push({
            name: '发布权限',
            list: data1.section
        });
        data2.push({
            name: '用户权限',
            list: data1.group
        });

        var vue1 = new Vue({
            el: '#form',
            data: {
                engineer: engineer
            }
        });
        var vue2 = new Vue({
            el: '#role',
            data: {
                engineer: engineer,
                kinds: data2
            },
            methods: {
                onsave: app._onsave
            }
        });

        vue1.$el.classList.remove('f-none');
        vue2.$el.classList.remove('f-none');
    };


    app._onsave = function (eve, id) {
        var the = this;
        var $btn = eve.target;
        var role = 0;
        var kinds = the.$data.kinds;
        var save = function () {
            kinds.forEach(function (kind) {
                kind.list.forEach(function (item) {
                    if (item.checked) {
                        role += Math.pow(2, item.role);
                    }
                });
            });
            $btn.disabled = true;
            ajax({
                url: url,
                method: 'post',
                data: {
                    id: id,
                    role: role
                }
            }).on('success', function (json) {
                if (json.code !== 200) {
                    return alert(json);
                }
            }).on('error', alert).on('finish', function () {
                $btn.disabled = false;
            });
        };

        confirm('确定要修改该用户的权限控制吗？', save);
    };

    app.init();


    window.ppp = function (num) {
        var ret = 0;
        while(num >=10){
            ret+= Math.pow(2, num--);
        }
        return ret;
    }
});