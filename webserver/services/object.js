/*!
 * post service
 * @todo 设置object的各种属性
 * @author ydr.me
 * @create 2014-12-07 16:58
 */

'use strict';

var configs = require('../../configs/');
var scoreMap = configs.score;
var object = require('../models').object;
var section = require('./section.js');
var category = require('./category.js');
var column = require('./column.js');
var label = require('./label.js');
var setting = require('./setting.js');
var engineer = require('./engineer.js');
var response = require('./response.js');
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
                    err.code = 404;
                    return next(err);
                }

                if (author.role & (1 << doc.role) === 0) {
                    err = new Error('在该板块暂无发布权限');
                    err.code = 403;
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
                    err.code = 404;
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
                    err.code = 404;
                    return next(err);
                }

                if (doc.id !== data.column) {
                    err = new Error('不允许发布到他人专栏内');
                    err.code = 403;
                    return next(err);
                }

                next();
            });
        })
        // 4. 新建数据
        .task(function (next) {
            var date = new Date();
            var data2 = dato.pick(data, ['section', 'title', 'uri', 'type', 'category', 'labels',
                'introduction', 'content', 'isDisplay']);
            var data3 = {
                author: author.id,
                publishAt: date,
                updateAt: date,
                updateList: [{
                    engineer: author.id,
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

                if (data.column) {
                    // 更新 column.objectCount
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

                // 更新 engineer.objectCount
                engineer.increaseObjectCount({_id: doc.author}, 1, log.holdError);
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
                    err.code = 404;
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
                    err.code = 404;
                    return next(err);
                }

                if (author.role & (1 << doc.role) === 0) {
                    err = new Error('在该板块暂无发布权限');
                    err.code = 403;
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
                    err.code = 404;
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
                    err.code = 404;
                    return next(err);
                }

                if (doc.id !== data.column) {
                    err = new Error('不允许发布到他人专栏内');
                    err.code = 403;
                    return next(err);
                }

                next();
            });
        })
        // 5. 更新
        .task(function (next) {
            var date = new Date();
            var data2 = dato.pick(data, ['category', 'column', 'labels', 'introduction', 'content', 'isDisplay']);

            data2.updateAt = date;
            data2.$push = {
                updateList: {
                    engineer: author.id,
                    date: date
                }
            };

            object.findOneAndUpdate(conditions, data2, next);
        })
        // 顺序串行
        .follow(function (err, doc, oldDoc) {
            callback(err, doc);

            if (!err && doc) {
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

                // 更新 engineer.increaseSectionStatistics
                if (doc.section.toString() !== oldDoc.section.toString()) {
                    engineer.increaseSectionStatistics({_id: author.id}, doc.section, 1, log.holdError);
                    engineer.increaseSectionStatistics({_id: author.id}, oldDoc.section, -1, log.holdError);
                }

                // 更新 engineer.increaseCategoryStatistics
                if (doc.category.toString() !== oldDoc.category.toString()) {
                    engineer.increaseCategoryStatistics({_id: author.id}, doc.category, 1, log.holdError);
                    engineer.increaseCategoryStatistics({_id: author.id}, oldDoc.category, -1, log.holdError);
                }

                if (oldDoc.column) {
                    engineer.increaseCategoryStatistics({_id: author.id}, oldDoc.column, -1, log.holdError);
                }

                if (doc.column) {
                    engineer.increaseCategoryStatistics({_id: author.id}, doc.column, 1, log.holdError);
                }
            }
        });
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

    howdo
        // 加分
        .task(function (done) {
            object.increase(conditions, 'score', count, done);
        })
        // 历史
        .task(function (done) {
            var date = new Date();

            object.push(conditions, 'scoreList', {
                date: date,
                score: count,
                engineer: operator.id
            }, done);
        })
        // 异步并行
        .together(callback);
};


