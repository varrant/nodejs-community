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
    var Loading = require('../../alien/ui/Loading/');
    var doc = window.document;
    var STATUS = {
        self: '我自己',
        on: '<i class="fi fi-heart"></i>已关注 TA',
        un: '<i class="fi fi-heart-o"></i>关注 TA'
    };
    var $follows = selector.query('.follow-developer');
    var changeStatus = function($btn, status){

    };

    $follows.forEach(function ($follow) {
        var id = attribute.data($follow, 'id');

        new Loading($follow, {
            isModal: true,
            text: null,
            style: {
                size: 30,
                backgroundColor: 'rgba(0,0,0,0)'
            }
        });

        ajax({
            loading: false,
            url: '/api/developer/is-follow/',
            query: {
                id: id
            }
        }).on('error');
    });

    // 关注个人
    event.on(doc, 'click', '.follow-developer', function () {

    });
});