/*!
 * 分类模型
 * @author ydr.me
 * @create 2014-12-02 21:07
 */

'use strict';

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 类型
    // 1：文章分类
    // 2：导航分类
    type: {
        type: Number,
        default: 1
    },
    // 名称
    name: {
        type: String,
        required: true,
        unique: true
    },
    // URI
    uri: {
        type: String,
        required: true,
        unique: true
    },
    // 封面
    cover: {
        type: String,
        required: true
    },
    // 简介
    introduction: {
        type: String,
        required: true
    },
    // 索引值，用于排序
    index: {
        type: Number,
        default: 1
    },
    // 项目数量
    objectCount: {
        type: Number,
        default: 0
    },
    // 元信息（方便扩展）
    // 因为是复合数据，因此不会做数据验证
    // 因此必须再写入的时候自行验证
    // 一般这些数据都是由程序主动写入的
    // 与访问者无关
    meta: {
        type: Object,
        default: {}
    }
});

schema.set('toJSON', {getters: true, virtuals: true});
schema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('category', schema);