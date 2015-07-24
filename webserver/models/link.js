/*!
 * 链接模型
 * @author ydr.me
 * @create 2015-07-24 20:55:05
 */

'use strict';

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 作者
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'developer'
    },
    // 链接名称
    text: {
        type: String,
        required: true
    },
    // 链接名称
    url: {
        type: String,
        required: true,
        unique: true
    },
    // 链接描述
    description: {
        type: String,
        required: false
    },
    // logo
    logo: {
        type: String,
        required: false
    },
    // 是否通过了验证
    verified: {
        type: Boolean,
        default: false
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

schema.set('toJSON', { getters: true, virtuals: true });
schema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model('label', schema);