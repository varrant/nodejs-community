/*!
 * post service
 * @todo 设置object的各种属性
 * @author ydr.me
 * @create 2014-12-07 16:58
 */

'use strict';

var object = require('../models').object;
var section = require('./section.js');
var category = require('./category.js');
var column = require('./column.js');
var label = require('./label.js');
var setting = require('./setting.js');
var engineer = require('./engineer.js');
var howdo = require('howdo');
var dato = require('ydr-util').dato;
var log = require('ydr-log');


/**
 * count
 */
exports.count = object.count;


/**
 * findOne
 */
exports.findOne = object.findOne;

/**
 * find
 */
exports.find = object.find;


/**
 * 新建一个 object
 * @param author {Object} 作者信息对象
 * @param author.id {String} 作者的ID
 * @param author.role {Number} 作者的权限
 * @param data {Object} 更新数据
 * @param callback {Function} 回调
 */
exports.createOne = function (author, data, callback) {
    howdo
        // 1. 检查 section 是否存在，以及发布权限
        .task(function (next) {
            section.findOne({_id: data.section}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该板块不存在');
                    err.status = 404;
                    return next(err);
                }

                if (author.role & Math.pow(2, doc.role) === 0) {
                    err = new Error('在该板块暂无发布权限');
                    err.status = 403;
                    return next(err);
                }

                next();
            });
        })
        // 2. 检查 category 是否存在
        .task(function (next) {
            category.findOne({_id: data.category}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该分类不存在');
                    err.status = 404;
                    return next(err);
                }

                next();
            });
        })
        // 3. 检查 column 是否存在，以及发布权限
        .task(function (next) {
            if (!data.column) {
                return next();
            }

            column.findOne({_id: data.column}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该专栏不存在');
                    err.status = 404;
                    return next(err);
                }

                if (doc.id !== data.column) {
                    err = new Error('不允许发布到他人专栏内');
                    err.status = 403;
                    return next(err);
                }

                next();
            });
        })
        // 4. 新建数据
        .task(function (next) {
            var date = new Date();
            var data2 = dato.pick(data, ['title', 'uri', 'type', 'category', 'labels',
                'introduction', 'content', 'isDisplay']);
            var data3 = {
                author: author.id,
                publishAt: date,
                updateAt: date,
                updateList: [{
                    user: author.id,
                    date: date
                }]
            };
            var data4 = dato.extend(data2, data3);

            object.createOne(data4, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            callback(err, doc);

            if (!err && doc) {
                // 更新 section.objectCount
                section.increaseObjectCount({_id: data.section}, 1, log.holdError);
                // 更新 category.objectCount
                category.increaseObjectCount({_id: data.category}, 1, log.holdError);

                // 更新 column.objectCount
                if (data.column) {
                    column.increaseObjectCount({_id: data.column}, 1, log.holdError);
                }

                // 更新 label.objectCount
                doc.labels.forEach(function (name) {
                    label.increaseObjectCount({name: name}, 1, log.holdError);
                });

                // 更新 engineer.sectionStatistics
                engineer.increaseSectionStatistics({_id: author.id}, data.section, 1, log.holdError);
                // 更新 engineer.categoryStatistics
                engineer.increaseCategoryStatistics({_id: author.id}, data.category, 1, log.holdError);

                // 更新 engineer.columnStatistics
                if (data.column) {
                    engineer.increaseColumnStatistics({_id: author.id}, data.column, 1, log.holdError);
                }
            }
        });
};


/**
 * 更新 object
 * @param author {Object} 作者信息对象
 * @param author.id {String} 作者的ID
 * @param author.role {Number} 作者的权限
 * @param conditions {Object} 查询条件
 * @param data {Object} 更新数据
 * @param callback {Function} 回调
 */
