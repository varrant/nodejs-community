/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:28
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../modules/admin/List.js');

    require('../../modules/front/nav.js');
    require('../../modules/front/footer.js');

    new List('#list', '#pagination', {
        query: {
            section: window['-section-'].id
        }
    });
});