/*!
 * 用户相关
 * @author ydr.me
 * @create 2014-11-22 15:26
 */

'use strict';

var role = require('../../configs/').role;
var engineer = require('../models/').engineer;
var object = require('./object.js');
var interactive = require('./interactive.js');
var random = require('ydr-util').random;
var dato = require('ydr-util').dato;
var crypto = require('ydr-util').crypto;
var request = require('ydr-util').request;
var typeis = require('ydr-util').typeis;
var log = require('ydr-log');
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
exports.register = engineer.createOne;


/**
 * 登录
 */
exports.login = engineer.existOne;


/**
 * 查找
 */
exports.findOne = engineer.findOne;


/**
 * 查找更新
 */
exports.findOneAndUpdate = engineer.findOneAndUpdate;


/**
 * 获取meta
 */
exports.getMeta = engineer.getMeta;


/**
 * 设置meta
 */
exports.setMeta = engineer.setMeta;


/**
 * count
 */
exports.count = engineer.count;


/**
 * 增加积分
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseScore = function (conditions, count, callback) {
    engineer.increase(conditions, 'score', count, callback);
};


/**
 * 增加阅读数量（主页访问数量）
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseViewCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'viewCount', count, callback);
};


/**
 * 增加评论数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseCommentCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'commentCount', count, callback);
};


/**
 * 增加回复数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseRepliedCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'repliedCount', count, callback);
};


/**
 * 增加同意数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAgreedCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'agreedCount', count, callback);
};


/**
 * 增加赞同数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAcceptedCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'acceptedCount', count, callback);
};


/**
 * 关注某人
 * @param operatorId {String} 关注者 ID
 * @param userId {String} 被关注者 ID
 * @param callback {Function} 回调
 */
exports.follow = function (operatorId, userId, callback) {
    interactive.active({
        operator: operatorId,
        model: 'user',
        path: 'followedCount',
        object: userId,
        value: 1
    }, function (err, isModified) {
        callback(err);

        if (isModified) {
            engineer.increase({_id: operatorId}, 'followCount', 1, log.holdError);
            engineer.increase({_id: userId}, 'followedCount', 1, log.holdError);
        }
    });
};


/**
 * 取消关注某人
 * @param operatorId {String} 取消关注者 ID
 * @param userId {String} 被取消关注者 ID
 * @param callback {Function} 回调
 */
exports.unfollow = function (operatorId, userId, callback) {
    interactive.active({
        operator: operatorId,
        model: 'user',
        path: 'followedCount',
        object: userId,
        value: 0
    }, function (err, isModified) {
        callback(err);

        if (isModified) {
            engineer.increase({_id: operatorId}, 'followCount', -1, log.holdError);
            engineer.increase({_id: userId}, 'followedCount', -1, log.holdError);
        }
    });
};


/**
 * 增加 object 类别的数量
 * @param conditions {Object} 查询条件
 * @param type {string} 类别名称
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseObjectTypeCount = function (conditions, type, count, callback) {
    engineer.findOne(conditions, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('the user is not exist');
            err.type = 'notFound';
            return callback(err);
        }

        if (!doc.objectStatistics) {
            doc.objectStatistics = {};
        }
        var one = dato.parseInt(doc.objectStatistics[type], 0) + count;
        var all = dato.parseInt(doc.objectStatistics._all, 0) + count;
        var data = {};

        data[type] = one;
        data._all = all;

        var data2 = dato.extend(doc.objectStatistics, data);

        engineer.findOneAndUpdate(conditions, {objectStatistics: data2}, callback);
    });
};


/**
 * 设置阻止
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.setBlock = function (conditions, callback) {
    engineer.toggle(conditions, 'isBlock', true, callback);
};

/**
 * 取消阻止
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.cancelBlock = function (conditions, callback) {
    engineer.toggle(conditions, 'isBlock', false, callback);
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
            err = new Error('the organization is not exist');
            err.type = 'notFound';
            return callback(err);
        }

        engineer.push(conditions, 'organizations', organizationId, callback);
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
    // https://developer.github.com/v3/oauth/#redirect-users-to-request-github-access
    var params = {
        client_id: oauthSettings.clientId,
        redirect_uri: redirect,
        scope: 'user:email',
        state: state = crypto.encode(state, configs.secret.session.secret)
    };

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

            requestOptions.url = urls.accessToken + '?' + qs.stringify(params);
            request.post(requestOptions, function (err, data, res) {
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
            requestOptions.url = urls.user + '?' + qs.stringify(params);

            request.get(requestOptions, function (err, data, res) {
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

    var mustRole = Math.pow(2, role[doWhat]);
    var userRole;
    var canDo;

    if (typeis(conditionsOrRole) === 'number') {
        userRole = conditionsOrRole;
        canDo = userRole & mustRole > 0;

        return callback(null, canDo);
    }

    engineer.findOne(conditionsOrRole, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('user is not exist');
            err.type = 'notFound';
            return callback(err);
        }

        userRole = doc.role;
        canDo = userRole & mustRole > 0;

        callback(null, canDo);
    });
};
