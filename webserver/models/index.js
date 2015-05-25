/*!
 * 模型出口
 * @author ydr.me
 * @create 2014-11-22 14:35
 */

'use strict';

var howdo = require('howdo');
var allocation = require('ydr-utils').allocation;
var dato = require('ydr-utils').dato;
var number = require('ydr-utils').number;
var typeis = require('ydr-utils').typeis;
var validators = require('../validators/');
var models = {
    // 分类
    category: require('./category.js'),
    // 专辑
    column: require('./column.js'),
    // 工程师
    developer: require('./developer.js'),
    // 交互
    interactive: require('./interactive.js'),
    // 标注
    label: require('./label.js'),
    // 提醒
    notification: require('./notification.js'),
    // 对象
    object: require('./object.js'),
    // 响应
    response: require('./response.js'),
    // 搜索
    search: require('./search.js'),
    // 版块
    section: require('./section.js'),
    // 配置
    setting: require('./setting.js')
};
var configs = require('../../configs/');
var DBNAME = configs.app.mongodb.match(/\/([^/]*)$/)[1];
var REG_DUPLICATE = new RegExp(DBNAME + '\\..*\\.\\$(.*)_1');


/**
 * 抽象模型方法
 * @function .findOne
 * @function .find
 * @function .count
 * @function .createOne
 * @function .findOneAndUpdate
 * @function .findOneAndRemove
 * @function .existOne
 * @function .getMeta
 * @function .setMeta
 * @function .increase
 * @function .mustIncrease
 * @function .push
 * @function .pull
 * @function .toggle
 * @function .mustToggle
 * @function .rawModel
 */
