/*!
 * post service
 * @todo 设置object的各种属性
 * @author ydr.me
 * @create 2014-12-07 16:58
 */

'use strict';

var configs = require('../../configs/');
var scoreMap = configs.score;
var scoreUtil = require('../utils/').score;
var object = require('../models').object;
var interactive = require('./interactive.js');
var section = require('./section.js');
var category = require('./category.js');
var column = require('./column.js');
var label = require('./label.js');
var setting = require('./setting.js');
var developer = require('./developer.js');
var response = require('./response.js');
var notice = require('./notice.js');
var howdo = require('howdo');
var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;
var log = require('ydr-utils').log;
var cache = require('ydr-utils').cache;
var request = require('ydr-utils').request;
var role19 = 1 << 19;


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

                if ((author.role & (1 << doc.role)) === 0) {
                    err = new Error('在该板块暂无发布权限，请联系管理员');
                    err.code = 403;
                    return next(err);
                }

                next(null, doc);
            });
        })
        // 2. 检查 category 是否存在
        .task(function (next, objectInSection) {
            category.findOne({_id: data.category}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该分类不存在');
                    err.code = 404;
                    return next(err);
                }

                next(null, objectInSection, doc);
            });
        })
        // 3. 检查 column 是否存在，以及发布权限
        .task(function (next, objectInSection, objectOnCategory) {
            if (!data.column) {
                data.column = null;
                return next(null, objectInSection, objectOnCategory);
            }

            column.findOne({_id: data.column}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该专辑不存在');
                    err.code = 404;
                    return next(err);
                }

                if (doc.id.toString() !== data.column) {
                    err = new Error('不允许发布到他人专辑内');
                    err.code = 403;
                    return next(err);
                }

                next(null, objectInSection, objectOnCategory, doc);
            });
        })
        // 4. 新建数据
        .task(function (next, objectInSection, objectOnCategory, objectAtColumn) {
            var date = new Date();
            var data2 = dato.select(data, ['section', 'title', 'uri', 'type', 'category', 'labels',
                'column', 'reference', 'content', 'hidden', 'isDisplay']);
            var data3 = {
                author: author.id.toString(),
                publishAt: date,
                updateAt: date,
                updateList: [{
                    developer: author.id.toString(),
                    date: date
                }]
            };
            var data4 = dato.extend(data2, data3);
            var err;

            if (objectInSection.uri === 'link') {
                if (!data4.reference) {
                    err = new Error('链接地址不能为空');
                    return next(err);
                }

                if (!typeis.url(data4.reference)) {
                    err = new Error('链接地址不合法');
                    return next(err);
                }

                if (data4.reference.length > 255) {
                    err = new Error('链接地址过长');
                    return next(err);
                }
            }

            object.createOne(data4, function (err, doc) {
                next(err, objectInSection, objectOnCategory, objectAtColumn, doc);
            });
        })
        // 顺序串行
        .follow(function (err, objectInSection, objectOnCategory, objectAtColumn, doc) {
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

                // 更新 developer.sectionStatistics
                developer.increaseSectionStatistics({_id: author.id}, data.section, 1, log.holdError);

                // 更新 developer.categoryStatistics
                developer.increaseCategoryStatistics({_id: author.id}, data.category, 1, log.holdError);

                // 更新 developer.columnStatistics
                if (data.column) {
                    developer.increaseColumnStatistics({_id: author.id}, data.column, 1, log.holdError);
                }

                // 更新 developer.objectCount
                developer.increaseObjectCount({_id: doc.author.toString()}, 1, log.holdError);

                // 发布积分
                developer.increaseScore({_id: doc.author.toString()}, scoreMap[objectInSection.uri] || 0, log.holdError);

                var appEnv = cache.get('app.configs').app.env;
                var baiduZZ = cache.get('app.settings').website.baiduZZ;

                // 百度站长链接推送
                if (appEnv === 'pro' && baiduZZ) {
                    request.post({
                        url: baiduZZ,
                        body: cache.get('app.configs').app.host + '/' + objectInSection.uri + '/' + doc.uri + '.html',
                        headers: {
                            'content-type': 'text/plain'
                        }
                    }, log.holdError);
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
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该 object 不存在');
                    err.code = 404;
                    return next(err);
                }

                // !(是管理员 || 是作者)
                if (
                    !((author.role & role19) !== 0 ||
                    doc.author.toString() === author.id.toString())
                ) {
                    err = new Error('不允许修改他人的 object');
                    err.code = 403;
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

                if ((author.role & (1 << doc.role)) === 0) {
                    err = new Error('在该板块暂无发布权限');
                    err.code = 403;
                    return next(err);
                }

                next(err, doc);
            });
        })
        // 3. 检查 category 是否存在
        .task(function (next, objectInSection) {
            category.findOne({_id: data.category}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该分类不存在');
                    err.code = 404;
                    return next(err);
                }

                next(err, objectInSection);
            });
        })
        // 4. 检查 column 是否存在，以及发布权限
        .task(function (next, objectInSection) {
            if (!data.column) {
                data.column = null;
                return next(null, objectInSection);
            }

            column.findOne({_id: data.column}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('该专辑不存在');
                    err.code = 404;
                    return next(err);
                }

                if (doc.id.toString() !== data.column) {
                    err = new Error('不允许发布到他人专辑内');
                    err.code = 403;
                    return next(err);
                }

                next(err, objectInSection);
            });
        })
        // 5. 更新
        .task(function (next, objectInSection) {
            var date = new Date();
            var data2 = dato.select(data, ['category', 'column', 'labels',
                'reference', 'content', 'hidden', 'isDisplay']);
            var err;

            data2.updateAt = date;
            data2.$push = {
                updateList: {
                    developer: author.id.toString(),
                    date: date
                }
            };

            if (objectInSection.uri === 'link') {
                if (!data2.reference) {
                    err = new Error('链接地址不能为空');
                    return next(err);
                }

                if (!typeis.url(data2.reference)) {
                    err = new Error('链接地址不合法');
                    return next(err);
                }

                if (data2.reference.length > 255) {
                    err = new Error('链接地址过长');
                    return next(err);
                }
            }

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

                // 更新 developer.increaseSectionStatistics
                if (doc.section.toString() !== oldDoc.section.toString()) {
                    developer.increaseSectionStatistics({_id: author.id}, doc.section, 1, log.holdError);
                    developer.increaseSectionStatistics({_id: author.id}, oldDoc.section, -1, log.holdError);
                }

                // 更新 developer.increaseCategoryStatistics
                if (doc.category.toString() !== oldDoc.category.toString()) {
                    developer.increaseCategoryStatistics({_id: author.id}, doc.category, 1, log.holdError);
                    developer.increaseCategoryStatistics({_id: author.id}, oldDoc.category, -1, log.holdError);
                }

                if (oldDoc.column) {
                    developer.increaseColumnStatistics({_id: author.id}, oldDoc.column, -1, log.holdError);
                    column.increaseObjectCount({_id: oldDoc.column}, -1, log.holdError);
                }

                if (doc.column) {
                    developer.increaseColumnStatistics({_id: author.id}, doc.column, 1, log.holdError);
                    column.increaseObjectCount({_id: doc.column}, 1, log.holdError);
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
                developer: operator.id.toString()
            }, done);
        })
        // 异步并行
        .together(callback);
};


