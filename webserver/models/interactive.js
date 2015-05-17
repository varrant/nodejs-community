/*!
 * 互动模型
 * @author ydr.me
 * @create 2014-12-01 23:44
 */

'use strict';

//- `comment`: A评论了B的object
//- `reply`: A回复了B的comment
//- `accept`: A的回答被接受了
//- `agree`: A的评论/回复被赞同
//- `role`: A的权限被修改了
//- `favorite`: A收藏了B的object
//- `apply`: A申请了B的organization
//- `follow`: A关注了B
//- `at`: A提到了B
//- `score`: A的object被管理员加分了
//- `color`: A的object被管理员加色了
//- `essence`: A的object被管理员设置为精华
//- `recommend`: A的object被管理员设置为推荐
//- `update`: A的object被管理员更新了
//- `certificated`: A的organization被认证了
//- `weibo`: A的个人微博被认证了


var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 源
    source: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'developer'
    },
    // 目标
    target: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'developer'
    },
    // 类型，详细参考 doc
    type: {
        type: String,
        required: true
    },
    // 类型，详细参考 doc
    value: {
        type: Number,
        required: true,
        default: 1
    },
    // 被操作 object
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'object'
    },
    // 被操作 response
    response: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'response'
    },
    // 操作时间
    interactiveAt: {
        type: Date,
        default: Date.now
    },
    // 是否被允许，默认 true
    // 是否被读取了
    // 通常为新消息、新申请时，设置为 false
    hasApproved: {
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