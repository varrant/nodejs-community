/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-03-22 16:24
 */


define(function (require, exports, module) {
    'use strict';

    var modification = require('../../alien/core/dom/modification.js');

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
        src: src
    });

    modification.insert(script, document.body);
});