/**
 * 增加 object link 访问数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 数量
 * @param callback {Function} 回调
 */
exports.increaseLinkByCount = function (conditions, count, callback) {
    object.increase(conditions, 'linkByCount', count, callback);
};


/**
 * 增加 object 阅读数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 数量
 * @param callback {Function} 回调
 */
exports.increaseViewByCount = function (conditions, count, callback) {
    object.increase(conditions, 'viewByCount', count, callback);
};


/**
 * 增加 object 评论数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 数量
 * @param callback {Function} 回调
 */
exports.increaseCommentByCount = function (conditions, count, callback) {
    object.increase(conditions, 'commentByCount', count, callback);
};


/**
 * 增加 object 回复数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 数量
 * @param callback {Function} 回调
 */
exports.increaseReplyByCount = function (conditions, count, callback) {
    object.increase(conditions, 'replyByCount', count, callback);
};


/**
 * 增加 object 收藏数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 数量
 * @param callback {Function} 回调
 */
exports.increaseFavoriteByCount = function (conditions, count, callback) {
    object.increase(conditions, 'favoriteByCount', count, callback);
};


/**
 * 增加组织申请数量
 * @param conditions {Object} 查询条件
 * @param count {Number} 数量
 * @param callback {Function} 回调
 */
exports.increaseApplyByCount = function (conditions, count, callback) {
    object.increase(conditions, 'applyByCount', count, callback);
};


/**
 * 最多推入 5 个最新的贡献者
 * @param conditions {Object} 查询条件
 * @param contributor {Object} 贡献者
 * @param callback {Function} 回调
 */
exports.pushContributor = function (conditions, contributor, callback) {
    object.push(conditions, 'contributors', contributor.id.toString(), 5, callback);
};


/**
 * 采纳采纳 response
 * @param operator {Object} 文章作者
 * @param conditions {Object} 查询条件
 * @param responseId {String} 回应 ID
 * @param callback {Function} 回调
 */
