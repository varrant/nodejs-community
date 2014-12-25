/*!
 * 用户相关
 * @author ydr.me
 * @create 2014-11-22 15:26
 */

'use strict';

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
var role20 = 1 << 20;


/**
 * 注册
 */
exports.register = engineer.createOne;


/**
 * 登录
 */
exports.login = engineer.existOne;


/**
 * 查找一个
 */
exports.findOne = engineer.findOne;


/**
 * 查找
 */
exports.find = engineer.find;


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
 * 修改他人 权限
 * @param operator
 * @param engineerBy
 * @param roleArray
 * @param callback
 * @returns {*}
 */
exports.modifyRole = function (operator, engineerBy, roleArray, callback) {
    if (
        // 只有 founder 才有权限修改他人权限
    (operator.role & role20) !== 0 &&
        // 不允许修改自己的权限
    operator.id.toString() !== engineerBy.id.toString() &&
        // 不允许修改为 founder 的权限
    roleArray.indexOf(20) === -1
    ) {
        var group = '';
        var maxRole = 0;
        var roleCount = 0;

        dato.each(configs.group, function (index, gp) {
            if (gp.role !== 20) {
                if (roleArray.indexOf(gp.role) > -1) {
                    group = gp.name;
                    maxRole = gp.role;
                    return false;
                }
            }
        });

        // 取发布权限
        roleArray.forEach(function (role) {
            if (role < 11) {
                roleCount += 1 << role;
            }
        });

        // 继承操作权限
        roleCount += _pow(11, maxRole);

        var data = {
            role: roleCount,
            group: group
        };

        engineer.findOneAndUpdate({_id: engineerBy.id}, data, callback);
    }
    // founder 才有权限修改他人权限
    else if ((operator.role & role20) === 0) {
        var err = new Error('权限不足');
        err.status = 403;
        return callback(err);
    }
    // 不允许修改自己的权限
    else if (operator.id.toString() === engineerBy.id.toString()) {
        var err = new Error('founder 的权限已经最大，无须修改');
        return callback(err);
    }
    // 不允许修改为 founder 的权限
    else if (roleArray.indexOf(20) !== -1) {
        var err = new Error('不允许修改为 founder 的权限');
        return callback(err);
    }
};


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
exports.increaseReplyByCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'replyByCount', count, callback);
};


/**
 * 增加同意数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAgreeByCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'agreeByCount', count, callback);
};


/**
 * 增加赞同数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAcceptByCount = function (conditions, count, callback) {
    engineer.increase(conditions, 'acceptByCount', count, callback);
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
        path: 'followByCount',
        object: userId,
        value: 1
    }, function (err, isModified) {
        callback(err);

        if (isModified) {
            engineer.increase({_id: operatorId}, 'followCount', 1, log.holdError);
            engineer.increase({_id: userId}, 'followByCount', 1, log.holdError);
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
        path: 'followByCount',
        object: userId,
        value: 0
    }, function (err, isModified) {
        callback(err);

        if (isModified) {
            engineer.increase({_id: operatorId}, 'followCount', -1, log.holdError);
            engineer.increase({_id: userId}, 'followByCount', -1, log.holdError);
        }
    });
};


/**
 * 增加 section 中的 object 统计
 * @param conditions {Object} 查询条件
 * @param sectionId {string} section Id
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseSectionStatistics = function (conditions, sectionId, count, callback) {
    engineer.findOne(conditions, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('该用户不存在');
            err.status = 404;
            return callback(err);
        }

        if (!doc.sectionStatistics) {
            doc.sectionStatistics = {};
        }

        var one = dato.parseInt(doc.sectionStatistics[sectionId], 0) + count;
        var all = dato.parseInt(doc.sectionStatistics['0'], 0) + count;
        var data = {};

        data[sectionId] = one;
        data['0'] = all;

        var data2 = dato.extend(doc.sectionStatistics, data);

        engineer.findOneAndUpdate(conditions, {sectionStatistics: data2}, callback);
    });
};


/**
 * 增加 category 中的 object 统计
 * @param conditions {Object} 查询条件
 * @param categoryId {string} category Id
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseCategoryStatistics = function (conditions, categoryId, count, callback) {
    engineer.findOne(conditions, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('该用户不存在');
            err.status = 404;
            return callback(err);
        }

        if (!doc.categoryStatistics) {
            doc.categoryStatistics = {};
        }

        var one = dato.parseInt(doc.categoryStatistics[categoryId], 0) + count;
        var all = dato.parseInt(doc.categoryStatistics['0'], 0) + count;
        var data = {};

        data[categoryId] = one;
        data['0'] = all;

        var data2 = dato.extend(doc.categoryStatistics, data);

        engineer.findOneAndUpdate(conditions, {categoryStatistics: data2}, callback);
    });
};

/**
 * 增加 column 中的 object 统计
 * @param conditions {Object} 查询条件
 * @param columnId {string} column Id
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseColumnStatistics = function (conditions, columnId, count, callback) {
    engineer.findOne(conditions, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('该用户不存在');
            err.status = 404;
            return callback(err);
        }

        if (!doc.columnStatistics) {
            doc.columnStatistics = {};
        }

        var one = dato.parseInt(doc.columnStatistics[columnId], 0) + count;
        var all = dato.parseInt(doc.columnStatistics['0'], 0) + count;
        var data = {};

        data[columnId] = one;
        data['0'] = all;

        var data2 = dato.extend(doc.columnStatistics, data);

        engineer.findOneAndUpdate(conditions, {columnStatistics: data2}, callback);
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
        // 2. 获得 userInfo
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
                githubLogin: json.login,
                githubId: String(json.id),
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
 * 段阶乘
 * @param min
 * @param max
 * @returns {number}
 * @private
 */
function _pow(min, max) {
    var ret = 0;
    for (; min <= max; min++) {
        ret += 1 << min;
    }
    return ret;
}