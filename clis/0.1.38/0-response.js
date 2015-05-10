'use strict';

var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/index').object;
var response = require('../../webserver/models/index').response;
var howdo = require('howdo');
var random = require('ydr-utils').random;
var dato = require('ydr-utils').dato;

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    var options = {
        page: 1,
        skip: 0,
        limit: 10
    };
    var objectId = '54b7a533ad91ae443987f2d1';
    var parentId = 0;
    var conditions = {
        object: objectId
    };
    var next = function(){
        console.log(arguments);
    };

    if (parentId) {
        conditions.parentResponse = parentId;
    } else {
        conditions.parentResponse = null;
    }

    options.populate = ['author', 'agreers'];
    options.sort = {
        _id: -1
    };

    howdo
        // 1. 查找 object
        .task(function (next) {
            object.findOne({
                _id: objectId,
                isDisplay: true
            }, next);
        })
        .follow(function (err, responseByObject) {
            if (err) {
                return next(err);
            }

            if (!responseByObject) {
                return next();
            }

            var acceptResponseId = responseByObject.acceptByResponse;


            howdo
                //1. count
                .task(function (done) {
                    response.count(conditions, function (err, count) {
                        console.log(arguments);
                        done(err, count);
                    });
                })
                //2. list
                .task(function (done) {
                    // 有采纳答案 && 列出第一页，
                    // 将最佳答案排除，并列到第一位
                    if (acceptResponseId && options.page === 1 && !parentId) {
                        options.nor = {
                            _id: acceptResponseId
                        };
                    }

                    howdo
                        // 最佳
                        .task(function (done) {
                            if (!acceptResponseId || options.page > 1 || parentId) {
                                return done(null, null);
                            }

                            response.findOne({_id: acceptResponseId}, {populate: ['author', 'agreers']}, function (err, resp) {
                                console.log(arguments);
                                done(err, resp);
                            });
                        })
                        // 列表
                        .task(function (done) {
                            response.find(conditions, options, function (err, list) {
                                console.log(arguments);
                                done(err, list);
                            });
                        })
                        // 合并
                        .together(function (err, acceptByResponse, responseList) {
                            var list = [];

                            if (acceptByResponse) {
                                list.push(acceptByResponse);
                            }

                            if (responseList) {
                                list = list.concat(responseList);
                            }

                            done(err, list);
                        });
                })
                // 异步并行
                .together(function (err, count, list) {
                    if (err) {
                        return next(err);
                    }

                    list = list || [];
                    list.forEach(function (item) {
                        item.author = dato.pick(item.author, ['id', 'nickname', 'githubLogin', 'githubId', 'score', 'avatar']);
                        item.agreers = item.agreers || [];
                        item.agreers = item.agreers.map(function (agreer) {
                            return dato.pick(agreer, ['id', 'nickname', 'githubLogin', 'avatarM']);
                        });
                    });

                    console.log(count);
                    console.log(list);
                    console.log('..ok');

                    //res.json({
                    //    code: 200,
                    //    data: {
                    //        count: count,
                    //        list: list
                    //    }
                    //});
                });
        });
});