/*!
 * 用户相关
 * @author ydr.me
 * @create 2014-11-22 15:26
 */

'use strict';

var developer = require('../models/').developer;
var object = require('./object.js');
var interactive = require('./interactive.js');
var notice = require('./notice.js');
var random = require('ydr-utils').random;
var dato = require('ydr-utils').dato;
var number = require('ydr-utils').number;
var crypto = require('ydr-utils').encryption;
var request = require('ydr-utils').request;
var typeis = require('ydr-utils').typeis;
var log = require('ydr-utils').log;
var cache = require('ydr-utils').cache;
var configs = require('../../configs/');
var qs = require('querystring');
var howdo = require('howdo');
var urls = {
    authorize: 'https://github.com/login/oauth/authorize',
    accessToken: 'https://github.com/login/oauth/access_token',
    user: 'https://api.github.com/user',
    emails: 'https://api.github.com/user/emails'
};
var role20 = 1 << 20;


/**
 * 登录
 * @param conditions {Object} 查询条件
 * @param data {Object} 更新内容
 * @param callback {Function} 回调
 */
exports.login = developer.existOne;


/**
 * 查找一个
 */
exports.findOne = developer.findOne;


/**
 * 查找
 */
exports.find = developer.find;


/**
 * 查找更新
 */
exports.findOneAndUpdate = developer.findOneAndUpdate;


/**
 * 获取meta
 */
exports.getMeta = developer.getMeta;


/**
 * 设置meta
 */
exports.setMeta = developer.setMeta;


/**
 * count
 */
exports.count = developer.count;


/**
 * 修改他人 权限
 * @param operator
 * @param developerBy
 * @param roleArray
 * @param callback
 * @returns {*}
 */
