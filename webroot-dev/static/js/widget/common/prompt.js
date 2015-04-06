/*!
 * prompt
 * @author ydr.me
 * @create 2014-12-14 16:34
 */


define(function (require, exports, module) {
    'use strict';

    var prompt = require('../../alien/widgets/prompt.js');

    module.exports = function (tips, defaultValue) {
        return prompt(tips, defaultValue || '', {
            input: {
                className: 'ipt'
            }
        });
    };
});