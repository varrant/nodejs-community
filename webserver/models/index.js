/*!
 * 模型出口
 * @author ydr.me
 * @create 2014-11-22 14:35
 */

'use strict';

var howdo = require('howdo');
var ydrUtil = require('ydr-util');
var validators = require('../validators/');
var models = {
    comment: require('./comment.js'),
    interactive: require('./interactive.js'),
    label: require('./label.js'),
    object: require('./object.js'),
    scope: require('./scope.js'),
    setting: require('./setting.js'),
    user: require('./user.js')
};
var configs = require('../../configs/');
var DBNAME = configs.app.mongodb.match(/\/([^/]*)$/)[1];
var REG_DUPLICATE = new RegExp(DBNAME + '\\..*\\.\\$(.*)_1');


/**
 * 添加了以下方法
 * @function .find
 * @function .findOne
 * @function .count
 * @function .createOne
 * @function .existOne
 * @function .findOneAndUpdate
 * @function .getMeta
 * @function .setMeta
 * @function .increase
 * @function .push
 * @function .rawModel
 */
ydrUtil.dato.each(models, function (key, model) {
    var validator = validators[key];

    if (!validator) {
        throw new Error('`' + key + '`验证规则不存在');
    }

    exports[key] = {};

    /**
     * 查找多个
     * @param conditions
     * @param callback
     */
    exports[key].find = function (conditions, callback) {
        model.find(conditions, callback);
    };


    /**
     * 查找一个
     * @param conditions
     * @param callback
     */
    exports[key].findOne = function (conditions, callback) {
        model.findOne(conditions, callback);
    };


    /**
     * 计算数量
     * @param conditions
     * @param callback
     */
    exports[key].count = function (conditions, callback) {
        model.count(conditions, callback);
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

        model.findOne(conditions, function (err, doc) {
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

        model.findOne(conditions, function (err, doc) {
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
     * 加操作
     * @param conditions
     * @param path
     * @param count
     * @param callback
     */
    exports[key].increase = function (conditions, path, count, callback) {
        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('要更新的数据不存在');
                err.type = 'notFound';
                return callback(err);
            }

            count = ydrUtil.dato.parseInt(count, 0);

            if (count === 0) {
                return callback(err, doc);
            }

            var old = ydrUtil.dato.parseInt(doc[path], 0);

            doc[path] = old + count;
            doc.save(callback);
        });
    };


    /**
     * 推操作
     * @param conditions
     * @param path
     * @param item
     * @param callback
     */
    exports[key].push = function (conditions, path, item, callback) {
        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('要更新的数据不存在');
                err.type = 'notFound';
                return callback(err);
            }

            var push = {};
            push[path] = item;
            var options = {
                upsert: true
            };

            model.findByIdAndUpdate(conditions, {
                $push: push
            }, options, callback);
        });
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
    var mongoose = {};

    // mongodb error
    if (err.name === 'MongoError') {
        switch (code) {
            case 11000:
                path = (msg.match(REG_DUPLICATE) || ['', ''])[1];
                msg = (path ? rules[path].alias : '未知字段') + '重复';
                mongoose = {
                    type: 'duplicate',
                    path: path
                };
                break;
        }

        err = new Error(msg);
        err.code = 11000;
        err.mongoose = mongoose;
    }

    return err;
}