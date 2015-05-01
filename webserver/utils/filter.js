/*!
 * 数据的安全过滤
 * @author ydr.me
 * @create 2014-12-15 17:07
 */

'use strict';

var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;
var maxValue = 1 << 53;


/**
 * 翻页查询过滤
 * @param parent {Object} 上级
 * @param [defaultPage=1] {Number} 默认页码
 * @param [defaultLimit=10] {Number} 默认每页数量
 * @returns {{page: Number, skip: Number, limit: Number}}
 */
exports.skipLimit = function (parent, defaultPage, defaultLimit) {
    parent = parent || {};

    var page = parent.page;
    var limit = parent.limit;

    defaultPage = defaultPage || 1;
    defaultLimit = defaultLimit || 10;

    page = dato.parseInt(page, defaultPage);
    limit = dato.parseInt(limit, defaultLimit);

    if (page < 1) {
        page = defaultPage;
    } else if (page > maxValue) {
        page = maxValue;
    }

    if (limit === -1 || limit > maxValue) {
        limit = maxValue;
    } else if (limit < 1) {
        limit = defaultLimit;
    }

    return {
        page: page,
        skip: (page - 1) * limit,
        limit: limit
    };
};


var REG_SPACE = /[\x00-\x20\x7F-\xA0\u1680\u180E\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF\t\v]{1,}/g;
var REG_LINES = /[\n\r]{3,}/g;
var REG_LINE = /[\n\r]/g;

/**
 * 清洁输入
 * @param content
 * @param [isOneLine]
 * @returns {string}
 */
exports.cleanInput = function (content, isOneLine) {
    if (typeis(content) === 'undefined') {
        return '';
    }

    // 去除空白
    content = content.replace(REG_SPACE, ' ');
    // 去除多余空行
    content = content.replace(REG_LINES, '\n\n\n');

    if (isOneLine) {
        content = content.replace(REG_LINE, ' ');
    }

    return content;
};
