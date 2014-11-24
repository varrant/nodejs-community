/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 14:35
 */

'use strict';

var howdo = require('howdo');
var ydrUtil = require('ydr-util');
var validators = require('../validators/');
var models = {
    role: require('./role.js'),
    setting: require('./setting.js'),
    user: require('./user.js')
};
var config = require('../../webconfig/');
var DBNAME = config.app.mongodb.match(/\/([^/]*)$/)[1];
var REG_DUPLICATE = new RegExp(DBNAME + '\\..*\\.\\$(.*)_1');


ydrUtil.dato.each(models, function (key, model) {
    var validator = validators[key];

    if (!validator) {
        throw new Error('`' + key + '`验证规则不存在');
    }

    exports[key] = {};

    /**
     * 查找一个对象
     * @param conditions
     * @param callback
     * @returns {*|Query}
     */
    exports[key].findOne = function (conditions, callback) {
        model.findOne(conditions, callback);
    };


    /**
     * 获取某个 meta
     * @param conditions
     * @param [metaKey]
     * @param callback
     */
    exports[key].getMeta = function (conditions, metaKey, callback) {
        if (ydrUtil.typeis(metaKey) === 'function') {
            callback = metaKey;
            metaKey = null;
        }

        this.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('要查找的数据不存在');
                err.type = 'notFound';
                return callback(err);
            }

            var meta = doc.meta;

            callback(err, metaKey ? meta[metaKey] : meta, doc);
        });
    };


    /**
     * 设置某个 meta
     * @param conditions
     * @param metaKey
     * @param [metaVal]
     * @param callback
     */
    exports[key].setMeta = function (conditions, metaKey, metaVal, callback) {
        var metaMap = {};

        if (ydrUtil.typeis(metaVal) === 'function') {
            metaMap = metaKey;
            callback = metaVal;
            metaVal = null;
        } else {
            metaMap[metaKey] = metaVal;
        }

        this.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('要更新的数据不存在');
                err.type = 'notFound';
                return callback(err);
            }

            var meta = doc.meta;
            var data = _toPureData(doc, ['_id']);

            data.meta = ydrUtil.dato.extend(true, {}, meta, metaMap);
            model.findOneAndUpdate(conditions, data, callback);
        });
    };


    /**
     * 查找一个并更新
     * @param {Object} conditions
     * @param {Object} data
     * @param {Function} callback
     * @returns {Query|*}
     */
    exports[key].findOneAndUpdate = function (conditions, data, callback) {
        data = _toPureData(data, ['_id']);

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('要更新的数据不存在');
                err.type = 'notFound';
                return callback(err);
            }

            var newData = {};

            howdo.each(data, function (key, val, next) {
                var validateData = {};

                validateData[key] = val;
                validator.validateOne(validateData, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    ydrUtil.dato.extend(true, newData, data);
                    next();
                });
            }).follow(function (err) {
                if (err) {
                    return callback(err);
                }

                model.findOneAndUpdate(conditions, newData, callback);
            });
        });
    };


    /**
     * 查找一个并删除
     * @param {Object} conditions
     * @param {Function} callback
     * @returns {Query|*}
     */

    exports[key].findOneAndRemove = function (conditions, callback) {
        model.findOneAndRemove(conditions, callback);
    };


    /**
     * 创建一个
     * @param {Object} data
     * @param {Function} callback
     * @returns {Query|*}
     */
    exports[key].createOne = function (data, callback) {
        data = _toPureData(data, ['_id']);
        validator.validateAll(data, function (err, data) {
            if (err) {
                return callback(err);
            }

            var rules = this.rules;

            model.create(data, function (err, doc) {
                if (err) {
                    err = _parseError(rules, err);
                    return callback(err);
                }

                callback(err, doc);
            });
        });
    };


    /**
     * 确保存在一个，不存在时新建，存在时更新
     * @param conditions
     * @param data
     * @param callback
     */
    exports[key].existOne = function (conditions, data, callback) {
        data = _toPureData(data, ['_id']);


        this.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            var docData = _toPureData(doc, ['_id']);
            var saveData;

            // 存在
            if (doc) {
                saveData = ydrUtil.dato.extend(true, {}, docData, data);

                validator.validateAll(saveData, function (err, data) {
                    if (err) {
                        return callback(err);
                    }

                    var rules = this.rules;

                    model.findOneAndUpdate(conditions, data, function (err, doc) {
                        if (err) {
                            err = _parseError(rules, err);
                            return callback(err);
                        }

                        callback(err, doc);
                    });
                });
            } else {
                saveData = ydrUtil.dato.extend(true, {}, conditions, data);
                validator.validateAll(saveData, function (err, data) {
                    if (err) {
                        return callback(err);
                    }

                    var rules = this.rules;

                    model.create(data, function (err, doc) {
                        if (err) {
                            err = _parseError(rules, err);
                            return callback(err);
                        }

                        callback(err, doc);
                    });
                });
            }
        });
    };


    /**
     * 查询数量
     * @param conditions
     * @param callback
     */
    exports[key].count = function (conditions, callback) {
        model.count(conditions, callback);
    };


    /**
     * 原始 model
     */
    exports[key].rawModel = model;
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


/**
 * 数据实例转换为纯净对象
 * @param {Object} data 原始数据
 * @param {Array} removeKeys 待删除属性
 * @returns {Object}
 * @private
 */
function _toPureData(data, removeKeys) {
    if (data && data.constructor !== Object) {
        data = data.toObject();
    }

    if (removeKeys) {
        if (ydrUtil.typeis(removeKeys) === 'string') {
            removeKeys = [removeKeys];
        }

        ydrUtil.dato.each(removeKeys, function (index, key) {
            if (data) {
                delete(data[key]);
            }
        });
    }

    if (data) {
        delete(data.__v);
    }

    return data;
}


/**
 * 解析错误对象
 * @param rules
 * @param err
 * @returns {*}
 * @private
 */
function _parseError(rules, err) {
    // insertDocument :: caused by :: 11000 E11000 duplicate
    // key error index: f2ec.users.$email_1  dup key: { : "cloudcome@163.com" }
    var msg = err.message;
    var code = err.code;
    var path = '';

    // mongodb error
    if (err.name === 'MongoError') {
        switch (code) {
            case 11000:
                path = (msg.match(REG_DUPLICATE) || ['', ''])[1];
                msg = (path ? rules[path].alias : '未知字段') + '重复';
                break;
        }

        err = new Error(msg);
    }

    return err;
}