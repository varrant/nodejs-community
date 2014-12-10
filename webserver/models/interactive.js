/*!
 * 互动模型
 * @author ydr.me
 * @create 2014-12-01 23:44
 */

'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 模型，支持 object、user、comment 等
    model: {
        type: String,
        required: true
    },
    // 字段，行为：点赞、评论、分享、关注
    path: {
        type: String,
        required: true
    },
    // 操作者
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    // 被操作对象，即ID
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // 影响值，默认1
    value: {
        type: Number,
        default: 1
    },
    // 操作时间
    at: {
        type: Date,
        default: new Date()
    },
    // 是否被允许，默认 true
    // 是否被读取了
    // 通常为新消息、新申请时，设置为 false
    isApprove: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('interactive', schema);