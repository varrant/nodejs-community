/*!
 * response schema
 * @author ydr.me
 * @create 2014-12-02 22:04
 */

'use strict';

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 用户ID
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: false,
        ref: 'engineer'
    },
    // 响应内容
    content: {
        type: String,
        required: true
    },
    // 响应时间
    publishAt: {
        type: Date,
        default: new Date()
    },
    // 响应对象
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: 'object',
        default: null
    },
    // 响应父级
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: false,
        ref: 'response',
        default: null
    },
    // 赞同数量
    agreeCount: {
        type: Number,
        default: 0
    },
    // 回复数量
    replyCount: {
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

schema.set('toJSON', { getters: true, virtuals: true });
schema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model('response', schema);