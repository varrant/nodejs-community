/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 14:19
 */

'use strict';

var mongoose = require('mongoose');

var schema = mongoose.Schema({
    // 邮箱，由 github 过来
    email: {
        type: String,
        required: true,
        unique: true
    },
    // github用户名，由 github 过来
    github: {
        type: String,
        required: true,
        unique: true
    },
    // 密码
    password: {
        type: String,
        required: true
    },
    // 昵称
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    // 角色标识
    // 9 = 超管（owner）
    // 3 = 管理（admin）
    // 2 = 认证（vip）
    // 1 = 会员（member）
    role: {
        type: Number,
        required: true,
        unique: false,
        min: 1,
        max: 9,
        default: 1
    },
    // 注册时间
    signUpAt: {
        type: Date,
        default: new Date
    },
    // 登录时间
    signInAt: {
        type: Date
    },
    // 文章数量
    posts: {
        type: Number,
        default: 0
    },
    // 评论数量
    comments: {
        type: Number,
        default: 0
    },
    // 评论数量
    praises: {
        type: Number,
        default: 0
    },
    // 所在地
    location: {
        type: String
    },
    // 所在组织、公司、企业
    organization: {
        type: String
    },
    // 用户元信息（方便扩展）
    meta: {
        type: Object,
        default: {}
    }
});

module.exports = schema;



