/*!
 * scope service
 * @author ydr.me
 * @create 2014-12-10 17:24
 */

'use strict';

var scope = require('../models/').scope;


/**
 * 根据 scope ID 查找
 * @param id
 * @param callback
 */
exports.findById = function (id, callback) {
    scope.findOne({_id: id}, callback);
};


exports.increaseObjectCount = function () {

}