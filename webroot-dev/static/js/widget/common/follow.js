/*!
 * 关注
 * @author ydr.me
 * @create 2015-05-17 19:44
 */


define(function (require, exports, module) {
    'use strict';

    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var event = require('../../alien/core/event/base.js');
    var ajax = require('../../widget/common/ajax.js');
    var confirm = require('../../alien/widgets/confirm.js');
    var alert = require('../../alien/widgets/alert.js');
    var win = window;
    var doc = win.document;
    var STATUS = {
        me: '我自己',
        on: '<i class="fi fi-heart"></i>已关注 TA',
        un: '<i class="fi fi-heart-o"></i>关注 TA'
    };
    var $follows = selector.query('.follow-developer');
    var changeStatus = function ($btn, status) {
        $btn.innerHTML = STATUS[status];
        $btn.status = status;
    };
    var winDeveloper = win['-developer-'];
    var winWebsite = win['-website-'];

    $follows.forEach(function ($follow) {
        var id = attribute.data($follow, 'id');

        if (!winDeveloper.id) {
            return changeStatus($follow, 'un');
        }

        if (winDeveloper.id === id) {
            return changeStatus($follow, 'me');
        }

        ajax({
            loading: false,
            url: '/admin/api/developer/follow/',
            query: {
                id: id
            }
        }).on('success', function (json) {
            changeStatus($follow, json.status);
        }).on('error', function () {
            changeStatus($follow, 'un');
        });
    });

    // 关注个人
    event.on(doc, 'click', '.follow-developer', function () {
        var status = this.status;

        if (!status) {
            return alert('我还没有准备好呢');
        }

        if (status === 'me') {
            return alert('感谢你对 <b>' + winWebsite.title + '</b> 的大力支持，我们将一如既然的视你如初见。谢谢你，<b>' +
                winDeveloper.nickname + '</b>！', {
                title: '谢谢你',
                buttons: ['么么哒']
            });
        }
    });
});