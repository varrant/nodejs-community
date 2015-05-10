/*!
 * 分享
 * @author ydr.me
 * @create 2015-03-22 16:24
 */


define(function (require, exports, module) {
    'use strict';

    var event = require('../../alien/core/event/base.js');
    var open = function (url) {
        var screenW = window.screen.width;
        var screenH = window.screen.height;
        var winW = 650;
        var winH = 400;
        var left = (screenW - winW) / 2;
        var top = (screenH - winH) / 3;

        if (screenW > 1080) {
            window.open(url, '',
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
        qs.push('title=' + e('写的不错，分享一下啦。《' + document.title + '》'));
        qs.push('appkey=' + e('3801039502'));
        qs.push('searchPic=' + e('true'));
        open(url + qs.join('&'));
    });

    event.on(document, 'click', '.share-qq', function () {
        // http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey
        // ?desc=%E5%A6%88%EF%BC%8C%E8%BF%99%E9%83%A8%E5%89%A7%E9%87%8C%E7%9A%84%E5%A5%B9%E5%83%8F%E6%82%A8%EF%BC%81
        // &url=http://c.youku.com/2015mother
        // &imageUrl=http://u2.tdimg.com/1/166/196/124753886610095098114070284388517334621.jpg
        // &summary=%E9%99%8C%E7%94%9F%E7%9A%84%E5%9F%8E%E5%B8%82%EF%BC%8C%E7%96%8F%E8%BF%9C%E7%9A%84%E4%BA%B2%E6%83%85%EF%BC%8C%E8%BF%9C%E5%88%B0%E5%87%A0%E4%B9%8E%E6%97%A0%E6%B3%95%E5%8B%BE%E5%8B%92%E6%9C%80%E8%BF%91%E4%B8%80%E6%AC%A1%E7%9B%B8%E8%81%9A%E7%9A%84%E6%83%85%E6%99%AF%EF%BC%8C%E4%BD%86%E6%88%91%E4%BB%AC%E9%83%BD%E7%9F%A5%E9%81%93%EF%BC%8C%E5%A5%B9%E6%83%B3%E8%A6%81%E7%9A%84%E7%9C%9F%E7%9A%84%E4%B8%8D%E5%A4%9A%EF%BC%8C%E7%BA%B5%E4%BD%BF%E4%B8%80%E7%A2%97%E7%B2%97%E8%8C%B6%EF%BC%8C%E4%B9%9F%E8%83%BD%E6%BF%80%E8%B5%B7%E4%B8%80%E7%89%87%E6%B6%9F%E6%BC%AA%E3%80%82
        // &desc=%E9%99%8C%E7%94%9F%E7%9A%84%E5%9F%8E%E5%B8%82%EF%BC%8C%E7%96%8F%E8%BF%9C%E7%9A%84%E4%BA%B2%E6%83%85%EF%BC%8C%E8%BF%9C%E5%88%B0%E5%87%A0%E4%B9%8E%E6%97%A0%E6%B3%95%E5%8B%BE%E5%8B%92%E6%9C%80%E8%BF%91%E4%B8%80%E6%AC%A1%E7%9B%B8%E8%81%9A%E7%9A%84%E6%83%85%E6%99%AF%EF%BC%8C%E4%BD%86%E6%88%91%E4%BB%AC%E9%83%BD%E7%9F%A5%E9%81%93%EF%BC%8C%E5%A5%B9%E6%83%B3%E8%A6%81%E7%9A%84%E7%9C%9F%E7%9A%84%E4%B8%8D%E5%A4%9A%EF%BC%8C%E7%BA%B5%E4%BD%BF%E4%B8%80%E7%A2%97%E7%B2%97%E8%8C%B6%EF%BC%8C%E4%B9%9F%E8%83%BD%E6%BF%80%E8%B5%B7%E4%B8%80%E7%89%87%E6%B6%9F%E6%BC%AA%E3%80%82
        var url = 'http://v.t.sina.com.cn/share/share.php?';
        var qs = [];

        qs.push('url=' + e(location.href));
        qs.push('title=' + e('写的不错，分享一下啦。《' + document.title + '》'));
        qs.push('appkey=' + e('3801039502'));
        qs.push('searchPic=' + e('true'));
        open(url + qs.join('&'));
    });




    // http://tieba.baidu.com/f/commit/share/openShareApi
    // ?url=http://c.youku.com/2015mother
    // &title=%E5%A6%88%EF%BC%8C%E8%BF%99%E9%83%A8%E5%89%A7%E9%87%8C%E7%9A%84%E5%A5%B9%E5%83%8F%E6%82%A8%EF%BC%81
    // &pic=http://u2.tdimg.com/1/166/196/124753886610095098114070284388517334621.jpg
    // &desc=%E9%99%8C%E7%94%9F%E7%9A%84%E5%9F%8E%E5%B8%82%EF%BC%8C%E7%96%8F%E8%BF%9C%E7%9A%84%E4%BA%B2%E6%83%85%EF%BC%8C%E8%BF%9C%E5%88%B0%E5%87%A0%E4%B9%8E%E6%97%A0%E6%B3%95%E5%8B%BE%E5%8B%92%E6%9C%80%E8%BF%91%E4%B8%80%E6%AC%A1%E7%9B%B8%E8%81%9A%E7%9A%84%E6%83%85%E6%99%AF%EF%BC%8C%E4%BD%86%E6%88%91%E4%BB%AC%E9%83%BD%E7%9F%A5%E9%81%93%EF%BC%8C%E5%A5%B9%E6%83%B3%E8%A6%81%E7%9A%84%E7%9C%9F%E7%9A%84%E4%B8%8D%E5%A4%9A%EF%BC%8C%E7%BA%B5%E4%BD%BF%E4%B8%80%E7%A2%97%E7%B2%97%E8%8C%B6%EF%BC%8C%E4%B9%9F%E8%83%BD%E6%BF%80%E8%B5%B7%E4%B8%80%E7%89%87%E6%B6%9F%E6%BC%AA%E3%80%82
});