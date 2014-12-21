/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-21 14:56
 */

'use strict';

var engineer = require('../../models/').engineer;
var typeis = require('ydr-util').typeis;

module.exports = function (app) {
    var exports = {};

    /**
     * 用户列表
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        var data = {
            title: '用户管理'
        };

        res.render('admin/engineer-list.html', data);
    };


    /**
     * 我
     * @param req
     * @param res
     * @param next
     */
    exports.me = function (req, res, next) {
        var data = {
            title: '我',
            me: res.locals.$engineer
        };

        res.render('admin/engineer-me.html', data);
    };

    return exports;
};
