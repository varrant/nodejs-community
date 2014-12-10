/*!
 * lebel service
 * @author ydr.me
 * @create 2014-12-10 17:37
 */

'use strict';


var label = require('../models/').label;


/**
 * 创建一个 scope
 * @param data
 * @param callback
 */
exports.createOne = function (data, callback) {
    var newData = {
        name: data.name
    };

    label.createOne(newData, callback);
};


/**
 * 更新一个 scope
 * @param conditions
 * @param data
 * @param callback
 */
exports.updateOne = function (conditions, data, callback) {
    var newData = {
        name: data.name
    };

    label.findOneAndUpdate(conditions, newData, callback);
};


/**
 * 查找
 */
exports.findOne = label.findOne;


/**
 * 增加 scope 中的 object 数量
 * @param id
 * @param count
 * @param callback
 */
exports.increaseObjectCount = function (id, count, callback) {
    label.increase({_id: id}, 'objectCount', count, callback);
};