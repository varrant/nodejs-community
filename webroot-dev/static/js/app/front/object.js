/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:53
 */


define(function (require, exports, module) {
    'use strict';

    var Response = require('../../widget/front/Response/');
    var res = new Response('#response', {
        query:{
            page: window['-page-'],
            object: window['-object-']
        }
    });
});