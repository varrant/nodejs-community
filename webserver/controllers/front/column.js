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
var log = require('ydr-log');


module.exports = function (app) {
    var exports = {};

    exports.get = function (req, res, next) {
        var uri = req.params.uri;
        var listOptions = filter.skipLimit(req.params);
        var sectionIdMap = app.locals.$sectionIdMap;

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

                res.render('front/column.html', data);
            });
    };

    return exports;
};
