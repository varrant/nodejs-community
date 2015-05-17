/*!
 * api developer controller
 * @author ydr.me
 * @create 2014-11-23 11:51
 */

'use strict';


var configs = require('../../../configs/');
var developer = require('../../services/').developer;
var setting = require('../../services/').setting;
var interactive = require('../../services/').interactive;
var cookie = require('../../utils/').cookie;
var filter = require('../../utils/').filter;
var howdo = require('howdo');
var dato = require('ydr-utils').dato;
var number = require('ydr-utils').number;
var typeis = require('ydr-utils').typeis;
var cache = require('ydr-utils').cache;
var role20 = 1 << 20;


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
            var err = new Error('请重新授权操作');
            err.redirect = '/developer/oauth/authorize/';
            return next(err);
        }

        var githubOauth = req.session.$github;
        var githubId = githubOauth.githubId;

        delete(githubOauth.githubId);
        githubOauth.loginAt = new Date();

        var options = {};

        // 创建之前
        options.onbeforecreate = function (data) {
            data.index = cache.get('app.autoIndex');
            return data;
        };

        // 创建之后
        options.onaftercreate = function (data) {
            cache.increase('app.autoIndex', 1);
            cache.get('app.count').developers += 1;
        };

        developer.login({
            githubId: githubId
        }, githubOauth, options, function (err, doc) {
            req.session.$github = null;

            if (err) {
                return next(err);
            }

            cookie.login(res, doc.id);
            req.session.$developer = res.locals.$developer = doc;
            res.json({
                code: 200,
                data: {
                    login: true,
                    message: '登录成功',
                    redirect: req.session.$redirect || '/'
                }
            });
            req.session.$redirect = null;
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
        var options = filter.skipLimit(req.query);

        if (id) {
            developer.findOne({
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
            howdo
                // 1. 计数
                .task(function (done) {
                    developer.count({}, done);
                })
                // 2. 分页
                .task(function (done) {
                    options.sort = {
                        index: 1
                    };
                    developer.find({}, options, done);
                })
                .together(function (err, count, docs) {
                    if (err) {
                        return next(err);
                    }

                    res.json({
                        code: 200,
                        data: {
                            list: docs,
                            count: count
                        }
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

        developer.findOne({
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
                    developer: doc,
                    section: cache.get('app.sectionList'),
                    category: cache.get('app.categoryList'),
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
        var body = req.body;
        var id = body.id;
        var roleArray = body.roleArray;

        if (typeis(roleArray) !== 'array') {
            var err = new Error('请求参数不合法');
            return next(err);
        }

        var roleArray2 = [];

        roleArray.forEach(function (role) {
            role = number.parseInt(role, 0);

            if (roleArray2.indexOf(role) === -1) {
                roleArray2.push(role);
            }
        });

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({_id: id}, next);
            })
            // 修改权限
            .task(function (next, doc) {
                developer.modifyRole(res.locals.$developer, doc, roleArray2, next);
            })
            // 异步串行
            .follow(function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    return next();
                }

                // 记录下被修改者的信息，以便下次访问时更新
                res.json({
                    code: 200,
                    data: doc
                });
                cache.get('modify.developers')[doc.id] = doc;
            });
    };



    exports.getFollowStatus = function (req, res, next) {
        interactive.findOne({
            source: req.session.$developer.id,
            target: req.query.id,
            type: 'follow'
        }, function (err, doc) {
            if(err){
                return next(err);
            }

            if(!doc){
                return res.json({
                    code: 200,
                    data: {
                        status: 'un'
                    }
                });
            }
        });
    };

    return exports;
};
