/*!
 * comment service
 * @author ydr.me
 * @create 2014-12-12 17:07
 */

'use strict';


var comment = require('../models/').comment;
var object = require('./object.js');
var user = require('./user.js');
var dato = require('ydr-util').dato;
var howdo = require('howdo');
var noop = function (err) {
    if (err) {
        console.error(err);
    }
};


/**
 * 查找
 */
exports.findOne = comment.findOne;


/**
 * 创建一条评论
 * @param author {Object} 评论者
 * @param author.id {String} 评论者 ID
 * @param data {Object} 评论数据
 * @param meta {Object} 评论 meta 数据，如IP、UA等
 * @param callback {Function} 回调
 */
exports.createOne = function (author, data, meta, callback) {
    var data2 = dato.pick(data, ['content', 'parent', 'object']);

    data2.author = author.id;
    data2.meta = meta;

    howdo
        // 1. 检查父级分类是否存在
        .task(function (next) {
            if (!data2.parent) {
                return next();
            }

            comment.findOne({
                _id: data2.parent
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('the parent is not exist');
                    err.type = 'notFound';
                    return next(err);
                }

                next();
            });
        })
        // 2. 检查 object 是否存在
        .task(function (next) {
            object.findOne({
                _id: data2.object
            }, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    err = new Error('the object is not exist');
                    err.type = 'notFound';
                    return next(err);
                }

                next();
            });
        })
        // 3. 写入
        .task(function (next) {
            comment.createOne(data2, next);
        })
        // 顺序串行
        .follow(function (err, doc) {
            callback(err, doc);

            if (!err && doc) {
                user.increaseCommentCount({_id: author.id}, 1, noop);
            }
        });
};

