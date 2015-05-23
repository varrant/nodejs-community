/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-02-12 21:09
 */

'use strict';


var random = require('ydr-utils').random;
var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;
var cache = require('ydr-utils').cache;
var howdo = require('howdo');
var object = require('../../services/').object;
var developer = require('../../services/').developer;
var column = require('../../services/').column;
var section = require('../../services/').section;
var response = require('../../services/').response;
var filter = require('../../utils/').filter;
var log = require('ydr-utils').log;

module.exports = function (app) {
    var exports = {};

    /**
     * list 页
     */
    exports.getList = function (section) {
        return function (req, res, next) {
            section = cache.get('app.sectionIDMap')[section.id];

            var category = req.params.category;
            var columnId = req.params.column;
            var label = req.params.label;
            var status = req.params.status;
            var author = req.params.author;
            var listOptions = filter.skipLimit(req.params);
            var conditions = {
                section: section.id,
                isDisplay: true
            };
            var data = {
                section: section,
                title: section.name,
                choose: {}
            };
            var isAJAX = req.headers['x-request-with'] === 'XMLHttpRequest';
            var categoryId = 0;

            if (cache.get('app.categoryURIMap')[category]) {
                categoryId = cache.get('app.categoryURIMap')[category].id;
                data.choose.category = conditions.category = categoryId;
            }

            if (label) {
                data.choose.label = conditions.labels = label;
            }

            var countOptions = {};
            if (status === 'resolved') {
                data.choose.status = 'resolved';
                listOptions.nor = {acceptByResponse: null};
                countOptions.nor = {acceptByResponse: null};
            } else if (status === 'unresolved') {
                data.choose.status = 'unresolved';
                conditions.acceptByResponse = null;
            }

            var onnext = function () {
                howdo
                    // 统计数量
                    .task(function (done) {
                        object.count(conditions, countOptions, done);
                    })
                    // 列表
                    .task(function (done) {
                        var developerSelect = 'nickname githubLogin email';
                        listOptions.populate = [{
                            path: 'author',
                            select: developerSelect
                        }, {
                            path: 'contributors',
                            select: developerSelect
                        }];
                        listOptions.sort = {publishAt: -1};
                        listOptions.select = 'id title uri category column author ' +
                            'contributors commentByCount viewByCount updateAt publishAt acceptByResponse';
                        object.find(conditions, listOptions, done);
                    })
                    // 查找 columns
                    .task(function (done) {
                        column.find({
                            author: res.locals.$developer.id
                        }, done);
                    })
                    // 异步并行
                    .together(function (err, count, docs, columns) {
                        if (err) {
                            return next(err);
                        }

                        data.columnsMap = {};

                        columns.forEach(function (item) {
                            data.columnsMap[item.id] = item;
                        });

                        data.objects = docs;
                        data.pager = {
                            page: listOptions.page,
                            limit: listOptions.limit,
                            count: count
                        };

                        // clean email
                        data.objects.forEach(function (item) {
                            item.author.email = null;
                            item.contributors.forEach(function (item) {
                                item.email = null;
                            });
                        });

                        data.categoryList = cache.get('app.categoryList');
                        data.categoryIDMap = cache.get('app.categoryIDMap');

                        if (isAJAX) {
                            return res.json({
                                code: 200,
                                data: data
                            });
                        }

                        res.render('front/list-' + section.uri + '.html', data);
                    });
            };

            if (author) {
                // 查找作者
                developer.findOne({
                    githubLogin: author
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        return next();
                    }

                    data.choose.author = de.githubLogin;
                    data.choose.authorNickname = de.nickname;
                    conditions.author = de.id.toString();
                    onnext();
                });
            } else {
                onnext();
            }
        };
    };


    /**
     * ID 303 => uri
     * @param req
     * @param res
     * @param next
     */
    exports.redirect = function (req, res, next) {
        var id = req.query.id;

        object.findOne({
            _id: id,
            isDisplay: true
        }, function (err, doc) {
            if (err) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    return next();
                }
            }

            res.redirect('/' + cache.get('app.sectionIDMap')[doc.section].uri + '/' + doc.uri + '.html');
        });
    };


    /**
     * post 页
     * @param section
     * @returns {Function}(req, res, next)
     */
    exports.getObject = function (section) {
        return function (req, res, next) {
            section = cache.get('app.sectionIDMap')[section.id];

            var uri = req.params.uri;
            var page = req.params.page;
            var data = {};
            var $developer = res.locals.$developer;
            var configs = cache.get('app.configs');

            howdo
                // 查找文章
                .task(function (next) {
                    object.findOne({
                        section: section.id,
                        uri: uri,
                        isDisplay: true
                    }, {
                        populate: ['author', 'category', 'column']
                    }, next);
                })
                // 查找专辑 + 是否回复
                .task(function (next, obje) {
                    if (!obje) {
                        return next(null, obje);
                    }

                    howdo
                        // 查找专辑信息
                        .task(function (done) {
                            object.find({
                                column: obje.column.id
                            }, {
                                not: {
                                    _id: obje.id
                                }
                            }, function (err, list) {
                                if (err) {
                                    log.holdError(err);
                                }

                                data.columnObjects = list || [];
                                done();
                            });
                        })
                        // 是否回复信息
                        .task(function (done) {
                            if ($developer && $developer.id) {
                                response.findOne({
                                    author: $developer.id.toString(),
                                    object: obje.id.toString()
                                }, function (err, resp) {
                                    if (err) {
                                        log.holdError(err);
                                        data.hasResponsed = false;
                                    } else {
                                        data.hasResponsed = !!resp;
                                    }

                                    done();
                                });
                            } else {
                                done();
                            }
                        })
                        // 异步顺序并行
                        .together(function () {
                            next(null, obje);
                        });
                })
                .follow(function (err, obje) {
                    if (err) {
                        return next(err);
                    }

                    if (!obje) {
                        return next();
                    }

                    res.json(data);
                });

            //object.findOne({
            //    section: section.id,
            //    uri: uri,
            //    isDisplay: true
            //}, {
            //    populate: ['author', 'category', 'column']
            //}, function (err, obje) {
            //    if (err) {
            //        return next(err);
            //    }
            //
            //    if (!obje) {
            //        return next();
            //    }
            //
            //    data.hasResponsed = false;
            //    data.title = obje.title;
            //    data.keywords = obje.labels.join('，');
            //    data.description = obje.introduction;
            //    data.column = obje.column;
            //    data.object = obje;
            //    data.page = page;
            //    data.section = section;
            //    data.url = configs.app.host + '/' + section.uri + '/' + obje.uri + '.html';
            //
            //    var onend = function () {
            //        object.increaseViewByCount({_id: obje.id}, 1, log.holdError);
            //        data.section = section;
            //        res.json(obje);
            //        //res.render('front/object-' + section.uri + '.html', data);
            //    };
            //
            //    if ($developer && $developer.id) {
            //        response.findOne({
            //            author: $developer.id.toString(),
            //            object: obje.id.toString()
            //        }, function (err, resp) {
            //            if (err) {
            //                return next(err);
            //            }
            //
            //            data.hasResponsed = !!resp;
            //            onend();
            //        });
            //    } else {
            //        onend();
            //    }
            //});
        };
    };

    return exports;
};
