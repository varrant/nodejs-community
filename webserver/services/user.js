/*!
 * 用户相关
 * @author ydr.me
 * @create 2014-11-22 15:26
 */

'use strict';

var user = require('../models/').user;
var setting = require('../models/').setting;
var ydrUtil = require('ydr-util');
var configs = require('../../configs/');
var qs = require('querystring');
var howdo = require('howdo');
var urls = {
    authorize: 'https://github.com/login/oauth/authorize',
    accessToken: 'https://github.com/login/oauth/access_token',
    user: 'https://api.github.com/user'
};

/**
 * 注册
 */
exports.register = user.createOne;

/**
 * 登录
 */
exports.login = user.existOne;


/**
 * 查找
 */
exports.findOne = user.findOne;


/**
 * 查找更新
 */
exports.findOneAndUpdate = user.findOneAndUpdate;


/**
 * 获取meta
 */
exports.getMeta = user.getMeta;


/**
 * 设置meta
 */
exports.setMeta = user.setMeta;


/**
 * count
 */
exports.count = user.count;


/**
 * 评论自增
 * @param conditions
 * @param callback
 */
exports.increaseComment = function (conditions, callback) {
    user.increase(conditions, 'commentCount', 1, callback);
};

/**
 * 阅读自增
 * @param conditions
 * @param callback
 */
exports.increaseView = function (conditions, callback) {
    user.increase(conditions, 'viewCount', 1, callback);
};

/**
 * 点赞自增
 * @param conditions
 * @param callback
 */
exports.increasePraise = function (conditions, callback) {
    user.increase(conditions, 'praiseCount', 1, callback);
};


/**
 * 增加积分
 * @param conditions
 * @param callback
 */
exports.increaseCoins = function (conditions, count, callback) {
    user.increase(conditions, 'score', count, callback);
};


/**
 * 创建 oauth 链接
 * @param oauth
 * @param redirect
 * @returns {Object}
 */
exports.createOauthURL = function (oauthSettings, redirect) {
    var num1 = ydrUtil.random.number(1, 100);
    var num2 = ydrUtil.random.number(1, 100);
    var num3 = num1 + num2;
    var state = num1 + '\n' + num2 + '\n' + num3;
    var params = {
        scope: 'user:email',
        redirect_uri: redirect,
        state: state = ydrUtil.crypto.encode(state, configs.secret.session.secret)
    };

    ydrUtil.dato.extend(true, params, oauthSettings);

    return {
        url: urls.authorize + '?' + qs.stringify(params),
        state: state
    };
};


/**
 * 解析 oauth 回来的 state 值
 * @param state
 */
exports.isSafeOauthState = function (state) {
    var ret = ydrUtil.crypto.decode(state, configs.secret.session.secret);
    var arr = ret.split('\n');
    var num1 = ydrUtil.dato.parseInt(arr[0], 0);
    var num2 = ydrUtil.dato.parseInt(arr[1], 0);
    var num3 = ydrUtil.dato.parseInt(arr[2], 0);

    return num1 + num2 === num3;
};


/**
 * oauth 回调
 * @param oauthSettings
 * @param code
 * @param callback
 */
exports.oauthCallback = function (oauthSettings, code, callback) {
    var requestOptions = {
        headers: {
            Accept: 'application/json',
            'User-Agent': oauthSettings.appName
        }
    };
    howdo
        // 1. 获取 accessToken
        .task(function (next) {
            var params = {
                code: code,
                app_name: oauthSettings.appName,
                client_id: oauthSettings.clientId,
                client_secret: oauthSettings.clientSecret
            };

            var url = urls.accessToken + '?' + qs.stringify(params);

            ydrUtil.request.post(url, requestOptions, function (err, data, res) {
                if (err) {
                    return next(err);
                }

                var json;

                try {
                    json = JSON.parse(data);
                } catch (err) {
                    json = null;
                }

                if (!json) {
                    return next(new Error('认证信息解析失败'));
                }

                if (res.statusCode !== 200) {
                    return next(new Error(json.message || '请求认证失败'));
                }

                next(err, json);
            });
        })
        // 获得 userInfo
        .task(function (next, json) {
            var params = {
                access_token: json.access_token
            };
            var url = urls.user + '?' + qs.stringify(params);

            ydrUtil.request.get(url, requestOptions, function (err, data, res) {
                if (err) {
                    return next(err);
                }

                var json;

                try {
                    json = JSON.parse(data);
                    json.accessToken = params.access_token;
                } catch (err) {
                    json = null;
                }

                if (!json) {
                    return next(new Error('用户信息解析失败'));
                }

                if (res.statusCode !== 200) {
                    return next(new Error(json.message || '请求认证失败'));
                }

                next(err, json);
            });
        })
        // 异步串行
        .follow(function (err, json) {
            if (err) {
                return callback(err);
            }

            //{ login: 'cloudcome',
            //    id: 3362033,
            //    avatar_url: 'https://avatars.githubusercontent.com/u/3362033?v=3',
            //    gravatar_id: '',
            //    url: 'https://api.github.com/users/cloudcome',
            //    html_url: 'https://github.com/cloudcome',
            //    followers_url: 'https://api.github.com/users/cloudcome/followers',
            //    following_url: 'https://api.github.com/users/cloudcome/following{/other_user}',
            //    gists_url: 'https://api.github.com/users/cloudcome/gists{/gist_id}',
            //    starred_url: 'https://api.github.com/users/cloudcome/starred{/owner}{/repo}',
            //    subscriptions_url: 'https://api.github.com/users/cloudcome/subscriptions',
            //    organizations_url: 'https://api.github.com/users/cloudcome/orgs',
            //    repos_url: 'https://api.github.com/users/cloudcome/repos',
            //    events_url: 'https://api.github.com/users/cloudcome/events{/privacy}',
            //    received_events_url: 'https://api.github.com/users/cloudcome/received_events',
            //    type: 'User',
            //    site_admin: false,
            //    name: '云淡然',
            //    company: 'netease',
            //    blog: 'http://ydr.me',
            //    location: 'hangzhou',
            //    email: 'cloudcome@163.com',
            //    hireable: true,
            //    bio: null,
            //    public_repos: 41,
            //    public_gists: 0,
            //    followers: 18,
            //    following: 4,
            //    created_at: '2013-01-24T01:59:23Z',
            //    updated_at: '2014-11-22T16:26:16Z' }

            var ret = {
                accessToken: json.accessToken,
                github: json.login,
                email: json.email,
                nickname: json.name,
                meta: {
                    bio: json.bio,
                    location: json.location,
                    company: json.company,
                    blog: json.blog
                }
            };

            callback(null, ret);
        });
};