exports.updateOne = function (author, conditions, data, callback) {
    howdo
        // 1. 检查 object 是否存在
        .task(function (next) {
            object.findOne(conditions, function (err, doc) {
                if (err) {
                    return callback(err);
                }

                if (!doc) {
                    err = new Error('该对象不存在');
                    err.status = 404;
                    return next(err);
                }

                next();
            });
        })
        // 2. 检查 section 是否存在，以及发布权限
        .task(function (next) {
            section.findOne({_id: data.section}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该板块不存在');
                    err.status = 404;
                    return next(err);
                }

                if (author.role & Math.pow(2, doc.role) === 0) {
                    err = new Error('在该板块暂无发布权限');
                    err.status = 403;
                    return next(err);
                }

                next();
            });
        })
        // 3. 检查 category 是否存在
        .task(function (next) {
            category.findOne({_id: data.category}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该分类不存在');
                    err.status = 404;
                    return next(err);
                }

                next();
            });
        })
        // 4. 检查 column 是否存在，以及发布权限
        .task(function (next) {
            if (!data.column) {
                return next();
            }

            column.findOne({_id: data.column}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该专栏不存在');
                    err.status = 404;
                    return next(err);
                }

                if (doc.id !== data.column) {
                    err = new Error('不允许发布到他人专栏内');
                    err.status = 403;
                    return next(err);
                }

                next();
            });
        })
        // 5. 更新
        .task(function (next, data3) {
            var date = new Date();
            var data2 = dato.pick(data, ['category', 'column', 'labels', 'introduction', 'content', 'isDisplay']);

            data2.updateAt = date;
            data2.$push = {
                updateList: {
                    user: author.id,
                    date: date
                }
            };

            object.findOneAndUpdate(conditions, data3, next);
        })
        // 顺序串行
        .follow(function (err, doc, oldDoc) {
            callback(err, doc);

            if (!err && doc) {
                // 更新 category.objectCount
                if (doc.category.toString() !== oldDoc.category.toString()) {
                    category.increaseObjectCount({_id: doc.category}, 1, log.holdError);
                    category.increaseObjectCount({_id: oldDoc.category}, -1, log.holdError);
                }

                // 更新 label.objectCount
                var diff = _diff(doc.labels, oldDoc.labels);
                var only1 = diff[0];
                var only2 = diff[1];

                only1.forEach(function (name) {
                    label.increaseObjectCount({name: name}, 1, log.holdError);
                });

                only2.forEach(function (name) {
                    label.increaseObjectCount({name: name}, -1, log.holdError);
                });

                // 更新 engineer.objectStatistics
                if (doc.type !== oldDoc.type) {
                    engineer.increaseObjectTypeCount({_id: author.id}, doc.type, 1, log.holdError);
                    engineer.increaseObjectTypeCount({_id: author.id}, oldDoc.type, -1, log.holdError);
                }
            }
        });
};


/**
 * 根据 object 类型和 uir 获取 object 信息
 * @param type {String}  object 类型，如 opinion
 * @param uri {String}  object URI
 * @param callback {Function}
 */
exports.get = function (type, uri, callback) {
    var conditions = {
        type: type,
        uri: uri
    };

    object.findOne(conditions, callback);
};


/**
 * 增加 object 分数
 * @param operator {Object} 操作者
 * @param id {String} 操作 object ID
 * @param count {Number} 分值
 * @param callback {Function} 回调
 */
exports.increaseScore = function (operator, id, count, callback) {
    var conditions = {
        _id: id
    };

    howdo.task(function (done) {
        object.increase(conditions, 'score', count, done);
    }).task(function (done) {
        var date = new Date();

        object.push(conditions, 'scoreList', {
            date: date,
            score: count,
            user: operator.id
        }, done);
    }).together(callback);
};


/**
 * 增加 object 阅读数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseViewCount = function (conditions, count, callback) {
    object.increase(conditions, 'viewCount', count, callback);
};

/**
 * 增加 object 评论数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseCommentCount = function (conditions, count, callback) {
    object.increase(conditions, 'commentCount', count, callback);
};

/**
 * 增加 object 点赞收藏数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseFavoriteCount = function (conditions, count, callback) {
    object.increase(conditions, 'favoriteCount', count, callback);
};

/**
 * 增加组织申请数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseApplyCount = function (conditions, count, callback) {
    object.increase(conditions, 'applyCount', count, callback);
};


/**
 * 取出两个数组中独有的部分
 * @param arr1
 * @param arr2
 * @returns {*[]}
 * @private
 */
function _diff(arr1, arr2) {
    var only1 = [];
    var only2 = [];

    arr1.forEach(function (item) {
        if (arr2.indexOf(item) === -1) {
            only1.push(item);
        }
    });

    arr2.forEach(function (item) {
        if (arr1.indexOf(item) === -1) {
            only2.push(item);
        }
    });

    return [only1, only2];
}