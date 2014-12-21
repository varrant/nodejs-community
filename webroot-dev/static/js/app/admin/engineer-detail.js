/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    require('../../widget/admin/welcome.js');
    require('../../widget/admin/nav.js');
    require('../../widget/common/vue-filter.js');

    var ajax = require('../../widget/common/ajax.js');
    var alert = require('../../widget/common/alert.js');
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

        data2.push({
            name: '版块权限（0-10）',
            list: data1.types
        });

        data1.types.forEach(function (type) {
            type.desc = type.title;
            type.checked = (engineerRole & Math.pow(2, type.role)) > 0;
        });

        data2.push({
            name: '操作权限（11-20）',
            list: data1.roles
        });

        data1.roles.forEach(function (role) {
            role.checked = (engineerRole & Math.pow(2, role.role)) > 0;
        });

        var vue1 = new Vue({
            el: '#form',
            data: data1
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
                _id: id,
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

    app.init();
});