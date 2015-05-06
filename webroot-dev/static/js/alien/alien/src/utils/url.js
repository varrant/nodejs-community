/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-03-05 15:42
 */


define(function (require, exports, module) {
    /**
     * @module utils/url
     * @requires utils/querystring
     * @requires utils/hashbang
     */
    'use strict';

    var qs = require('./querystring.js');
    var hb = require('./hashbang.js');
    var keys = ['hash', 'host', 'hostname', 'href', 'path', 'pathname', 'port', 'protocol'];
    var REG_QUERY = /\?(.*)#/;

    /**
     * url 解析
     * @param url {String} url 地址
     * @returns {Object}
     */
    exports.parse = function (url) {
        var link = document.createElement('a');

        link.href = url;

        var ret = {};

        keys.forEach(function (key) {
            ret[key] = link[key];
        });

        ret.querystring = (url.match(REG_QUERY) || ['', ''])[1];
        ret.query = qs.parse(ret.querystring);
        ret.search = ret.querystring ? '?' + ret.querystring : '';
        ret.hashbang = hb.parse(ret.hash);

        return ret;
    };


    /**
     * url 字符化
     * @param obj {Object} url 信息
     * @returns {string}
     */
    exports.stringify = function (obj) {
        obj.protocol = obj.protocol || 'http:';
        obj.host = obj.host || '';
        obj.pathname = obj.pathname || '';
        obj.search = obj.search || '';
        obj.hash = obj.hash || '';

        return obj.protocol + '//' + obj.host + obj.pathname + obj.search + obj.hash;
    };
});