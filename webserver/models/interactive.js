/*!
 * 互动模型
 * @author ydr.me
 * @create 2014-12-01 23:44
 */

'use strict';

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 操作者
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'engineer'
    },
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
    // 被操作对象，即ID
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'object'
    },
    // 影响值，默认0
    value: {
        type: Number,
        default: 0
    },
    // 操作时间
    interactiveAt: {
        type: Date,
        default: new Date()
    },
    // 是否被允许，默认 true
    // 是否被读取了
    // 通常为新消息、新申请时，设置为 false
    hasApprove: {
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

schema.set('toJSON', { getters: true, virtuals: true });
schema.set('toObject', { getters: true, virtuals: true });



module.exports = mongoose.model('interactive', schema);