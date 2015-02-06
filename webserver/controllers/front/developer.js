/*!
 * developer
 * @author ydr.me
 * @create 2014-11-23 11:58
 */

'use strict';


var developer = require('../../services/').developer;
var setting = require('../../services/').setting;
var response = require('../../services/').response;
var interactive = require('../../services/').interactive;
var object = require('../../services/').object;
var howdo = require('howdo');
var configs = require('../../../configs/');
var log = require('ydr-log');
var dato = require('ydr-util').dato;
var filter = require('../../utils/').filter;


module.exports = function (app) {
    var exports = {};
    var oauthSettings = app.locals.$setting.oauth;

    // 授权页面
    exports.oauthAuthorize = function (req, res, next) {
        var oauth = developer.createOauthURL(oauthSettings, configs.app.host + '/developer/oauth/callback/');

        req.session.$state = oauth.state;
        res.render('front/oauth-authorize.html', {
            title: '授权登录',
            url: oauth.url
        });
    };


    // 授权回调
    exports.oauthCallback = function (req, res, next) {
        var query = req.query;
        var code = query.code;
        var state = query.state;
        var isSafe = developer.isSafeOauthState(state);
        var err;

        if (!isSafe) {
            err = new Error('非法授权操作');
            err.redirect = '/developer/oauth/authorize/';

            return next(err);
        }

        if (!req.session.$state) {
            err = new Error('请重新授权操作');
            err.redirect = '/developer/oauth/authorize/';

            return next(err);
        }

        if (req.session.$github) {
            return res.render('front/oauth-callback.html', {
                title: '确认登录',
                github: req.session.$github
            });
        }

        howdo
            // 1. 授权
            .task(function (next) {
                developer.oauthCallback(oauthSettings, code, next);
            })
            // 2. 查找用户
            .task(function (next, json) {
                var conditions = {
                    githubId: json.githubId
                };

                developer.findOne(conditions, function (err, data) {
                    next(err, data, json);
                });
            })
            // 异步串行
            .follow(function (err, data, json) {
                if (err) {
                    return next(err);
                }

                json.hasRegister = !!data;
                req.session.$github = json;
                res.render('front/oauth-callback.html', {
                    title: '确认登录',
                    github: json
                });
            });
    };


    // 我的主页
    exports.home = function (req, res, next) {
        var githubLogin = req.params.githubLogin;

        developer.findOne({
            githubLogin: githubLogin
        }, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (!doc) {
                return next();
            }

            var sectionStatistics = {};

            doc.sectionStatistics = doc.sectionStatistics || {};
            app.locals.$section.forEach(function (section) {
                var uri = section.uri;
                var id = section.id;

                sectionStatistics[uri] = doc.sectionStatistics[id] || 0;
            });

            var data = {
                developer: doc,
                title: doc.nickname,
                pageType: 'home',
                sectionStatistics: sectionStatistics
            };

            developer.increaseViewByCount({_id: doc.id}, 1, log.holdError);
            res.render('front/developer-home.html', data);
        });
    };


    // 我的评论
    exports.comment = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找评论
            .task(function (next, de) {
                var options = {
                    sort: {
                        interactiveAt: -1
                    },
                    populate: ['response', 'object', 'target']
                };

                dato.extend(options, skipLimit);

                interactive.find({
                    source: de.id,
                    type: 'comment'
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'comment',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.commentByCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };


    // 我的被评论
    exports.commentBy = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找被评论
            .task(function (next, de) {
                var options = {
                    sort: {
                        interactiveAt: -1
                    },
                    populate: ['response', 'object', 'source']
                };

                dato.extend(options, skipLimit);

                interactive.find({
                    target: de.id,
                    type: 'comment'
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'comment-by',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.commentCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };


    // 我的回复
    exports.reply = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找回复
            .task(function (next, de) {
                var options = {
                    sort: {
                        interactiveAt: -1
                    },
                    populate: ['response', 'object', 'target']
                };

                dato.extend(options, skipLimit);

                interactive.find({
                    source: de.id,
                    type: 'reply'
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'reply',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.replyCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };


    // 我的被回复
    exports.replyBy = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找被回复
            .task(function (next, de) {
                var options = {
                    sort: {
                        interactiveAt: -1
                    },
                    populate: ['source', 'object', 'response']
                };

                dato.extend(options, skipLimit);
                interactive.find({
                    target: de.id,
                    type: 'reply'
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'reply-by',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.replyByCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };

    // 我的赞同
    exports.agree = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找被赞同
            // 查找评论
            .task(function (next, de) {
                var options = {
                    sort: {
                        interactiveAt: -1
                    },
                    populate: ['response', 'object', 'target']
                };

                dato.extend(options, skipLimit);

                interactive.find({
                    source: de.id,
                    type: 'agree'
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'agree',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.commentByCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };


    // 我的被赞同
    exports.agreeBy = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找被赞同
            .task(function (next, de) {
                var options = {
                    populate: ['source', 'object', 'response']
                };

                dato.extend(options, skipLimit);
                interactive.find({
                    type: 'agree',
                    target: de.id.toString()
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'agree-by',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.agreeByCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };

    // 我的采纳
    exports.accept = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找采纳
            .task(function (next, de) {
                var options = {
                    sort: {
                        interactiveAt: -1
                    },
                    populate: ['response', 'object', 'target']
                };

                dato.extend(options, skipLimit);

                interactive.find({
                    source: de.id,
                    type: 'accept'
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'accept',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.commentByCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };

    // 我的被采纳
    exports.acceptBy = function (req, res, next) {
        var githubLogin = req.params.githubLogin;
        var skipLimit = filter.skipLimit(req.params);

        howdo
            // 查找用户
            .task(function (next) {
                developer.findOne({
                    githubLogin: githubLogin
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        err.code = 404;
                        err = new Error('该开发者不存在');
                        return next(err);
                    }

                    next(err, de);
                });
            })
            // 查找被赞同
            .task(function (next, de) {
                var options = {
                    populate: ['source', 'object', 'response']
                };

                dato.extend(options, skipLimit);
                interactive.find({
                    type: 'accept',
                    target: de.id.toString()
                }, options, function (err, docs) {
                    next(err, de, docs);
                });
            })
            // 顺序串行
            .follow(function (err, de, docs) {
                if (err) {
                    return next(err);
                }

                var sectionStatistics = {};

                de.sectionStatistics = de.sectionStatistics || {};
                var sectionURIMap = {};
                app.locals.$section.forEach(function (section) {
                    var uri = section.uri;
                    var id = section.id;

                    sectionURIMap[id] = section.uri;
                    sectionStatistics[uri] = de.sectionStatistics[id] || 0;
                });

                var data = {
                    developer: de,
                    title: de.nickname,
                    pageType: 'accept-by',
                    sectionStatistics: sectionStatistics,
                    sectionURIMap: sectionURIMap,
                    list: docs,
                    skipLimit: skipLimit
                };
                skipLimit.count = de.acceptByCount;

                developer.increaseViewByCount({_id: de.id}, 1, log.holdError);
                res.render('front/developer-home.html', data);
            });
    };

    // 我的object
    exports.object = function (sectionId) {
        return function (req, res, next) {
            var githubLogin = req.params.githubLogin;

            howdo
                // 查找用户
                .task(function (next) {
                    developer.findOne({
                        githubLogin: githubLogin
                    }, function (err, de) {
                        if (err) {
                            return next(err);
                        }

                        if (!de) {
                            err.code = 404;
                            err = new Error('该开发者不存在');
                            return next(err);
                        }

                        next(err, de);
                    });
                })
                // 查找被赞同
                .task(function (next, de) {
                    object.find({
                        author: de.id.toString(),
                        isDisplay: true,
                        section: sectionId
                    }, function (err, docs) {
                        next(err, de, docs);
                    });
                })
                // 顺序串行
                .follow(function (err, de, docs) {
                    if (err) {
                        return next(err);
                    }

                    res.json(docs);
                });
        };
    };

    return exports;
};
