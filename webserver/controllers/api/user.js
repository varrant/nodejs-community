/*!
 * 用户相关 API
 * @author ydr.me
 * @create 2014-11-23 11:51
 */

'use strict';


var configs = require('../../../configs/');
var user = require('../../services/').user;
var setting = require('../../services/').setting;
var cookie = require('../../utils/').cookie;


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
        var github = githubOauth.github;

        delete(githubOauth.github);
        githubOauth.loginAt = new Date();

        user.login({
            github: github
        }, githubOauth, function (err, doc) {
            req.session.$github = null;

            if (err) {
                return next(err);
            }

            cookie.login(res, doc._id);
            req.session.$user = res.locals.$user = doc.toObject();
            res.json({
                code: 200,
                data: true,
                message: '登录成功'
            });
        });
    };

    return exports;
};
