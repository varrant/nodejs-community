/*!
 * 数据的安全过滤
 * @author ydr.me
 * @create 2014-12-15 17:07
 */

'use strict';

var dato = require('ydr-util').dato;
var maxValue = Math.pow(2, 53);


/**
 * 翻页查询过滤
 * @param req {Object} 请求对象
 * @param [defaultPage=1] {Number} 默认页码
 * @param [defaultLimit=10] {Number} 默认每页数量
 * @returns {{page: Number, skip: Number, limit: Number}}
 */
exports.skipLimit = function (req, defaultPage, defaultLimit) {
    var query = req.query || {};
    var page = query.page;
    var limit = query.limit;

    defaultPage = defaultPage || 1;
    defaultLimit = defaultLimit || 20;

    page = dato.parseInt(page, defaultPage);
    limit = dato.parseInt(limit, defaultLimit);

    if (page < 1) {
        page = defaultPage;
    } else if (page > maxValue) {
        page = maxValue;
    }

    if (limit < 1) {
        limit = defaultLimit;
    } else if (limit > maxValue) {
        limit = maxValue;
    }

    return {
        page: page,
        skip: (page - 1) * limit,
        limit: limit
    };
};

