/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-03-22 16:24
 */


define(function (require, exports, module) {
    'use strict';

    //var modification = require('../../alien/core/dom/modification.js');
    //var selector = require('../../alien/core/dom/selector.js');
    var event = require('../../alien/core/event/base.js');
    //var attribute = require('../../alien/core/dom/attribute.js');
    var open = function (url) {
        var screenW = window.screen.width;
        var screenH = window.screen.height;
        var winW = 650;
        var winH = 400;
        var left = (screenW - winW) / 2;
        var top = (screenH - winH) / 3;

        if (screenW > 1080) {
            window.open(url, '授权 github 登录',
                'width=' + winW + ',height=' + winH + ',top=' + top + ',left=' + left + ',' +
                'scrollbars=no,resizable=no,menubar=no');
        } else {
            window.location.href = url;
        }
    };
    var e = encodeURIComponent;


    event.on(document, 'click', '.share-weibo', function () {
        var url = 'http://v.t.sina.com.cn/share/share.php?';
        //http://service.weibo.com/share/share.php
        // ?url=http://sb.com:18082/article/
        // &title=%E6%96%87%E7%AB%A0%20-%20%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E7%A4%BE%E5%8C%BA
        // &appkey=1343713053
        // &searchPic=true
        var qs = [];

        qs.push('url=' + e(location.href));
        qs.push('title=' + e(document.title));
        qs.push('appkey=' + e('3801039502'));
        qs.push('searchPic=' + e('true'));

        open(url + qs.join('&'));
    });

    //window._bd_share_config = {
    //    "common": {
    //        "bdSnsKey": {},
    //        "bdText": "",
    //        "bdMini": "2",
    //        "bdMiniList": false,
    //        "bdPic": "",
    //        "bdStyle": "1",
    //        "bdSize": "16"
    //    },
    //    "share": {}
    //};
    //
    //var src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
    //var script = modification.create('script', {
    //    src: src,
    //    async: true,
    //    defer: true
    //});
    //var html = '<a class="fi fi-weibo" data-cmd="tsina"></a>' +
    //    '<a class="fi fi-weixin" data-cmd="weixin"></a>' +
    //    '<a class="fi fi-qq" data-cmd="sqq"></a>' +
    //    '<a class="fi fi-star" data-cmd="qzone"></a>' +
    //    '<a class="fi fi-envelope" data-cmd="mail"></a>' +
    //    '<span data-cmd="count"></span>';

    //module.exports = function ($parent) {
    //    $parent = selector.query($parent)[0];
    //
    //    if (!$parent) {
    //        return;
    //    }
    //
    //    $parent.innerHTML = html;
    //    attribute.addClass($parent, 'bdsharebuttonbox');
    //    modification.insert(script, document.body);
    //};
});