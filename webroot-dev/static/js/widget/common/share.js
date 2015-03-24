/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-03-22 16:24
 */


define(function (require, exports, module) {
    'use strict';

    var modification = require('../../alien/core/dom/modification.js');
    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');

    window._bd_share_config = {
        "common": {
            "bdSnsKey": {},
            "bdText": "",
            "bdMini": "2",
            "bdMiniList": false,
            "bdPic": "",
            "bdStyle": "1",
            "bdSize": "16"
        },
        "share": {}
    };

    var src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
    var script = modification.create('script', {
        src: src,
        async: true,
        defer: true
    });
    var html = '<a class="bds_tsina" data-cmd="tsina"></a>' +
        '<a class="bds_weixin" data-cmd="weixin"></a>' +
        '<a class="bds_sqq" data-cmd="sqq"></a>' +
        '<a class="bds_qzone" data-cmd="qzone"></a>' +
        '<a class="bds_youdao" data-cmd="youdao"></a>' +
        '<a class="bds_mail" data-cmd="mail"></a>' +
        '<a class="bds_count" data-cmd="count"></a>';

    module.exports = function ($parent) {
        $parent = selector.query($parent)[0];

        if (!$parent) {
            return;
        }

        $parent.innerHTML = html;
        attribute.addClass($parent, 'bdsharebuttonbox');
        modification.insert(script, document.body);
    };
});