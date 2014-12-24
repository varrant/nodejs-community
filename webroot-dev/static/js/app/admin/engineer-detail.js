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
        var data2 = [];
        var engineerRole = data1.engineer.role;

        data1.section.forEach(function (section) {
            section.roleVal = Math.pow(2, section.role);
            section.checked = ( engineerRole & section.roleVal ) > 0;
        });
        data2.push({
            name: '发布权限',
            list: data1.section
        });

        var vue1 = new Vue({
            el: '#form',
            data: {
                engineer: data1.engineer
            }
        });
        var vue2 = new Vue({
            el: '#role',
            data: {
                engineer: data1.engineer,
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
        var $btn = eve.target;
        var role = 0;
        var kinds = this.$data.kinds;
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
});