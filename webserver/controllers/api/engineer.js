/*!
 * 用户相关 API
 * @author ydr.me
 * @create 2014-11-23 11:51
 */

'use strict';


var configs = require('../../../configs/');
var engineer = require('../../services/').engineer;
var setting = require('../../services/').setting;
var cookie = require('../../utils/').cookie;
var filter = require('../../utils/').filter;
var howdo = require('howdo');
var dato = require('ydr-util').dato;
var role20 = Math.pow(2, 20);


module.exports = function (app) {
    var exports = {};

    /**
     * 登录 API
     * @param req
     * @param res
     * @param next
     */
    exports.login = function (req, res, next) {
        var body = req.body || {};
        var accessToken = body.accessToken;

        if (!(req.session && req.session.$github &&
            req.session.$github.accessToken === accessToken)) {
            return next(new Error('请重新授权操作'));
        }

        var githubOauth = req.session.$github;
        var githubId = githubOauth.githubId;

        delete(githubOauth.githubId);
        githubOauth.loginAt = new Date();

        engineer.login({
            githubId: githubId
        }, githubOauth, function (err, doc) {
            req.session.$github = null;

            if (err) {
                return next(err);
            }

            cookie.login(res, doc.id);
            req.session.$engineer = res.locals.$engineer = doc;
            res.json({
                code: 200,
                data: true,
                message: '登录成功'
            });
        });
    };


    /**
     * 退出
     * @param req
     * @param res
     * @param next
     */
    exports.logout = function (req, res, next) {
        cookie.logout(req, res)
        res.json({
            code: 200
        });
    };


    /**
     * 所有/某个用户
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        var id = req.query.id;
        var options = filter.skipLimit(req);

        if (id) {
            engineer.findOne({
                _id: id
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                res.json({
                    code: 200,
                    data: doc
                });
            });
        } else {
            engineer.find({}, options, function (err, docs) {
                res.json({
                    code: 200,
                    data: docs
                });
            });
        }
    };


    /**
     * 获取某个用户详情，包括：用户信息、版块权限信息、操作权限信息
     * @param req
     * @param res
     * @param next
     */
    exports.detail = function (req, res, next) {
        var id = req.query.id;

        engineer.findOne({
            _id: id
        }, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (!doc) {
                return next();
            }

            res.json({
                code: 200,
                data: {
                    engineer: doc,
                    section: app.locals.$section,
                    group: configs.group
                }
            });
        });
    };


    /**
     * 修改用户权限
     * @param req
     * @param res
     * @param next
     */
    exports.role = function (req, res, next) {
        var ownerId = app.locals.$founder.id;
        var body = req.body;
        var id = body.id;
        var role = dato.parseInt(body.role, 1);

        if (id === ownerId) {
            return next(new Error('不能修改社区创始人权限'));
        }

        if (role & role20) {
            return next(new Error('不能赋予社区创始人权限'));
        }

        engineer.findOneAndUpdate({
            _id: id
        }, {
            role: role
        }, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200
            });
        });
    };

    return exports;
};