exports.modifyRole = function (operator, developerBy, roleArray, callback) {
    var err;

    if (
        // 只有 founder 才有权限修改他人权限
    (operator.role & role20) !== 0 &&
        // 不允许修改自己的权限
    operator.id.toString() !== developerBy.id.toString() &&
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

        developer.findOneAndUpdate({_id: developerBy.id}, data, function (err, newDoc, oldDoc) {
            callback(err, newDoc, oldDoc);

            if (!err && newDoc) {
                notice.role(operator, developerBy, group || 'none');
            }
        });
    }
    // founder 才有权限修改他人权限
    else if ((operator.role & role20) === 0) {
        err = new Error('权限不足');
        err.code = 403;
        return callback(err);
    }
    // 不允许修改自己的权限
    else if (operator.id.toString() === developerBy.id.toString()) {
        err = new Error('founder 的权限已经最大，无须修改');
        return callback(err);
    }
    // 不允许修改为 founder 的权限
    else if (roleArray.indexOf(20) > -1) {
        err = new Error('不允许修改为 founder 的权限');
        return callback(err);
    } else {
        err = new Error('未知错误');
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
    developer.increase(conditions, 'score', count, callback);
};


/**
 * 增加 object 数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseObjectCount = function (conditions, count, callback) {
    developer.increase(conditions, 'objectCount', count, callback);
};


/**
 * 增加阅读数量（主页访问数量）
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseViewByCount = function (conditions, count, callback) {
    developer.increase(conditions, 'viewByCount', count, callback);
};


/**
 * 增加评论数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseCommentCount = function (conditions, count, callback) {
    developer.increase(conditions, 'commentCount', count, callback);
};


/**
 * 增加被评论数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseCommentByCount = function (conditions, count, callback) {
    developer.increase(conditions, 'commentByCount', count, callback);
};


/**
 * 增加回复数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseReplyCount = function (conditions, count, callback) {
    developer.increase(conditions, 'replyCount', count, callback);
};


/**
 * 增加回复数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseReplyByCount = function (conditions, count, callback) {
    developer.increase(conditions, 'replyByCount', count, callback);
};


/**
 * 增加赞同数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAgreeCount = function (conditions, count, callback) {
    developer.increase(conditions, 'agreeCount', count, callback);
};


/**
 * 增加被赞同数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAgreeByCount = function (conditions, count, callback) {
    developer.increase(conditions, 'agreeByCount', count, callback);
};


/**
 * 增加赞同数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAcceptCount = function (conditions, count, callback) {
    developer.increase(conditions, 'acceptCount', count, callback);
};


/**
 * 增加被赞同数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseAcceptByCount = function (conditions, count, callback) {
    developer.increase(conditions, 'acceptByCount', count, callback);
};


/**
 * 增加专辑数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 更新值
 * @param callback {Function} 回调
 */
exports.increaseColumnCount = function (conditions, count, callback) {
    developer.increase(conditions, 'columnCount', count, callback);
};


/**
 * 关注某人
 * @param operatorId {String} 关注者 ID
 * @param userId {String} 被关注者 ID
 * @param callback {Function} 回调
 */
exports.follow = function (operatorId, userId, callback) {
    interactive.active({
        source: operatorId,
        target: userId,
        type: 'follow',
        value: 1
    }, function (err, isModified) {
        callback(err);

        if (isModified) {
            developer.increase({_id: operatorId}, 'followCount', 1, log.holdError);
            developer.increase({_id: userId}, 'followByCount', 1, log.holdError);
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
        source: operatorId,
        target: userId,
        type: 'follow',
        value: 0
    }, function (err, isModified) {
        callback(err);

        if (isModified) {
            developer.increase({_id: operatorId}, 'followCount', -1, log.holdError);
            developer.increase({_id: userId}, 'followByCount', -1, log.holdError);
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
    developer.findOne(conditions, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('该用户不存在');
            err.code = 404;
            return callback(err);
        }

        if (!doc.sectionStatistics) {
            doc.sectionStatistics = {};
        }

        var one = number.parseInt(doc.sectionStatistics[sectionId], 0) + count;
        var all = number.parseInt(doc.sectionStatistics['0'], 0) + count;
        var data = {};

        data[sectionId] = one;
        data['0'] = all;

        var data2 = dato.extend(doc.sectionStatistics, data);

        developer.findOneAndUpdate(conditions, {sectionStatistics: data2}, callback);
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
    developer.findOne(conditions, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('该用户不存在');
            err.code = 404;
            return callback(err);
        }

        if (!doc.categoryStatistics) {
            doc.categoryStatistics = {};
        }

        var one = number.parseInt(doc.categoryStatistics[categoryId], 0) + count;
        var all = number.parseInt(doc.categoryStatistics['0'], 0) + count;
        var data = {};

        data[categoryId] = one;
        data['0'] = all;

        var data2 = dato.extend(doc.categoryStatistics, data);

        developer.findOneAndUpdate(conditions, {categoryStatistics: data2}, callback);
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
    developer.findOne(conditions, function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            err = new Error('该用户不存在');
            err.code = 404;
            return callback(err);
        }

        if (!doc.columnStatistics) {
            doc.columnStatistics = {};
        }

        var one = number.parseInt(doc.columnStatistics[columnId], 0) + count;
        var all = number.parseInt(doc.columnStatistics['0'], 0) + count;
        var data = {};

        data[columnId] = one;
        data['0'] = all;

        var data2 = dato.extend(doc.columnStatistics, data);

        developer.findOneAndUpdate(conditions, {columnStatistics: data2}, callback);
    });
};


/**
 * 设置阻止
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.setBlock = function (conditions, callback) {
    developer.toggle(conditions, 'isBlock', true, callback);
};

/**
 * 取消阻止
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.cancelBlock = function (conditions, callback) {
    developer.toggle(conditions, 'isBlock', false, callback);
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

        developer.push(conditions, 'organizations', organizationId, callback);
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
    if (!state) {
        return false;
    }

    var ret = crypto.decode(state, configs.secret.session.secret);
    var arr = ret.split('\n');

    if (arr.length !== 3) {
        return false;
    }

    var num1 = number.parseInt(arr[0], 1);
    var num2 = number.parseInt(arr[1], 1);
    var num3 = number.parseInt(arr[2], 1);

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
        // 3. 获取 primary email
        .task(function (next, infoJSON) {
            requestOptions.url = urls.emails + '?' + qs.stringify({
                    access_token: infoJSON.accessToken
                });
            request.get(requestOptions, function (err, data, res) {
                if (err) {
                    return next(err);
                }

                var list;

                try {
                    list = JSON.parse(data);
                } catch (err) {
                    list = null;
                }

                if (!list) {
                    return next(new Error('用户信息解析失败'));
                }

                if (res.statusCode !== 200) {
                    return next(new Error(list.message || '请求认证失败'));
                }

                var hasFind = false;
                var findEmail = '';

                // [
                //    {"email":"cloudcome@163.com","primary":true,"verified":true},
                //    {"email":"ben.smith8@pcc.edu","primary":false,"verified":true}
                // ]
                dato.each(list, function (item) {
                    if (item.verified && item.primary) {
                        hasFind = true;
                        findEmail = item.email;
                        return false;
                    }
                });

                if (!hasFind) {
                    dato.each(list, function (item) {
                        if (item.verified) {
                            hasFind = true;
                            findEmail = item.email;
                            return false;
                        }
                    });
                }

                if (!hasFind) {
                    dato.each(list, function (item) {
                        if (item.primary) {
                            hasFind = true;
                            findEmail = item.email;
                            return false;
                        }
                    });
                }

                if (!hasFind && list.length) {
                    findEmail = list[0].email;
                }

                infoJSON.email = findEmail;
                next(err, infoJSON);
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

            var githubLogin = json.login.toLowerCase();
            var ret = {
                accessToken: json.accessToken,
                githubLogin: githubLogin,
                githubId: String(json.id),
                email: json.email || githubLogin + '@github.com',
                nickname: json.name || githubLogin,
                meta: {
                    bio: json.bio || 'unknown',
                    location: json.location || 'unknown',
                    company: json.company || 'unknown',
                    blog: json.blog || 'TA 什么也没说'
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