/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-02-12 21:11
 */

'use strict';

var column = require('../../services/').column;
var object = require('../../services/').object;
var filter = require('../../utils/').filter;
var howdo = require('howdo');
var log = require('ydr-utils').log;


module.exports = function (app) {
    var exports = {};


    // 所有专辑
    exports.getAllList = function (req, res, next) {
        var listOptions = filter.skipLimit(req.params);

        howdo
            // 统计数量
            .task(function (done) {
                column.count({}, done);
            })
            // 查询列表
            .task(function (done) {
                listOptions.populate = ['author'];
                column.find({}, listOptions, done);
            })
            // 异步并行
            .together(function (err, count, list) {
                if (err) {
                    return next(err);
                }

                var data = {
                    title: '所有专辑',
                    list: list,
                    pager: {
                        page: listOptions.page,
                        limit: listOptions.limit,
                        count: count
                    }
                };

                console.log(data);
                res.render('front/list-all-column.html', data);
            });
    };


    // 单个专辑内的 object
    exports.getOneList = function (req, res, next) {
        var uri = req.params.uri;
        var listOptions = filter.skipLimit(req.params);

        howdo
            // 1. 查找专辑
            .task(function (next) {
                column.findOne({
                    uri: uri
                }, {
                    populate: ['author']
                }, function (err, doc) {
                    if (err) {
                        return next(err);
                    }

                    if (!doc) {
                        err = new Error('该专辑不存在');
                        return next(err);
                    }

                    next(err, doc);
                });
            })
            // 2. 查找 object 列表
            .task(function (next, col) {
                object.find({
                    column: col.id
                }, {
                    populate: ['author', 'contributors']
                }, function (err, docs) {
                    next(err, col, docs);
                });
            })
            .follow(function (err, col, objects) {
                if (err) {
                    return next(err);
                }

                var data = {
                    title: col.name + ':' + col.author.nickname + '的专辑',
                    column: col,
                    objects: objects,
                    pager: {
                        page: listOptions.page,
                        limit: listOptions.limit,
                        count: col.objectCount
                    }
                };

                column.findOneAndUpdate({
                    _id: col.id
                }, {
                    objectCount: objects.length
                }, log.holdError);

                column.increaseViewByCount({_id: col.id}, 1, log.holdError);
                res.render('front/list-one-column.html', data);
            });
    };

    return exports;
};
