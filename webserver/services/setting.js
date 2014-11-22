/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 20:07
 */

'use strict';

var setting = require('../models/').setting;
var ydrUtil = require('ydr-util');
var howdo = require('howdo');


/**
 * 设置配置
 * @param key
 * @param val
 * @param callback
 */
exports.set = function (key, val, callback) {
    var map = [];

    if (ydrUtil.typeis(val) === 'function') {
        callback = val;
        map = key;
    } else {
        map.push({
            key: key,
            val: val
        });
    }

    howdo.each(map, function (index, json, done) {
        setting.existOne({
            key: json.key
        }, {
            val: json.val
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
        setting.find({}, callback);
    }
    // fine one
    else {
        setting.findOne({
            key: key
        }, callback);
    }
};
