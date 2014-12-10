/*!
 * 用户相关
 * @author ydr.me
 * @create 2014-11-22 15:26
 */

'use strict';

var role = require('../../configs/').role;
var user = require('../models/').user;
var setting = require('../models/').setting;
var object = require('../models/').object;
var random = require('ydr-util').random;
var dato = require('ydr-util').dato;
var crypto = require('ydr-util').dato;
var request = require('ydr-util').request;
var typeis = require('ydr-util').typeis;
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
 * 增加评论数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseCommentCount = function (conditions, count, callback) {
    user.increase(conditions, 'commentCount', count, callback);
};


/**
 * 增加阅读数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseViewCount = function (conditions, count, callback) {
    user.increase(conditions, 'viewCount', count, callback);
};


/**
 * 增加赞同数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increasePraiseCount = function (conditions, count, callback) {
    user.increase(conditions, 'praiseCount', count, callback);
};


/**
 * 增加关注数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increasePraiseCount = function (conditions, count, callback) {
    user.increase(conditions, 'followCount', count, callback);
};


/**
 * 增加积分
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseScore = function (conditions, count, callback) {
    user.increase(conditions, 'score', count, callback);
};


/**
 * 设置阻止
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.setBlock = function (conditions, callback) {
    user.toggle(conditions, 'isBlock', true, callback);
};

/**
 * 取消阻止
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.cancelBlock = function (conditions, callback) {
    user.toggle(conditions, 'isBlock', false, callback);
};


/**
 * 加入组织
 * @param conditions {Object} 查询条件
 * @param organizationId {String} 组织 ID
 * @param callback {Function} 回调
 */
exports.joinOrganization = function (conditions, organizationId, callback) {
    object.findOne({
        _id: organizationId
    }, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('organization is not exist');
            err.type = 'notFound';
            return callback(err);
        }

        user.push(conditions, 'organizations', organizationId, callback);
    });
};


/**
 * 创建 oauth 链接
 * @param oauthSettings {Object} oauth 配置
 * @param redirect {String} 跳转地址
 * @returns {Object}
 */
exports.createOauthURL = function (oauthSettings, redirect) {
    var num1 = random.number(1, 100);
    var num2 = random.number(1, 100);
    var num3 = num1 + num2;
    var state = num1 + '\n' + num2 + '\n' + num3;
    var params = {
        scope: 'user:email',
        redirect_uri: redirect,
        state: state = crypto.encode(state, configs.secret.session.secret)
    };

    dato.extend(true, params, oauthSettings);

    return {
        url: urls.authorize + '?' + qs.stringify(params),
        state: state
    };
};


/**
 * 解析 oauth 回来的 state 值
 * @param state {String} state 值
 * @returns {Boolean}
 */
exports.isSafeOauthState = function (state) {
    var ret = crypto.decode(state, configs.secret.session.secret);
    var arr = ret.split('\n');
    var num1 = dato.parseInt(arr[0], 0);
    var num2 = dato.parseInt(arr[1], 0);
    var num3 = dato.parseInt(arr[2], 0);

    return num1 + num2 === num3;
};


/**
 * oauth 回调
 * @param oauthSettings {Object} oauth 配置
 * @param code {String} 授权 code
 * @param callback {Function} 回调
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

            request.post(url, requestOptions, function (err, data, res) {
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

            request.get(url, requestOptions, function (err, data, res) {
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

            //{
            //    login: 'cloudcome',
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
            //    updated_at: '2014-11-22T16:26:16Z'
            // }

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


/**
 * 判断用户是否有权限做指定的事
 * @param conditionsOrRole {Object|Number} 查询条件或角色值
 * @param doWhat {String} 事
 * @param callback {Function} 回调
 * @returns {*}
 */
exports.can = function (conditionsOrRole, doWhat, callback) {
    // 没有限制的，表示可做
    if (role[doWhat] === undefined) {
        return callback(null, true);
    }

    var canRole = role[doWhat];
    var userRole;
    var canDo;

    if (typeis(conditionsOrRole) === 'number') {
        userRole = conditionsOrRole;
        canDo = userRole & canRole > 0;

        return callback(null, canDo);
    }

    user.findOne(conditionsOrRole, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('user is not exist');
            err.type = 'notFound';
            return callback(err);
        }

        userRole = doc.role;
        canDo = userRole & canRole > 0;

        callback(null, canDo);
    });
};