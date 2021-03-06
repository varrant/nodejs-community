/*!
 * response 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:28
 */

'use strict';


var configs = require('../../configs/');
var xss = require('ydr-utils').xss;
var Validator = require('ydr-utils').Validator;
var validator = new Validator();
var regexp = require('../utils/').regexp;
var filter = require('../utils/').filter;
var REG_CONTENT = regexp.content(5, 5000);
var REG_TAG = /<[^>]*?>/g;

xss.config({
    atLink: '/developer/${at}/'
});

validator.pushRule({
    name: 'content',
    type: 'string',
    alias: '评论内容',
    trim: true,
    minLength: 5,
    maxLength: 5000,
    regexp: REG_CONTENT,
    onafter: function (val, data) {
        val = xss.mdSafe(val);

        var mdRender = xss.mdRender(val, {
            favicon: true,
            at: true
        });

        data.contentHTML = mdRender.html;

        if (!data.atList) {
            data.atList = mdRender.atList;
        }

        if (!data.contentHTML.replace(REG_TAG, '').trim()) {
            return new Error('文字内容不能为空');
        }

        return val;
    },
    msg: {
        regexp: '评论内容仅支持中英文、数字，以及常用符号'
    }
});

module.exports = validator;
