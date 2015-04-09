/*!
 * developer controller
 * @author ydr.me
 * @create 2014-12-21 14:56
 */

'use strict';

var developer = require('../../models/').developer;
var typeis = require('ydr-utils').typeis;
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

        var engineerRole = res.locals.$developer.role;

        if ((engineerRole & role20) === 0) {
            return next();
        }

        res.render('sadmin/developer-list.html', data);
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

        var engineerRole = res.locals.$developer.role;

        if ((engineerRole & role20) === 0) {
            return next();
        }

        res.render('sadmin/developer-detail.html', data);
    };

    return exports;
};