exports.acceptByResponse = function (operator, conditions, responseId, callback) {
    howdo
        // 1. 查找 object
        .task(function (next) {
            object.findOne(conditions, {
                populate: ['section']
            }, next);
        })
        // 2. 检查权限
        .task(function (next, acceptObject) {
            var err;

            if (!acceptObject) {
                err = new Error('该 object 不存在');
                err.code = 404;
                return next(err);
            }

            if (acceptObject.section.uri !== 'question') {
                err = new Error('该版块下不允许此操作');
                return next(err);
            }

            if (acceptObject.acceptByResponse) {
                err = new Error('无法重复采纳最佳答案');
                return next(err);
            }

            // 只有作者自己可以采纳
            if (operator.id.toString() === acceptObject.author.toString()) {
                return next(null, acceptObject);
            }

            err = new Error('权限不足');
            err.code = 403;
            next(err);
        })
        // 3. 查找 response
        .task(function (next, acceptObject) {
            response.findOne({
                _id: responseId
            }, function (err, acceptByResponse) {
                if (err) {
                    return next(err);
                }

                if (!acceptByResponse) {
                    err = new Error('该 response 不存在');
                    err.code = 404;
                    return next(err);
                }

                //if (acceptByResponse.author.toString() === operator.id.toString()) {
                //    err = new Error('不能采纳自己的回答');
                //    return next(err);
                //}

                if (acceptByResponse.parentResponse) {
                    err = new Error('不能采纳他人的回复为最近答案');
                    return next(err);
                }

                next(err, acceptObject, acceptByResponse);
            });
        })
        // 4. 更新
        .task(function (next, acceptObject, acceptByResponse) {
            object.findOneAndUpdate(conditions, {
                acceptByAuthor: acceptByResponse.author.toString(),
                acceptByResponse: acceptByResponse.id.toString()
            }, function (err, newDoc, oldDoc) {
                next(err, newDoc, oldDoc, acceptByResponse);
            });
        })
        // 异步顺序串行
        .follow(function (err, newDoc, oldDoc, acceptByResponse) {
            callback(err, newDoc, oldDoc);

            if (!err && newDoc) {
                // 数
                // 当前采纳的人的采纳次数+1
                developer.increaseAcceptCount({_id: operator.id}, 1, log.holdError);
                // 当前被采纳的人的被采纳次数+1
                developer.increaseAcceptByCount({_id: newDoc.acceptByAuthor}, 1, log.holdError);

                // 交互
                interactive.active({
                    source: operator.id.toString(),
                    target: acceptByResponse.author.toString(),
                    type: 'accept',
                    object: newDoc.id.toString(),
                    response: acceptByResponse.id.toString(),
                    value: 1,
                    hasApproved: true
                }, log.holdError);

                if (operator.id.toString() !== newDoc.acceptByAuthor.toString()) {
                    developer.findOne({_id: newDoc.acceptByAuthor}, function (err, doc) {
                        if (err) {
                            return log.holdError(err);
                        }

                        // 知
                        // 通知被采纳的人
                        notice.accept(operator, doc, newDoc, acceptByResponse);

                        // 分
                        // 当前被采纳的人加分
                        developer.increaseScore({_id: newDoc.acceptByAuthor}, scoreUtil.acceptBy(operator, doc), log.holdError);
                    });
                }

                // response
                response.findOneAndUpdate({_id: acceptByResponse.id}, {
                    acceptByObject: newDoc.id.toString()
                }, log.holdError);
            }
        });
};


/**
 * 删除 object
 * @param operator {Object} 操作者
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.findOneAndRemove = function (operator, conditions, callback) {
    howdo
        // 1. 检查权限
        .task(function (next) {
            object.findOne(conditions, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('待删除项目不存在');
                    return next(err);
                }


                if (operator.id.toString() !== doc.author.toString()) {
                    err = new Error('您无权限删除该项目');
                    return next(err);
                }

                if (doc.column) {
                    err = new Error('该项目已被分配专辑，无法被删除');
                    return next(err);
                }

                if (doc.commentByCount) {
                    err = new Error('该项目已被他人评论，无法被删除');
                    return next(err);
                }

                next(err, doc);
            });
        })
        // 2. 删除
        .task(function (next, obj) {
            object.findOneAndRemove(conditions, next);
        })
        // 3. 异步串行
        .follow(function (err, doc) {
            callback(err, doc);

            if (err) {
                return;
            }

            // 1. 文章所在版块的文章数量计数 -1
            section.increaseObjectCount({_id: doc.section}, -1, log.holdError);

            // 2. 文章所在分类的文章数量计数 -1
            category.increaseObjectCount({_id: doc.category}, -1, log.holdError);

            // 3. 文章所在标签的文章数量计数 -1
            doc.labels.forEach(function (name) {
                label.increaseObjectCount({name: name}, -1, log.holdError);
            });

            // 4. 文章作者的文章数量计数 -1
            developer.increaseObjectCount({_id: operator.id}, -1, log.holdError);

            // 5. 文章作者的版块内的文章数量计数 -1
            developer.increaseSectionStatistics({_id: operator.id}, doc.section, -1, log.holdError);

            // 6. 文章作者的分类内的文章数量计数 -1
            developer.increaseCategoryStatistics({_id: operator.id}, doc.category, -1, log.holdError);

            // 7. 文章作者的积分 -分值
            section.findOne({_id: doc.section}, function (err, objectInSection) {
                if (err) {
                    return log.holdError(err);
                }

                developer.increaseScore({_id: operator.id}, -scoreMap[objectInSection.uri] || 0, log.holdError);
            });
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