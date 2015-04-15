/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-02-12 21:09
 */

'use strict';


var random = require('ydr-utils').random;
var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;
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
            section = app.locals.$sectionIdMap[section.id];

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
            //var categoryMap = {};
            var data = {
                section: section,
                title: section.name,
                //categories: app.locals.$categoryList,
                //categoryMap: categoryMap,
                choose: {}
            };
            //var isPjax = req.headers['x-request-as'] === 'pjax';
            var categoryId = 0;

            if (app.locals.$categoryUriMap[category]) {
                categoryId = app.locals.$categoryUriMap[category].id;
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
                        listOptions.populate = ['author', 'contributors'];
                        listOptions.sort = {publishAt: -1};
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
                        //data.pagination = pagi.pagination({
                        //    page: listOptions.page,
                        //    max: Math.ceil(count / 20),
                        //    url: '/' + section.uri + '/page/:page/'
                        //});
                        //if(isPjax){
                        //    return res.json({
                        //        code: 200,
                        //        data: data
                        //    });
                        //}

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

            res.redirect('/' + app.locals.$sectionIdMap[doc.section].uri + '/' + doc.uri + '.html');
        });
    };


    /**
     * 增加访问次数
     * @param req
     * @param res
     * @param next
     */
    exports.linkByCount = function (req, res, next) {
        var body = req.body || {};
        var id = body.id;

        object.increaseLinkByCount({_id: id}, 1, log.holdError);
        res.send({
            code: 200
        });
    };


    /**
     * post 页
     * @param section
     * @returns {Function}(req, res, next)
     */
    exports.getObject = function (section) {
        return function (req, res, next) {
            section = app.locals.$sectionIdMap[section.id];

            var uri = req.params.uri;
            var page = req.params.page;
            var data = {};
            var $developer = res.locals.$developer;

            object.findOne({
                section: section.id,
                uri: uri,
                isDisplay: true
            }, {
                populate: ['author', 'category', 'column']
            }, function (err, obje) {
                if (err) {
                    return next(err);
                }

                if (!obje) {
                    return next();
                }

                data.hasResponsed = false;
                data.title = obje.title;
                data.object = obje;
                data.page = page;

                var onend = function () {
                    object.increaseViewByCount({_id: obje.id}, 1, log.holdError);
                    //res.json(obje);
                    res.render('front/object-' + section.uri + '.html', data);
                };

                if ($developer && $developer.id) {
                    response.findOne({
                        author: $developer.id.toString(),
                        object: obje.id.toString()
                    }, function (err, resp) {
                        if (err) {
                            return next(err);
                        }

                        data.hasResponsed = !!resp;
                        onend();
                    });
                } else {
                    onend();
                }
            });
        };
    };

    return exports;
};
