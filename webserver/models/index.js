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

ydrUtil.dato.each(models, function (key, model) {
    if (validators[key]) {
        throw new Error('`' + key + '`验证规则不存在');
    }

    var validator = validators[key];


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
            validator.validate(data, function (err) {
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
            validator.validate(data, function (err) {
                if (err) {
                    return callback(err);
                }

                model.create(data, callback);
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

        util.each(removeKeys, function (index, key) {
            delete(data[key]);
        });
    }

    delete(data.__v);

    return data;
}