dato.each(models, function (key, model) {
    var validator = validators[key];

    if (!validator) {
        throw new Error('`' + key + '`验证规则不存在');
    }

    exports[key] = {};

    /**
     * 查找一个
     * @param conditions {Object} 查询条件
     * @param [options] {Object|Function} 约束条件
     * @param callback {Function} 回调
     */
    exports[key].findOne = function (conditions, options, callback) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            callback = args[1];
            options = {};
        }

        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        var query = model.findOne(conditions);

        dato.each(options, function (key, val) {
            if (query[key] && typeis(query[key]) === 'function') {
                query = query[key](val);
            }
        });

        query.exec(function (err, doc) {
            callback(err, doc && doc.toJSON());
        });
    };

    /**
     * 多条件查询
     * @param conditions {Object} 查询条件
     * @param [options] {Object|Function} 约束条件
     * @param callback {Function} 回调
     */
    exports[key].find = function (conditions, options, callback) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            callback = args[1];
            options = {};
        }

        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        var query = model.find(conditions);

        dato.each(options, function (key, val) {
            if (query[key] && typeis.function(query[key])) {
                query = query[key](val);
            }
        });

        query.exec(function (err, docs) {
            docs = docs || [];

            var docs2 = docs.map(function (doc) {
                return doc.toJSON();
            });

            callback(err, docs2);
        });
    };


    /**
     * 计算数量
     * @param conditions {Object} 查询条件
     * @param options {Object} 查询条件
     * @param callback {Function} 回调
     */
    exports[key].count = function (conditions, options, callback) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            callback = args[1];
            options = {};
        }

        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        var query = model.count(conditions);

        dato.each(options, function (key, val) {
            if (query[key] && typeis(query[key]) === 'function') {
                query = query[key](val);
            }
        });

        query.exec(callback);
    };


    /**
     * 创建一个
     * @param data {Object} 数据
     * @param callback {Function} 回调
     */
    exports[key].createOne = function (data, callback) {
        data = _toPureData(data, ['_id']);
        validator.validateAll(data, function (err, data) {
            if (err) {
                return callback(err);
            }

            var rules = this.rules;

            console.log(data);

            model.create(data, function (err, doc) {
                if (err) {
                    err = _parseError(rules, err);
                    return callback(err);
                }

                if (!doc) {
                    err = new Error('create one error');
                    err = _parseError(rules, err);
                    return callback(err);
                }

                callback(err, doc.toJSON(), null);
            });
        });
    };


    /**
     * 查找一个并更新
     * @param conditions {Object} 查询条件
     * @param data {Object} 更新数据
     * @param callback {Function} 回调
     */
    exports[key].findOneAndUpdate = function (conditions, data, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        data = _toPureData(data, ['_id']);

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                return callback(err);
            }

            var newData = {};

            howdo.each(data, function (key, val, next) {
                var validateData = {};

                validateData[key] = val;
                validator.validateOne(validateData, function (err, newVal, data) {
                    if (err) {
                        return next(err);
                    }

                    dato.extend(newData, data);
                    next();
                });
            }).follow(function (err) {
                if (err) {
                    return callback(err);
                }

                model.findOneAndUpdate(conditions, newData, function (err, newDoc) {
                    callback(err, newDoc && newDoc.toJSON(), doc && doc.toJSON());
                });

                //var oldDoc = dato.extend(true, {}, doc.toJSON());
                //
                //dato.extend(doc, newData);
                //doc.save(function (err, newDoc) {
                //    callback(err, newDoc.toJSON(), oldDoc);
                //});
            });
        });
    };


    /**
     * 查找一个并删除
     * @param conditions {Object} 查询条件
     * @param callback {Function} 回调
     */
    exports[key].findOneAndRemove = function (conditions, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOneAndRemove(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                return callback(err);
            }

            callback(err, doc.toJSON());
        });
    };


    /**
     * 确保存在一个，不存在时新建，存在时更新
     * @param conditions {Object} 查询条件
     * @param data {Object} 创建/更新数据
     * @param [options] {Object} 创建/更新配置
     * @param [options.onbeforecreate] {Function} 创建之前
     * @param [options.onaftercreate] {Function} 创建之后
     * @param [options.onbeforeupdate] {Function} 更新之前
     * @param [options.onafterupdate] {Function} 更新之后
     * @param callback {Function} 回调
     */
    exports[key].existOne = function (conditions, data, options, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        data = _toPureData(data, ['_id']);

        var args = allocation.args(arguments);

        if (args.length === 3) {
            callback = args[2];
            options = {};
        }

        this.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            var saveData;

            // 存在
            if (doc) {
                if (options.onbeforeupdate) {
                    data = options.onbeforeupdate(data);
                }

                exports[key].findOneAndUpdate(conditions, data, function (err, newDoc, oldDoc) {
                    callback(err, newDoc, oldDoc);

                    if (!err && newDoc && options.onafterupdate) {
                        options.onafterupdate(newDoc);
                    }
                });
            }
            // 不存在
            else {
                saveData = dato.extend(true, {}, conditions, data);

                if (options.onbeforecreate) {
                    saveData = options.onbeforecreate(saveData);
                }

                exports[key].createOne(saveData, function (err, doc) {
                    callback(err, doc);

                    if (!err && doc && options.onaftercreate) {
                        options.onaftercreate(doc);
                    }
                });
            }
        });
    };


    /**
     * 获取某个 meta
     * @param conditions {Object} 查询条件
     * @param [metaKey] {String} meta 键
     * @param callback {Function} 回调
     */
    exports[key].getMeta = function (conditions, metaKey, callback) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            callback = args[1];
            metaKey = null;
        }

        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                return callback(err);
            }

            var meta = doc.meta;

            callback(err, metaKey ? meta[metaKey] : meta, doc.toJSON());
        });
    };


    /**
     * 设置某个 meta
     * @param conditions {Object} 查询条件
     * @param [metaKey] {String|Object} meta 键、meta 键值对
     * @param [metaVal] {*} meta 值
     * @param callback {Function} 回调
     */
    exports[key].setMeta = function (conditions, metaKey, metaVal, callback) {
        var metaMap = {};

        if (typeis(metaVal) === 'function') {
            metaMap = metaKey;
            callback = metaVal;
            metaVal = null;
        } else {
            metaMap[metaKey] = metaVal;
        }

        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                return callback(err);
            }

            var meta = doc.meta;
            var data = _toPureData(doc, ['_id']);

            data.meta = dato.extend(true, {}, meta, metaMap);
            model.findOneAndUpdate(conditions, data, callback);
        });
    };


    /**
     * 加操作
     * @param conditions {Object} 查询条件
     * @param path {String} 查询字段
     * @param count {Number} 加值
     * @param callback {Function} 回调
     */
    exports[key].increase = function (conditions, path, count, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                return callback(err);
            }

            count = number.parseInt(count, 0);

            if (count === 0) {
                return callback(err, doc);
            }

            var old = number.parseInt(doc[path], 0);
            var data = {};

            data[path] = old + count;

            if (data[path] < 0) {
                data[path] = 0;
            }

            exports[key].findOneAndUpdate(conditions, data, callback);
        });
    };


    /**
     * 必须加操作，存在时增加，不存在时设置为此值
     * @param conditions {Object} 查询条件
     * @param path {String} 查询字段
     * @param count {Number} 加值
     * @param callback {Function} 回调
     */
    exports[key].mustIncrease = function (conditions, path, count, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                conditions[path] = count;
                return exports[key].createOne(conditions, callback);
            }

            count = number.parseInt(count, 0);

            if (count === 0) {
                return callback(err, doc);
            }

            var old = number.parseInt(doc[path], 0);
            var data = {};

            data[path] = old + count;

            if (data[path] < 0) {
                data[path] = 0;
            }

            exports[key].findOneAndUpdate(conditions, data, callback);
        });
    };


    /**
     * 推操作
     * @param conditions {Object} 查询条件
     * @param path {String} 查询字段
     * @param item {*} 项目
     * @param options {Object} 配置
     * @param [options.maxLength=null] {Object} 最大长度
     * @param [options.isUnique=false] {Object} 是否不重复
     * @param [options.isDeleteDuplicatorAndPush=true] {Object} 是否删除重复的，然后追加到末尾
     * @param callback {Function} 回调
     */
    exports[key].push = function (conditions, path, item, options, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        var args = allocation.args(arguments);

        if (args.length === 4) {
            callback = args[3];
            options = {
                maxLength: null,
                isUnique: false,
                isDeleteDuplicatorAndPush: true
            };
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                return callback(err);
            }

            var array = doc[path] || [];

            // 如果超过最大长度
            if (array.length === options.maxLength) {
                array.shift();
            }

            // 可以重复
            if (!options.isUnique) {
                array.push(item);
            }
            // 不能重复
            else {
                var duplicateIndex = array.indexOf(item);

                if (duplicateIndex > -1 && options.isDeleteDuplicatorAndPush) {
                    array.splice(duplicateIndex, 1);
                    array.push(item);
                }
            }


            var data = {};
            data[path] = array;

            model.findOneAndUpdate(conditions, data, function (err, doc) {
                callback(err, doc && doc.toJSON());
            });
        });
    };


    /**
     * 拉操作
     * @param conditions {Object} 查询条件
     * @param path {String} 查询字段
     * @param item {*} 项目
     * @param callback {Function} 回调
     */
    exports[key].pull = function (conditions, path, item, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                return callback(err);
            }

            var pull = {};
            pull[path] = item;
            var options = {
                upsert: true
            };

            model.findOneAndUpdate(conditions, {
                $pull: pull
            }, options, function (err, doc) {
                callback(err, doc && doc.toJSON());
            });
        });
    };


    /**
     * 切换 boolean 值
     * @param conditions {Object} 查询条件
     * @param path {String} 查询字段
     * @param [boolean] {Boolean} 更新布尔值，默认为原来反值
     * @param callback {Function} 回调
     */
    exports[key].toggle = function (conditions, path, boolean, callback) {
        var args = allocation.args(arguments);

        if (args.length === 3) {
            callback = args[2];
            boolean = null;
        }

        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            if (!doc) {
                err = new Error('the document is not exist');
                err.type = 'notFound';
                err.code = 404;
                return callback(err);
            }

            var data = {};

            if (boolean === null) {
                data[path] = !doc[path];
            } else {
                data[path] = !!boolean;
            }

            model.findOneAndUpdate(conditions, data, callback);
        });
    };


    /**
     * 必须切换 boolean 值
     * @param conditions {Object} 查询条件
     * @param path {String} 查询字段
     * @param boolean {Boolean} 默认布尔值，如果不存在，设置为默认值，否则设置为原来的反值
     * @param callback {Function} 回调
     */
    exports[key].mustToggle = function (conditions, path, boolean, callback) {
        if (conditions._id !== undefined && !typeis.mongoId(conditions._id)) {
            return callback(new Error('the id of conditions is invalid'));
        }

        model.findOne(conditions, function (err, doc) {
            if (err) {
                return callback(err);
            }

            var data = {};

            data[path] = boolean;

            if (!doc) {
                return exports[key].createOne(dato.extend(conditions, data), callback);
            }

            data[path] = !doc[path];
            exports[key].findOneAndUpdate(conditions, data, callback);
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
        if (typeis(removeKeys) === 'string') {
            removeKeys = [removeKeys];
        }

        dato.each(removeKeys, function (index, key) {
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
    var key0;
    var msg = err.message;
    var path = '';
    var mongoose = {};

    switch (err.name) {
        case 'MongoError':
            switch (err.code) {
                case 11000:
                    path = (msg.match(REG_DUPLICATE) || ['', ''])[1];
                    msg = (rules[path] ? rules[path].alias || rules[path].name : path) + ' duplicate';
                    mongoose = {
                        type: 'duplicate',
                        path: path
                    };
                    err = new Error(msg);
                    err.mongoose = mongoose;
                    break;
            }
            break;

        case 'ValidationError':
            key0 = Object.keys(err.errors)[0];
            msg = err.errors[key0].message;
            err = new Error(msg);
            break;
    }

    err.code = 500;
    return err;
}