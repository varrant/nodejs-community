/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 20:07
 */

'use strict';

var configModel = require('../models/').user;
var ydrUtil = require('ydr-util');
var howdo = require('howdo');


/**
 * 设置配置
 * @param key
 * @param val
 * @param callback
 */
exports.set = function (key, val, callback) {
    var map = {};

    if (ydrUtil.typeis(val) === 'function') {
        map = key;
    } else {
        map[key] = val;
    }

    howdo.each(map, function (key, val, done) {
        configModel.existOne({
            key: key
        }, {
            val: val
        }, done);
    }).together(callback);
};


/**
 * 获取配置
 * @param [key]
 * @param callback
 */
exports.get = function (key, callback) {
    // find all
    if (ydrUtil.typeis(key) === 'function') {
        configModel.find({}, callback);
    }
    // fine one
    else {
        configModel.findOne({
            key: key
        }, callback);
    }
};
