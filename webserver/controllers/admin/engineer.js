/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-21 14:56
 */

'use strict';

var engineer = require('../../models/').engineer;
var typeis = require('ydr-util').typeis;
var role20 = 1 << 20;

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

        var engineerRole = res.locals.$engineer.role;

        if ((engineerRole & role20) === 0) {
            return next();
        }

        res.render('admin/engineer-list.html', data);
    };


    /**
     * 获取某个用户
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        var data = {
            title: '用户详情',
            id: req.query.id || ''
        };

        var engineerRole = res.locals.$engineer.role;

        if ((engineerRole & role20) === 0) {
            return next();
        }

        res.render('admin/engineer-detail.html', data);
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
