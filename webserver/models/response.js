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
        ref: 'developer'
    },
    // markdown 响应内容
    content: {
        type: String,
        required: true
    },
    // html 响应内容
    contentHTML: {
        type: String,
        required: false
    },
    // 响应时间
    publishAt: {
        type: Date,
        default: Date.now
    },
    // 响应对象
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: 'object',
        default: null
    },
    // 父级作者
    parentAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: false,
        ref: 'developer',
        default: null
    },
    // 父级评论
    parentResponse: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: false,
        ref: 'response',
        default: null
    },
    // 赞同数量
    agreeByCount: {
        type: Number,
        default: 0
    },
    // 赞同者，最多五个
    // [{
    //     id: 'xxx'
    // }]
    agreers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developer'
    }],
    // 回复数量
    replyByCount: {
        type: Number,
        default: 0
    },
    // 被采纳的 obejct
    acceptByObject: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: false,
        ref: 'obejct',
        default: null
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