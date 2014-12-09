/*!
 * 评论模型
 * @author ydr.me
 * @create 2014-12-02 22:04
 */

'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 用户ID
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: false,
        ref: 'user'
    },
    // 评论内容
    content: {
        type: String,
        required: true
    },
    // 是否显示评论
    // true = 显示评论，审核通过的
    // false = 待审核评论，审核不通过或者待审的
    isDisplay: {
        type: Boolean,
        default: true
    },
    // 评论时间
    publishAt: {
        type: Date,
        default: new Date()
    },
    // 评论文章
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: 'post',
        default: null
    },
    // 评论父级
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        unique: false,
        ref: 'comment',
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

module.exports = mongoose.model('comment', schema);