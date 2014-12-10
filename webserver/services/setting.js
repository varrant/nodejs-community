/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 20:07
 */

'use strict';

var setting = require('../models/').setting;
var typeis = require('ydr-util').typeis;
var howdo = require('howdo');


/**
 * 设置配置
 * @param key
 * @param val
 * @param callback
 */
exports.set = function (key, val, callback) {
    var map = [];

    if (typeis(val) === 'function') {
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
    if (typeis(key) === 'function') {
        callback = key;
        setting.rawModel.find({}, function (err, docs) {
            if (err) {
                return callback(err);
            }

            var ret = {};
            docs = docs || [];
            docs.forEach(function (doc) {
                ret[doc.key] = doc.val;
            });

            callback(err, ret);
        });
    }
    // fine one
    else {
        setting.findOne({
            key: key
        }, function (err, doc) {
            if (err) {
                return callback(err);
            }

            doc = doc || {};
            callback(err, doc[key]);
        });
    }
};
