/*!
 * ajax
 * @author ydr.me
 * @create 2014-12-13 22:25
 */


define(function (require, exports, module) {
    'use strict';

    var xhr = require('../../alien/core/communication/xhr.js');
    var json = 'application/json; charset=utf-8';

    module.exports = function (options) {
        options.headers = options.headers || {};
        options.headers['content-type'] = json;
        options.headers['accept'] = json;
        options.headers['x-request-csrf'] = window['-csrf-'];
        options.data = JSON.stringify(options.data);

        return xhr.ajax(options);
    };
});