/**
 * 增加 object 阅读数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseViewByCount = function (conditions, count, callback) {
    object.increase(conditions, 'viewByCount', count, callback);
};

/**
 * 增加 object 评论数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseCommentByCount = function (conditions, count, callback) {
    object.increase(conditions, 'commentByCount', count, callback);
};


/**
 * 增加 object 回复数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseReplyByCount = function (conditions, count, callback) {
    object.increase(conditions, 'replyByCount', count, callback);
};


/**
 * 增加 object 收藏数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseFavoriteByCount = function (conditions, count, callback) {
    object.increase(conditions, 'favoriteByCount', count, callback);
};


/**
 * 增加组织申请数量
 * @param conditions
 * @param count
 * @param callback
 */
exports.increaseApplyByCount = function (conditions, count, callback) {
    object.increase(conditions, 'applyByCount', count, callback);
};


/**
 * 最多推入 5 个最新的贡献者
 * @param conditions
 * @param contributor
 * @param callback
 */
exports.pushContributor = function (conditions, contributor, callback) {
    object.push(conditions, 'contributors', contributor.id, 5, callback);
};


/**
 * 采纳/取消采纳 response
 * @param operator {Object} 文章作者、管理员（19+）都可以
 * @param conditions
 * @param responseId
 * @param boolean
 * @param callback
 */
exports.acceptResponse = function (operator, conditions, responseId, boolean, callback) {
    howdo
        // 1. 查找 object
        .task(function (next) {
            object.findOne(conditions, {
                populate: ['section']
            }, next);
        })
        // 2. 检查权限
        .task(function (next, acceptObject) {
            if (!acceptObject) {
                var err = new Error('该 object 不存在');
                err.code = 404;
                return next(err);
            }

            if (acceptObject.section.uri !== 'question') {
                var err = new Error('该 object 不允许采纳他人评论');
                return next(err);
            }

            if ((operator.role & 1 << 19) !== 0 ||
                operator.id.toString() === acceptObject.author.toString()) {
                return next(null, acceptObject);
            }

            var err = new Error('权限不足');
            err.code = 403;
            next(err);
        })
        // 3. 查找 response
        .task(function (next, acceptObject) {
            response.findOne({
                _id: responseId
            }, function (err, acceptResponse) {
                if (err) {
                    return next(err);
                }

                if (!acceptResponse) {
                    err = new Error('该 response 不存在');
                    err.code = 404;
                    return next(err);
                }

                if (acceptResponse.author.toString() === operator.id.toString()) {
                    err = new Error('不能采纳自己的回答');
                    return next(err);
                }

                if (acceptResponse.parent) {
                    err = new Error('不能采纳他人的回复');
                    return next(err);
                }

                next(err, acceptObject, acceptResponse);
            });
        })
        // 4. 更新
        .task(function (next, oldDoc, acceptResponse) {
            object.findOneAndUpdate(conditions, {
                acceptByAuthor: boolean ? acceptResponse.author : null,
                acceptByResponse: boolean ? acceptResponse.id : null
            }, function (err, newDoc, oldDoc) {
                next(err, newDoc, oldDoc);
            });
        })
        // 异步顺序串行
        .follow(function (err, newDoc, oldDoc) {
            callback(err, newDoc, oldDoc);

            // 设置为采纳
            if (boolean && newDoc) {
                if (newDoc.acceptByAuthor.toString() !== oldDoc.acceptByAuthor.toString()) {
                    // 当前被采纳的人加分
                    engineer.increaseScore({_id: newDoc.acceptByAuthor}, scoreMap.acceptBy, log.holdError);

                    // 当前被取消采纳的人减分
                    engineer.increaseScore({_id: oldDoc.acceptByAuthor}, -scoreMap.acceptBy, log.holdError);
                }
            }
            // 取消采纳
            else if(newDoc) {
                if (newDoc.acceptByAuthor.toString() !== oldDoc.acceptByAuthor.toString()) {
                    // 当前被取消采纳的人减分
                    engineer.increaseScore({_id: newDoc.acceptByAuthor}, -scoreMap.acceptBy, log.holdError);
                }
            }
        });
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