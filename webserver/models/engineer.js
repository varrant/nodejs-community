/*!
 * 用户模型
 * @author ydr.me
 * @create 2014-11-22 14:36
 */

'use strict';

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 邮箱，由 github 过来
    email: {
        type: String,
        required: true,
        unique: true
    },
    // github 用户名，由 github 授权过来
    // 用户的识别符号
    github: {
        type: String,
        required: true,
        unique: true
    },
    // weibo 用户名，由 weibo 授权过来
    // 用户的认证符号
    weibo: {
        type: String,
        required: false,
        unique: false
    },
    // 昵称
    nickname: {
        type: String,
        required: true,
        unique: false
    },
    // 角色标识，分成0-19的20阶，与运算计算是否有权限
    // 2^0
    // 2^1
    // 2^2
    // ...
    // 2^20
    role: {
        type: Number,
        required: true,
        unique: false,
        min: 1,
        // 管理管理者具有所有权限，即 2^0 + 2^1 + ... + 2^20
        // = 2097151
        max: 2097151,
        default: 1
    },
    // 用户头衔
    title: {
        type: String,
        required: false
    },
    // 注册时间
    registerAt: {
        type: Date,
        default: new Date()
    },
    // 登录时间
    loginAt: {
        type: Date
    },
    // 积分
    score: {
        type: Number,
        default: 1
    },
    // 用户主页访问数量
    viewCount: {
        type: Number,
        default: 1
    },
    // 评论次数
    commentCount: {
        type: Number,
        default: 0
    },
    // 被回复次数
    replyByCount: {
        type: Number,
        default: 0
    },
    // 回答被赞同次数
    agreeByCount: {
        type: Number,
        default: 0
    },
    // 回答被接受次数
    acceptByCount: {
        type: Number,
        default: 0
    },
    // 关注人数
    followCount: {
        type: Number,
        default: 0
    },
    // 被关注人数
    followByCount: {
        type: Number,
        default: 0
    },
    // object 统计
    objectStatistics: {
        type: Object,
        default: {}
    },
    // 是否被阻止登入
    isBlock: {
        type: Boolean,
        default: false
    },
    // 加入的组织、团队
    organizations: {
        type: Array
    },
    // 是否通过了个人认证
    isCertification: {
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

schema.virtual('registerTimestamp').get(function () {
    return this.registerAt.getTime();
});

schema.virtual('loginTimestamp').get(function () {
    return this.loginAt ? this.loginAt.getTime() : 0;
});

module.exports = mongoose.model('engineer', schema);
//
//
///**
// * 阶乘
// * @param n
// */
//function _powAll(n) {
//    if (n === 0) {
//        return 1;
//    }
//
//    return Math.pow(2, n) + _powAll(n - 1);
//}