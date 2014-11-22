/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 14:35
 */

'use strict';

var ydrUtil = require('ydr-util');
var validators = require('../validators/');
var models = {
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
        if (ydrUtil.typeis(conditions) === 'object' && !conditions._bsontype && ydrUtil.typeis(callback) === 'function') {
            return model.findOne.call(model, conditions, callback);
        } else {
            throw new Error('`conditions`必须为对象且不能为mongoose数据对象，`callback`必须为函数');
        }
    };

    /**
     *
     * @param {String} id值
     * @param {Function} callback
     * @returns {*|Query}
     */
    exports[key].findById = function (id, callback) {
        if (ydrUtil.typeis.mongoId(id) && ydrUtil.typeis(callback) === 'function') {
            return this.findOne({
                _id: id
            }, callback);
        } else {
            throw new Error('`id`必须为mongoose ObjectId或24位小写英文数字字符串，`callback`必须为函数');
        }
    };


    /**
     * 查找一个并更新
     * @param {Object} conditions
     * @param {Object} data
     * @param {Function} callback
     * @returns {Query|*}
     */
    exports[key].findOneAndUpdate = function (conditions, data, callback) {
        if (ydrUtil.typeis(conditions) === 'object' && !conditions._bsontype && ydrUtil.typeis(data) === 'object' && ydrUtil.typeis(callback) === 'function') {
            data = _toPureData(data, ['_id']);
            validator.validateAll(data, function (err, data) {
                if (err) {
                    return callback(err);
                }

                model.findOneAndUpdate.call(model, conditions, data, callback);
            });
        } else {
            throw new Error('`conditions`必须为对象且不能为mongoose数据对象，`data`必须为对象，`callback`必须为函数');
        }
    };

    /**
     * 查找一个并更新
     * @param {String} id值
     * @param {Object} data
     * @param {Function} callback
     * @returns {Query|*}
     */
    exports[key].findByIdAndUpdate = function (id, data, callback) {
        if (ydrUtil.typeis.mongoId(id) && ydrUtil.typeis(data) === 'object' && ydrUtil.typeis(callback) === 'function') {
            this.findOneAndUpdate({
                _id: id
            }, data, callback);
        } else {
            throw new Error('`id`必须为mongoose ObjectId或24位小写英文数字字符串，`data`必须为对象，`callback`必须为函数');
        }
    };

    /**
     * 查找一个并删除
     * @param {Object} conditions
     * @param {Function} callback
     * @returns {Query|*}
     */

    exports[key].findOneAndRemove = function (conditions, callback) {
        if (ydrUtil.typeis(conditions) === 'object' && !conditions._bsontype && ydrUtil.typeis(callback) === 'function') {
            return model.findOneAndRemove.call(model, conditions, callback);
        } else {
            throw new Error('`conditions`必须为对象且不能为mongoose数据对象，`callback`必须为函数');
        }
    };


    /**
     * 查找一个并删除
     * @param {String} id值
     * @param {Function} callback
     * @returns {Query|*}
     */
    exports[key].findByIdAndRemove = function (id, callback) {
        if (ydrUtil.typeis.mongoId(id) && ydrUtil.typeis(callback) === 'function') {
            return this.findOneAndRemove({
                _id: id
            }, callback);
        } else {
            throw new Error('`id`必须为mongoose ObjectId或24位小写英文数字字符串，`callback`必须为函数');
        }
    };


    /**
     * 创建一个
     * @param {Object} data
     * @param {Function} callback
     * @returns {Query|*}
     */
    exports[key].createOne = function (data, callback) {
        if (ydrUtil.typeis(data) === 'object' && ydrUtil.typeis(callback) === 'function') {
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
        } else {
            throw new Error('`data`必须为对象，`callback`必须为函数');
        }
    };
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
    if (data.constructor !== Object) {
        data = data.toObject();
    }

    if (removeKeys) {
        if (ydrUtil.typeis(removeKeys) === 'string') {
            removeKeys = [removeKeys];
        }

        ydrUtil.dato.each(removeKeys, function (index, key) {
            delete(data[key]);
        });
    }

    delete(data.__v);

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