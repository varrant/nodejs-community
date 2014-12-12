/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 20:07
 */

'use strict';

var setting = require('../models/').setting;
var typeis = require('ydr-util').typeis;
var dato = require('ydr-util').dato;
var howdo = require('howdo');


/**
 * 设置配置
 * @param [key] {String} 键
 * @param [val] {String} 值
 * @param callback {Function} 回调
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
 * @param [key] {String} 键
 * @param callback {Function} 回调
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

            callback(err, doc.val);
        });
    }
};


/**
 * 查找某一个可见的 type
 * @param typeName {String} type 名称
 * @param callback {Function} 回调
 */
exports.getType = function (typeName, callback) {
    exports.get('types', function (err, doc) {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            return callback();
        }

        var find = null;

        dato.each(doc, function (index, type) {
            if (type && type.name === typeName && type.isDisplay === true) {
                find = type;
                return false;
            }
        });

        callback(null, find);
    });
};

