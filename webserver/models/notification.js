/*!
 * 通知
 * @author ydr.me
 * @create 2014-12-13 15:54
 */

'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 通知类型
    // comment: A评论了B的object
    // reply: A回复了B的comment
    // favorite: A收藏了B的object
    // apply: A申请了B的organization
    // follow: A关注了B
    // at: A提到了B
    // score: A的object被管理员加分了
    // color: A的object被管理员加色了
    // essence: A的object被管理员设置为精华
    // recommend: A的object被管理员设置为推荐
    // update: A的object被管理员更新了
    // accepted: A的回答被接受了
    // certificated: A的organization被认证了
    // weibo: A的个人微博被认证了
    // role: A的权限被修改了
    type: {
        type: String,
        required: true
    },
    // 激活者
    activeUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // 被激活者
    activedUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // 被操作对象
    object: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    // 是否已被激活
    hasActived: {
        type: Boolean,
        default: false
    },
    // 激活时间
    activeAt: {
        type: Date,
        default: new Date()
    },
    // 被激活时间
    activedAt: {
        type: Date,
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

module.exports = mongoose.model('notification', schema);