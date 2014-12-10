/*!
 * scope service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var scope = require('../models/').scope;


/**
 * 创建一个 scope
 * @param data
 * @param callback
 */
exports.createOne = function (data, callback) {
    var newData = {
        name: data.name,
        uri: data.uri,
        cover: data.cover,
        introduction: data.introduction
    };

    scope.createOne(newData, callback);
};


/**
 * 更新一个 scope
 * @param conditions
 * @param data
 * @param callback
 */
exports.createOne = function (conditions, data, callback) {
    var newData = {
        name: data.name,
        uri: data.uri,
        cover: data.cover,
        introduction: data.introduction
    };

    scope.findOneAndUpdate(conditions, newData, callback);
};


/**
 * 根据 scope ID 查找
 * @param id
 * @param callback
 */
exports.findById = function (id, callback) {
    scope.findOne({_id: id}, callback);
};


/**
 * 增加 scope 中的 object 数量
 * @param id
 * @param count
 * @param callback
 */
exports.increaseObjectCount = function (id, count, callback) {
    scope.increase({_id: id}, 'objectCount', count, callback);
};